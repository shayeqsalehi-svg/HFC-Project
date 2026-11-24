/* Dashboard – stats and charts */
(function () {
  "use strict";

  if (!window.Admin || !Admin.ready) return;

  const team = Admin.load(Admin.KEYS.team, Admin.defaults.team);
  const services = Admin.load(Admin.KEYS.services, Admin.defaults.services);
  const blog = Admin.load(Admin.KEYS.blog, Admin.defaults.blog);
  const work = Admin.load(Admin.KEYS.work, Admin.defaults.work);
  const clients = Admin.load(Admin.KEYS.clients, Admin.defaults.clients);

  /* Stats cards */

  function renderStats() {
    document.getElementById("stat-team").textContent = team.length;
    document.getElementById("stat-services").textContent = services.length;
    document.getElementById("stat-blog").textContent = blog.length;
    document.getElementById("stat-work").textContent = work.length;
    document.getElementById("stat-clients").textContent = clients.length;
  }

  /* Services list */

  function renderServices() {
    const listElement = document.getElementById("dashboard-services-list");
    document.getElementById("dashboard-services-empty").hidden = services.length > 0;
    services.forEach(function (service, index) {
      const item = document.createElement("li");
      item.className = "admin-service-item";

      const number = document.createElement("span");
      number.className = "admin-service-number";
      number.textContent = String(index + 1).padStart(2, "0");
      item.appendChild(number);

      if (service.image) {
        const thumb = document.createElement("img");
        thumb.className = "admin-thumb";
        thumb.src = Admin.resolveSrc(service.image);
        thumb.alt = "";
        thumb.loading = "lazy";
        thumb.addEventListener("error", function () {
          thumb.hidden = true;
        });
        item.appendChild(thumb);
      }

      const text = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = service.name || "Service";
      const summary = document.createElement("p");
      summary.textContent = Admin.truncate(service.bio, 240);
      text.append(title, summary);
      item.appendChild(text);

      listElement.appendChild(item);
    });
  }

  /* ---------- Chart 1: content distribution (donut) ---------- */

  function renderDistribution(container) {
    const groups = [
      { label: "Team members", value: team.length, color: "#367fce" },
      { label: "Services", value: services.length, color: "#18a58c" },
      { label: "Blog posts", value: blog.length, color: "#e39a45" },
      { label: "Our Work", value: work.length, color: "#8a6bd1" },
      { label: "Clients", value: clients.length, color: "#d66c83" },
    ];
    const total = groups.reduce(function (sum, item) {
      return sum + item.value;
    }, 0);

    let angle = 0;
    const segments = groups.map(function (item) {
      const part = (total ? (item.value / total) * 100 : 0) * 3.6;
      const segment = item.color + " " + angle + "deg " + (angle + part) + "deg";
      angle += part;
      return segment;
    });

    const donut = document.createElement("div");
    donut.className = "admin-donut";
    donut.style.background = total
      ? "conic-gradient(" + segments.join(",") + ")"
      : "conic-gradient(#dfe5e8 0deg 360deg)";
    donut.innerHTML =
      '<div class="admin-donut-hole"><strong>' +
      total +
      "</strong><span>Total items</span></div>";
    container.appendChild(donut);

    const legend = document.createElement("div");
    legend.className = "admin-chart-legend";
    groups.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "admin-legend-row";
      const label = document.createElement("span");
      label.className = "admin-legend-label";
      const dot = document.createElement("i");
      dot.style.background = item.color;
      const name = document.createElement("span");
      name.textContent = item.label;
      label.append(dot, name);
      const value = document.createElement("strong");
      value.textContent =
        item.value +
        (total ? " · " + Math.round((item.value / total) * 100) + "%" : "");
      row.append(label, value);
      legend.appendChild(row);
    });
    container.appendChild(legend);
  }

  /* ---------- Chart 2: all dashboard content by month (12-month movable window) ---------- */

  function renderMonthly(container) {
    // Count current records from every dashboard section. New records receive
    // createdAt in CRUD; legacy blog posts fall back to their publication date.
    const sources = [
      { key: Admin.KEYS.team, fallback: Admin.defaults.team, label: "Team" },
      { key: Admin.KEYS.services, fallback: Admin.defaults.services, label: "Services" },
      { key: Admin.KEYS.blog, fallback: Admin.defaults.blog, label: "Blog" },
      { key: Admin.KEYS.work, fallback: Admin.defaults.work, label: "Our Work" },
      { key: Admin.KEYS.clients, fallback: Admin.defaults.clients, label: "Clients" },
    ];
    const counts = {};
    let totalRecords = 0;
    function parseDate(raw) {
      if (!raw) return null;
      if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw;
      const value = String(raw).trim();
      const match = value.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/);
      let date = match
        ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3] || 1))
        : new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    sources.forEach(source => {
      const records = Admin.load(source.key, source.fallback);
      let migrated = false;
      records.forEach(item => {
        totalRecords++;
        // Prefer the actual dashboard creation timestamp. Older records may only
        // have a publication/date field; records with no usable date are assigned
        // to the current month and saved so they are not omitted again.
        let date = parseDate(item.createdAt || item.created_at);
        if (!date) date = parseDate(item.date || item.publishedAt || item.publishDate);
        if (!date) {
          date = new Date();
          item.createdAt = date.toISOString();
          migrated = true;
        } else if (!item.createdAt) {
          item.createdAt = date.toISOString();
          migrated = true;
        }
        const key = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
        counts[key] = (counts[key] || 0) + 1;
      });
      // Backfill old/undated content in this section's localStorage.
      if (migrated) {
        try { localStorage.setItem(source.key, JSON.stringify(records)); }
        catch (error) { console.warn("Could not update dates for " + source.label, error); }
      }
    });

    // A movable 12-month window: users can navigate to previous and future years.
    let windowStart = new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
    const viewport = document.createElement("div");
    viewport.className = "admin-month-viewport";
    viewport.id = "months-viewport";
    const bars = document.createElement("div");
    bars.className = "admin-month-bars";
    viewport.appendChild(bars);
    container.appendChild(viewport);
    const heading = document.createElement("p");
    heading.className = "admin-month-range";
    container.appendChild(heading);

    function draw() {
      bars.innerHTML = "";
      const months = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(windowStart.getFullYear(), windowStart.getMonth() + i, 1);
        const key = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
        months.push({ date, key, value: counts[key] || 0 });
      }
      const max = Math.max(1, ...months.map(m => m.value));
      heading.textContent = months[0].date.toLocaleDateString(undefined, { month: "short", year: "numeric" }) +
        " – " + months[11].date.toLocaleDateString(undefined, { month: "short", year: "numeric" }) +
        " · " + totalRecords + " current items across all sections";
      months.forEach(month => {
        const column = document.createElement("div");
        column.className = "admin-month-column";
        const labelFull = month.date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
        column.title = labelFull + ": " + month.value + " items added/current";
        const value = document.createElement("strong"); value.textContent = month.value;
        const track = document.createElement("div"); track.className = "admin-month-track";
        const fill = document.createElement("span");
        fill.style.height = (month.value ? Math.max(8, month.value / max * 100) : 2) + "%";
        track.appendChild(fill);
        const label = document.createElement("small"); label.textContent = month.date.toLocaleDateString(undefined, { month: "short" });
        const year = document.createElement("small"); year.className = "admin-month-year"; year.textContent = String(month.date.getFullYear());
        column.append(value, track, label, year); bars.appendChild(column);
      });
    }
    const previous = document.getElementById("months-prev");
    const next = document.getElementById("months-next");
    function shift(amount) {
      windowStart = new Date(windowStart.getFullYear(), windowStart.getMonth() + amount, 1);
      draw(); viewport.scrollLeft = 0;
    }
    if (previous) previous.onclick = () => shift(-6);
    if (next) next.onclick = () => shift(6);
    draw();
    if (!totalRecords) {
      const note = document.createElement("p"); note.className = "admin-chart-empty";
      note.textContent = "Monthly activity will appear when content is added to any dashboard section.";
      container.appendChild(note);
    }
    // Refresh the overview if another admin tab/window changes localStorage.
    window.addEventListener("storage", () => { container.innerHTML = ""; renderMonthly(container); }, { once: true });
  }

  /* ---------- Start ---------- */

  Admin.onReady(function () {
    renderStats();
    const distribution = document.getElementById("content-distribution");
    const monthly = document.getElementById("posts-by-month");
    if (distribution) renderDistribution(distribution);
    if (monthly) renderMonthly(monthly);
  });
})();
