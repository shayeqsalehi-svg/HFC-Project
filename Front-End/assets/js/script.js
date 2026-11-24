/* Public site JS – theme, menu, content helpers */

/* Theme (dark / light) – uses data-theme on <html> */

(function applySavedThemeEarly() {
  try {
    const saved = localStorage.getItem("hfc-theme");
    if (saved === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      document.documentElement.removeAttribute("data-theme"); // dark is default
    }
  } catch (e) {
    /* storage blocked */
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const root = document.documentElement;

  if (!themeButton || !themeIcon) return;

  // Create stars dynamically (only shown in light mode)
  const starsContainer = document.createElement("span");
  starsContainer.className = "theme-stars";

  for (let i = 0; i < 4; i++) {
    const star = document.createElement("span");
    star.className = `theme-star star-${i + 1}`;
    star.textContent = "✦";
    starsContainer.appendChild(star);
  }

  themeButton.appendChild(starsContainer);

  function isLight() {
    return root.dataset.theme === "light";
  }

  function updateThemeUI() {
    if (isLight()) {
      themeIcon.textContent = "☾";
      themeButton.setAttribute("aria-label", "Switch to dark mode");
      themeButton.setAttribute("title", "Switch to dark mode");
      starsContainer.classList.remove("show-stars");
    } else {
      themeIcon.textContent = "☀";
      themeButton.setAttribute("aria-label", "Switch to light mode");
      themeButton.setAttribute("title", "Switch to light mode");
      starsContainer.classList.remove("show-stars");
    }
  }

  updateThemeUI();

  themeButton.addEventListener("click", () => {
    if (isLight()) {
      root.removeAttribute("data-theme");
      try {
        localStorage.setItem("hfc-theme", "dark");
      } catch (e) {}
    } else {
      root.dataset.theme = "light";
      try {
        localStorage.setItem("hfc-theme", "light");
      } catch (e) {}
    }
    updateThemeUI();
  });

  themeButton.addEventListener("mouseenter", () => {
    if (isLight()) {
      starsContainer.classList.add("show-stars");
    }
  });

  themeButton.addEventListener("mouseleave", () => {
    starsContainer.classList.remove("show-stars");
  });
});

/* Dropdown menu */

document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".nav-item.dropdown");
  const dropdownButton = document.querySelector(".dropdown-btn");

  if (!dropdown || !dropdownButton) return;

  let closeTimer;

  // Open dropdown
  function openDropdown() {
    clearTimeout(closeTimer);

    dropdown.classList.add("is-open");

    dropdownButton.setAttribute("aria-expanded", "true");
  }

  // Close dropdown after 1.5 seconds
  function closeDropdown() {
    closeTimer = setTimeout(function () {
      dropdown.classList.remove("is-open");

      dropdownButton.setAttribute("aria-expanded", "false");
    }, 150);
  }

  // Mouse enters About area
  dropdown.addEventListener("mouseenter", openDropdown);

  // Mouse leaves About area
  dropdown.addEventListener("mouseleave", closeDropdown);

  // Click support
  dropdownButton.addEventListener("click", function (event) {
    event.stopPropagation();

    if (dropdown.classList.contains("is-open")) {
      clearTimeout(closeTimer);

      dropdown.classList.remove("is-open");

      dropdownButton.setAttribute("aria-expanded", "false");
    } else {
      openDropdown();
    }
  });

  // Close when clicking outside
  document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target)) {
      clearTimeout(closeTimer);

      dropdown.classList.remove("is-open");

      dropdownButton.setAttribute("aria-expanded", "false");
    }
  });

  // Close with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      clearTimeout(closeTimer);

      dropdown.classList.remove("is-open");

      dropdownButton.setAttribute("aria-expanded", "false");
    }
  });
});

// ------------------------------------------------------------------------------------------------------------------

/* Current page file name, e.g. "index.html" (empty path = home page).
   Pages inside /admin/ get an "admin/" prefix ("admin/services.html"), so they are
   never mistaken for the public page with the same file name ("services.html"). */

const PAGE =
  (window.location.pathname.indexOf("/admin/") !== -1 ? "admin/" : "") +
  (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

/* /  2. Demo blog posts + image helper  / */
/* First-visit demo articles: editable/removable from Dashboard → Blog Posts. */
(function seedDemoBlog() {
  if (localStorage.getItem("hfc-blog") !== null) return;
  const demos = [
    {
      id: "demo-consulting-growth",
      name: "How Business Consulting Supports Sustainable Growth",
      slug: "business-consulting-sustainable-growth",
      category: "Business Strategy",
      date: "2026-10-20",
      author: "Hewad Future Consultancy",
      readTime: "5 min read",
      image: "assets/Image/HFC_image/vision.webp",
      description:
        "Discover practical ways expert consulting helps organizations grow with confidence.",
      content:
        "## Why consulting matters\n\nBusiness consulting helps organizations understand their challenges, identify opportunities, and make decisions with confidence. A clear outside perspective can turn complex problems into practical priorities.\n\n## Set clear business goals\n\nStart by defining measurable objectives and assigning responsibility. A focused plan helps teams use time and resources more effectively.\n\n## Improve processes and performance\n\nReview daily operations, remove unnecessary steps, and measure results regularly. Small improvements can create lasting value.\n\n## Build a sustainable future\n\nSustainable growth requires strong leadership, reliable financial planning, and continuous learning.\n\n## Key takeaways\n\n- Set measurable goals.\n- Use data to guide decisions.\n- Review progress consistently.\n- Invest in people and systems.",
    },
    {
      id: "demo-strategic-planning",
      name: "The Power of Strategic Planning",
      slug: "the-power-of-strategic-planning",
      category: "Planning",
      date: "2026-10-22",
      author: "Hewad Future Consultancy",
      readTime: "4 min read",
      image: "assets/Image/HFC_image/vision.webp",
      description:
        "A practical strategy gives your team direction and a shared understanding of success.",
      content:
        "## Turn vision into action\n\nStrategic planning connects an organization's vision with clear actions. It helps leaders choose priorities and communicate direction to their teams.\n\n## Understand your current position\n\nReview strengths, weaknesses, opportunities, and risks before setting a plan. Honest analysis creates a realistic starting point.\n\n## Create measurable objectives\n\nBreak long-term goals into achievable milestones, assign owners, and set deadlines.\n\n## Monitor and adapt\n\nTrack progress, learn from results, and update the plan when circumstances change.",
    },
    {
      id: "demo-financial-health",
      name: "Building Strong Financial Health",
      slug: "building-strong-financial-health",
      category: "Finance",
      date: "2026-10-25",
      author: "Hewad Future Consultancy",
      readTime: "6 min read",
      image: "assets/Image/HFC_image/vision.webp",
      description:
        "Simple financial practices can help organizations stay resilient and make better decisions.",
      content:
        "## Know your numbers\n\nReliable financial information helps leaders understand performance and make timely decisions. Keep records accurate and review them regularly.\n\n## Plan cash flow\n\nForecast income and expenses, prepare for seasonal changes, and maintain an appropriate reserve.\n\n## Control costs wisely\n\nEvaluate spending against business priorities. Focus on value rather than cutting essential resources.\n\n## Review financial performance\n\nUse a small set of meaningful indicators and discuss them with the team each month.",
    },
  ];
  localStorage.setItem("hfc-blog", JSON.stringify(demos));
})();

/* Resolve image paths consistently on index.html, blog.html and blog-details.html. */
function hfcResolveBlogImage(value, title = "") {
  const fallbackByTitle = [
    [
      /finance|financial|budget|cash/i,
      "assets/Image/HFC_image/financial-sector.webp",
    ],
    [
      /strateg|planning|strategy/i,
      "assets/Image/HFC_image/strategic-planning-meeting.webp",
    ],
    [/growth|business|consult/i, "assets/Image/HFC_image/our-work.webp"],
    [/leadership|team|people/i, "assets/Image/HFC_image/intro.webp"],
  ];
  const fallback =
    fallbackByTitle.find(([pattern]) => pattern.test(title))?.[1] ||
    "assets/Image/HFC_image/vision.webp";
  if (!value || typeof value !== "string") return fallback;
  const raw = value.trim();
  if (/^(data:image\/|https?:\/\/|blob:)/i.test(raw)) return raw;
  // Dashboard paths may be saved with ./ or without it; normalize both.
  return raw.replace(/^\.\//, "");
}

/* /  3. Shared site behaviour (all pages)  / */
function initSite() {
  /* Highlight current page in nav */
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".primary-nav a[data-page]").forEach((link) => {
    if (link.dataset.page === currentFile) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* Show current About page name instead of "About" */
  const aboutLabels = {
    "about.html": "About Us",
    "our-work.html": "Our Work",
    "our-team.html": "Our Team",
  };
  const aboutLabel = aboutLabels[currentFile];
  const dropdownBtn = document.querySelector(".primary-nav .dropdown-btn");
  const dropdownItem = document.querySelector(".primary-nav .nav-item.dropdown");

  if (aboutLabel && dropdownBtn) {
    const arrow = dropdownBtn.querySelector(".dropdown-arrow");
    dropdownBtn.textContent = "";
    dropdownBtn.appendChild(document.createTextNode(aboutLabel + " "));
    if (arrow) {
      dropdownBtn.appendChild(arrow);
    } else {
      const span = document.createElement("span");
      span.className = "dropdown-arrow";
      span.textContent = "⌄";
      dropdownBtn.appendChild(span);
    }
    dropdownBtn.classList.add("active");
    if (dropdownItem) dropdownItem.classList.add("active");
  }

  /* Theme handled above */

  /* 4. Automatic copyright year */
  const yearLabel = document.querySelector("#current-year");
  if (yearLabel) {
    yearLabel.textContent = new Date().getFullYear();
  }

  /* 5. Reveal cards when they enter the viewport */
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const revealItems = document.querySelectorAll(
    ".service-card, .service-detail, .sector-card, .value-card, .benefit-card",
  );

  if ("IntersectionObserver" in window && !motionPreference.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal-on-scroll");
      revealObserver.observe(item);
    });
  }
}

/* /  4. Public content (Dashboard data on public pag */
function initPublicContent() {
  const read = (key) => {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (_) {
      return [];
    }
  };
  const page = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  /* /  TEAM: match static teamcard structure from inde */
  const team = read("hfc-team");
  if (
    localStorage.getItem("hfc-team") !== null &&
    ["index.html", "our-team.html"].includes(page)
  ) {
    const section = document.getElementById("page-team");
    const grid = section && section.querySelector(".value-grid");
    if (grid) {
      grid.replaceChildren();
      team.forEach((person) => {
        const card = document.createElement("article");
        card.className = "value-card team-card";

        const photo = document.createElement("img");
        photo.className = "team-photo";
        photo.src = person.image || "assets/Image/team/team-member.webp";
        photo.alt = person.name || "Team member";
        photo.loading = "lazy";
        photo.decoding = "async";
        photo.width = 540;
        photo.height = 360;

        const info = document.createElement("div");
        info.className = "value-card team-into";

        const avatar = document.createElement("div");
        avatar.className = "avatar-stack";
        const initials = document.createElement("span");
        const nameParts = (person.name || "HFC").trim().split(/\s+/);
        initials.textContent =
          nameParts
            .map((x) => x[0])
            .join("")
            .slice(0, 3)
            .toUpperCase() || "HFC";
        avatar.append(initials);

        const nameP = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = person.name || "Team member";
        nameP.append(
          strong,
          document.createElement("br"),
          document.createTextNode(person.role || "HFC Team"),
        );

        const bio = document.createElement("small");
        bio.textContent = person.bio || "";

        info.append(avatar, nameP, bio);
        card.append(photo, info);

        if (person.phone || person.email) {
          const row = document.createElement("div");
          row.className = "trust-row";
          const contacts = document.createElement("div");
          contacts.className = "trust-contacts";

          if (person.phone) {
            const a = document.createElement("a");
            a.className = "trust-contact-item";
            a.href = "tel:" + person.phone.replace(/[^+0-9]/g, "");
            a.title = "Call";
            a.innerHTML =
              '<span class="trust-contact-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg></span><span>' +
              person.phone +
              "</span>";
            contacts.append(a);
          }
          if (person.email) {
            const a = document.createElement("a");
            a.className = "trust-contact-item";
            a.href = "mailto:" + person.email;
            a.title = "Email";
            a.innerHTML =
              '<span class="trust-contact-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span><span>' +
              person.email +
              "</span>";
            contacts.append(a);
          }
          row.append(contacts);
          card.append(row);
        }
        grid.append(card);
      });
    }
  }

  /* Clients on index / clients page */
  const clients = read("hfc-clients");
  if (["index.html", "clients.html"].includes(page)) {
    const grid =
      document.getElementById("clients-grid") ||
      document.querySelector("#page-clients .sector-grid");

    const makeClientCard = (client, index) => {
      const card = document.createElement("article");
      card.className = "sector-card";

      const copy = document.createElement("div");
      copy.className = "sector-copy";

      const badge = document.createElement("span");
      badge.className = "pill";
      badge.textContent = String(index + 1).padStart(2, "0");

      const h = document.createElement("h2");
      h.textContent = client.name || client.role || "Client";

      const summary = document.createElement("p");
      summary.className = "sector-summary";
      summary.textContent =
        client.bio || client.role || "Our valued client and partner";

      copy.append(badge, h, summary);

      const entries = String(client.details || "")
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);
      if (entries.length) {
        const ul = document.createElement("ul");
        ul.className = "sector-items";
        entries.forEach((text) => {
          const li = document.createElement("li");
          li.textContent = text;
          ul.append(li);
        });
        copy.append(ul);
      }

      const img = document.createElement("img");
      img.src = client.image || "assets/Image/HFC_image/target-clients.webp";
      img.alt = client.name || "Client";
      img.loading = "lazy";
      img.decoding = "async";

      card.append(copy, img);
      return card;
    };

    if (grid) {
      grid.replaceChildren();
      if (clients.length) {
        clients.forEach((client, index) => {
          grid.append(makeClientCard(client, index));
        });
      } else if (page === "index.html") {
        const empty = document.createElement("p");
        empty.className = "section-intro";
        empty.style.gridColumn = "1 / -1";
        empty.textContent = "Client posts added from the dashboard will appear here.";
        grid.append(empty);
      }
    } else if (page === "clients.html" && clients.length) {
      // clients.html without a fixed grid: inject section
      document.getElementById("dashboard-clients")?.remove();
      const section = document.createElement("section");
      section.className = "section-space section-tint";
      section.id = "dashboard-clients";
      const container = document.createElement("div");
      container.className = "container";
      const heading = document.createElement("div");
      heading.className = "section-heading";
      heading.innerHTML =
        '<p class="eyebrow">Our Clients & Partners</p><h2>Trusted <span class="gradient-text">Clients</span></h2>';
      const g = document.createElement("div");
      g.className = "sector-grid";
      clients.forEach((client, index) => g.append(makeClientCard(client, index)));
      container.append(heading, g);
      section.append(container);
      const cta = document.querySelector(".cta-section");
      if (cta) cta.parentNode.insertBefore(section, cta);
      else document.querySelector("main")?.append(section);
    }
  }

  /* Services on index / services page */
  const services = read("hfc-services");
  if (["index.html", "services.html"].includes(page)) {
    const grid =
      document.getElementById("services-grid") ||
      document.querySelector("#page-services .sector-grid");

    const makeServiceCard = (service, index) => {
      const card = document.createElement("article");
      card.className = "sector-card";

      const copy = document.createElement("div");
      copy.className = "sector-copy";

      const badge = document.createElement("span");
      badge.className = "pill";
      badge.textContent = String(index + 1).padStart(2, "0");

      const h = document.createElement("h2");
      h.textContent = service.name || "Service";

      const summary = document.createElement("p");
      summary.className = "sector-summary";
      summary.textContent = service.bio || service.description || "";

      copy.append(badge, h, summary);

      const img = document.createElement("img");
      let src = service.image || "assets/Image/HFC_image/strategy.webp";
      src = String(src).replace(/^\.\//, "");
      img.src = src;
      img.alt = service.name || "Service";
      img.loading = "lazy";
      img.decoding = "async";

      card.append(copy, img);
      return card;
    };

    // Prefer dashboard data; on index use built-in defaults if none saved yet
    let list = services;
    if (!list.length && page === "index.html") {
      list = [
        {
          name: "Strategy, Management & Organizational Development",
          bio: "We help organizations develop effective strategies, strengthen organizational structures, improve management systems, and achieve sustainable growth",
          image: "assets/Image/HFC_image/strategy.webp",
        },
        {
          name: "Financial Advisory, Risk Management, Governance & compliance",
          bio: "We provide financial advisory, risk management, internal audit, compliance, and governance solutions to strengthen financial sustainability, accountability, and institutional performance",
          image: "assets/Image/HFC_image/financial.webp",
        },
        {
          name: "IT, Artificial Intelligence, Cyber Security & Digital Transformation",
          bio: "We support organizations through IT consulting, AI solutions, digital transformation, cybersecurity, and technology-driven innovation to improve efficiency and organizational capabilities.",
          image: "assets/Image/HFC_image/digital.webp",
        },
        {
          name: "Project Management, Research & Development",
          bio: "We provide project management, monitoring and evaluation, market research, policy development, institutional strengthening, and business development advisory services",
          image: "assets/Image/HFC_image/project-management.webp",
        },
        {
          name: "Training, Capacity Building & Human Resources",
          bio: "We help organizations develop their human resources, strengthen professional skills, improve institutional capacity, and establish effective knowledge management systems.",
          image: "assets/Image/HFC_image/training.webp",
        },
      ];
    }

    if (grid && list.length) {
      grid.replaceChildren();
      list.forEach((service, index) => {
        grid.append(makeServiceCard(service, index));
      });
    } else if (page === "services.html" && list.length) {
      const existing = document.querySelector("main .sector-grid");
      if (existing && localStorage.getItem("hfc-services") !== null) {
        existing.replaceChildren();
        list.forEach((service, index) => {
          existing.append(makeServiceCard(service, index));
        });
      }
    }
  }
}
/* Blog details page */
function initBlogDetails() {
  if (PAGE !== "blog-details.html") return;
  let posts = [];
  try {
    posts = JSON.parse(localStorage.getItem("hfc-blog") || "[]");
  } catch (_) {
    posts = [];
  }
  if (!Array.isArray(posts) || !posts.length) return;
  const requested = new URLSearchParams(location.search).get("post") || "";
  const slugify = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  // Prefer the unique record ID; slug is supported for old/static links.
  const post =
    posts.find((item) => String(item.id || "") === requested) ||
    posts.find((item) => String(item.slug || slugify(item.name)) === requested);
  if (!post) return; // Never show another post's text when the requested one is missing.

  const hero = document.querySelector(".article-hero");
  const title = hero && hero.querySelector("h1");
  const category = hero && hero.querySelector(".category");
  const meta = hero && hero.querySelectorAll(".article-meta span");
  const breadcrumb = hero && hero.querySelector(".breadcrumb");
  const image = document.querySelector(".article-content .featured-image");
  const body = document.querySelector(".article-content .article-body");
  if (title) title.textContent = post.name || "Blog article";
  if (category) category.textContent = post.category || "Insights";
  if (breadcrumb)
    breadcrumb.replaceChildren(
      ...[
        document.createTextNode("Home / "),
        Object.assign(document.createElement("a"), {
          href: "blog.html",
          textContent: "Blog",
        }),
        document.createTextNode(" / " + (post.name || "Article")),
      ],
    );
  if (meta && meta[0])
    meta[0].textContent = post.date
      ? new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";
  if (meta && meta[1]) meta[1].textContent = post.readTime || "Article";
  if (meta && meta[2])
    meta[2].textContent = "By " + (post.author || "Hewad Future Consultancy");
  if (image) {
    image.src = hfcResolveBlogImage(post.image, post.name);
    image.alt = post.name || "Article image";
    image.hidden = false;
    image.onerror = () => {
      image.onerror = null;
      image.src = "assets/Image/HFC_image/vision.webp";
    };
  }
  if (body) {
    body.replaceChildren();
    const text = String(
      post.content || post.bio || post.description || "",
    ).trim();
    // Blank lines create paragraphs. Lines beginning with ## or ### become headings;
    // lines beginning with - become bullet lists, so authors can format articles in Dashboard.
    const blocks = text
      .split(/\n\s*\n/)
      .map((x) => x.trim())
      .filter(Boolean);
    blocks.forEach((block, index) => {
      const lines = block
        .split(/\n/)
        .map((x) => x.trim())
        .filter(Boolean);
      if (lines.every((line) => /^[-*]\s+/.test(line))) {
        const ul = document.createElement("ul");
        lines.forEach((line) => {
          const li = document.createElement("li");
          li.textContent = line.replace(/^[-*]\s+/, "");
          ul.append(li);
        });
        body.append(ul);
        return;
      }
      if (/^###\s+/.test(block)) {
        const h = document.createElement("h3");
        h.textContent = block.replace(/^###\s+/, "");
        body.append(h);
        return;
      }
      if (/^##\s+/.test(block)) {
        const h = document.createElement("h2");
        h.textContent = block.replace(/^##\s+/, "");
        body.append(h);
        return;
      }
      const p = document.createElement("p");
      if (index === 0) p.className = "article-lead";
      p.textContent = lines.join(" ");
      body.append(p);
    });
    if (!text) {
      const p = document.createElement("p");
      p.className = "article-lead";
      p.textContent =
        "This article has no content yet. Please edit it in Dashboard → Blog Posts and add its full content.";
      body.append(p);
    }
  }
  // Build "In this article" from the headings of THIS post's content.
  const toc = document.querySelector(".toc-list");
  if (toc) {
    toc.replaceChildren();
    const headings = body ? [...body.querySelectorAll("h2,h3")] : [];
    headings.forEach((heading, index) => {
      const id = "post-section-" + (index + 1);
      heading.id = id;
      const li = document.createElement("li"),
        a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = heading.textContent;
      li.append(a);
      toc.append(li);
    });
    if (!headings.length) {
      const li = document.createElement("li");
      li.textContent = "Overview";
      toc.append(li);
    }
  }
  // Related articles are other records, never hard-coded content from a different article.
  const relatedSection = [...document.querySelectorAll("section")].find(
    (sec) => sec.querySelector("h2")?.textContent.trim() === "Related Articles",
  );
  const relatedGrid = relatedSection?.querySelector(".blog-grid");
  if (relatedGrid) {
    relatedGrid.replaceChildren();
    const others = posts
      .filter((item) => String(item.id || "") !== String(post.id || ""))
      .slice(0, 3);
    others.forEach((item) => {
      const card = document.createElement("article");
      card.className = "blog-card";
      card.dataset.category = item.category || "General";
      const img = document.createElement("img");
      img.src = hfcResolveBlogImage(item.image, item.name);
      img.alt = item.name || "Related article";
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = () => {
        img.onerror = null;
        img.src = "assets/Image/HFC_image/vision.webp";
      };
      card.append(img);
      const content = document.createElement("div");
      content.className = "blog-card-content";
      const cat = document.createElement("span");
      cat.className = "category";
      cat.textContent = item.category || "General";
      const h = document.createElement("h3"),
        a = document.createElement("a");
      a.href =
        "blog-details.html?post=" + encodeURIComponent(item.id || item.slug);
      a.textContent = item.name || "Blog article";
      h.append(a);
      const desc = document.createElement("p");
      desc.textContent =
        item.description ||
        item.bio ||
        "Read this article for practical insights.";
      const more = document.createElement("a");
      more.className = "text-link";
      more.href = a.href;
      more.textContent = "Read More →";
      content.append(cat, h, desc, more);
      card.append(content);
      relatedGrid.append(card);
    });
    if (!others.length) relatedSection.hidden = true;
  }
  /* "Older article" link at the bottom points to the next record in the list. */
  const postNav = document.querySelector(".post-nav");
  if (postNav) {
    const older = posts[(posts.indexOf(post) + 1) % posts.length];
    const olderLink = postNav.querySelector("a.next");
    if (older && older !== post && olderLink) {
      olderLink.href =
        "blog-details.html?post=" + encodeURIComponent(older.id || older.slug);
      olderLink.querySelector("strong").textContent =
        older.name || "Blog article";
    } else {
      postNav.hidden = true;
    }
  }
  document.title =
    (post.name || "Blog article") + " | Hewad Future Consultancy";
}

/* /  6. Blog page + article extras (blog.html, blogd */
function initBlog() {
  if (PAGE !== "blog.html" && PAGE !== "blog-details.html") return;

  /* 1. Keep "Blog" highlighted in the menu on the article page too */
  document
    .querySelector('.primary-nav a[data-page="blog.html"]')
    ?.classList.add("active");

  /* 2. Category buttons + search box */
  const cards = document.querySelectorAll(
    ".blog-grid .blog-card[data-category]",
  );
  const chips = document.querySelectorAll(".filter-chip");
  const searchBox = document.querySelector(".blog-search");
  const emptyMessage = document.querySelector(".blog-empty");

  if (searchBox && chips.length) {
    let category = "all";

    const showMatches = () => {
      const word = searchBox.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach((card) => {
        const matchCategory =
          category === "all" || card.dataset.category === category;
        const matchSearch = card.textContent.toLowerCase().includes(word);
        card.hidden = !(matchCategory && matchSearch);
        if (!card.hidden) visible++;
      });

      emptyMessage.hidden = visible > 0;
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        category = chip.dataset.category.replace("&amp;", "&");
        chips.forEach((item) =>
          item.setAttribute("aria-pressed", String(item === chip)),
        );
        showMatches();
      });
    });

    searchBox.addEventListener("input", showMatches);
  }

  /* 3. Reading progress bar */
  const bar = document.querySelector(".reading-progress span");
  if (bar) {
    const updateBar = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", updateBar, { passive: true });
    updateBar();
  }

  /* 4. Highlight the section being read in "In this article" */
  const tocLinks = document.querySelectorAll(".toc-list a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          tocLinks.forEach((link) =>
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id,
            ),
          );
        });
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    tocLinks.forEach((link) => {
      const heading = document.querySelector(link.getAttribute("href"));
      if (heading) sectionObserver.observe(heading);
    });
  }

  /* 5. Copy link button */
  const copyButton = document.querySelector(".copy-link");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyButton.textContent = "Copied ✓";
      } catch (error) {
        copyButton.textContent = "Copy failed";
      }
      setTimeout(() => (copyButton.textContent = "Copy link"), 1800);
    });
  }
}

/* /  7. Admin login page (admin.html)  / */
function initAdmin() {
  /* /  STEP 1: Get the things we need from the page  / */

  var signupForm =
    document.getElementById("signup-form"); /* the Sign up form */
  var loginForm = document.getElementById("login-form"); /* the Log in form */
  var message =
    document.getElementById("auth-message"); /* the red message text */
  var tabs =
    document.querySelectorAll(".admin-tabs button"); /* the two tab buttons */

  /* /  STEP 2: Read the saved accounts  / */

  /* Require the user to sign in each time the login page is opened. */
  localStorage.removeItem("hfc-session");

  /* Get the saved accounts. If nothing is saved yet, start with an empty list. */
  var savedText = localStorage.getItem("hfc-admins");
  var admins = [];
  if (savedText !== null) {
    admins = JSON.parse(savedText);
  }

  /* Default project login credentials requested for the demo. */
  var defaultAdmin = {
    name: "Shayeq Salehi",
    email: "shayeqsalehi@gmail.com",
    password: "123456",
  };
  /* Ensure the project owner's account works with the displayed credentials.
     If an older version saved a different password, migrate it automatically. */
  var defaultAccount = admins.find(function (admin) {
    return (
      String(admin.email || "")
        .trim()
        .toLowerCase() === defaultAdmin.email
    );
  });
  if (defaultAccount) {
    defaultAccount.name = defaultAdmin.name;
    defaultAccount.email = defaultAdmin.email;
    defaultAccount.password = defaultAdmin.password;
  } else {
    admins.push(defaultAdmin);
  }
  localStorage.setItem("hfc-admins", JSON.stringify(admins));

  /* /  STEP 3: Tabs (Sign up / Log in)  / */

  /* This function shows one form and hides the other one */
  function showForm(formId) {
    message.textContent = ""; /* clear the old message */

    if (formId === "signup-form") {
      signupForm.hidden = false;
      loginForm.hidden = true;
    } else {
      signupForm.hidden = true;
      loginForm.hidden = false;
    }

    /* Make the clicked tab look active */
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].dataset.form === formId) {
        tabs[i].classList.add("active");
      } else {
        tabs[i].classList.remove("active");
      }
    }
  }

  /* When someone clicks a tab, open the form of that tab */
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function () {
      showForm(this.dataset.form);
    });
  }

  /* When the page opens: if an account exists show Log in, if not show Sign up */
  showForm("login-form");

  /* /  STEP 4: Eye button (show / hide password)  / */

  var eyeButtons = document.querySelectorAll(".password-toggle");

  for (var i = 0; i < eyeButtons.length; i++) {
    eyeButtons[i].addEventListener("click", function () {
      var input =
        this.parentElement.querySelector(
          "input",
        ); /* the password box next to the button */
      var eyeOpen = this.querySelector(".eye-on"); /* normal eye icon */
      var eyeCrossed = this.querySelector(".eye-off"); /* crossed eye icon */

      if (input.type === "password") {
        /* Password is hidden -> show it */
        input.type = "text";
        if (eyeOpen) eyeOpen.style.display = "none";
        if (eyeCrossed) eyeCrossed.style.display = "block";
      } else {
        /* Password is visible -> hide it */
        input.type = "password";
        if (eyeOpen) eyeOpen.style.display = "block";
        if (eyeCrossed) eyeCrossed.style.display = "none";
      }
    });
  }

  /* /  STEP 5: Open the dashboard  / */

  function openDashboard(admin) {
    /* Remember who is logged in (only the name and email, not the password) */
    var session = { name: admin.name, email: admin.email };
    localStorage.setItem("hfc-session", JSON.stringify(session));

    /* Go to the dashboard page */
    location.href = "admin/dashboard.html";
  }

  /* /  Approved email access list  / */
  /* Only emails listed here may create a new dashboard account. */
  var DEFAULT_ALLOWED_EMAILS = [
    "shayeqsalehi@gmail.com",
    "admin@hewadfuture.com",
    "hewadfuture@gmail.com",
  ];
  var allowedEmails = JSON.parse(
    localStorage.getItem("hfc-allowed-emails") || "null",
  );
  if (!Array.isArray(allowedEmails)) {
    allowedEmails = DEFAULT_ALLOWED_EMAILS.slice();
    localStorage.setItem("hfc-allowed-emails", JSON.stringify(allowedEmails));
  }
  allowedEmails = allowedEmails.map(function (email) {
    return String(email).trim().toLowerCase();
  });

  /* /  STEP 6: Sign up button  / */

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault(); /* stop the page from reloading */

    /* Read what the person typed */
    var name = signupForm.elements["name"].value.trim();
    var email = signupForm.elements["email"].value.trim().toLowerCase();
    var password = signupForm.elements["password"].value;
    var confirm = signupForm.elements["confirm"].value;

    /* Check 1: password must be at least 6 characters */
    if (password.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      return;
    }

    /* Check 2: both passwords must be the same */
    if (password !== confirm) {
      message.textContent = "Passwords do not match.";
      return;
    }

    /* Check 3: only pre-approved email addresses can register */
    if (allowedEmails.indexOf(email) === -1) {
      message.textContent =
        "This email is not approved for account creation. Contact the administrator.";
      return;
    }

    /* Check 4: this email must not be used before */
    for (var i = 0; i < admins.length; i++) {
      if (admins[i].email === email) {
        message.textContent = "This email is already used. Please log in.";
        return;
      }
    }

    /* All checks passed -> create the new account and save it */
    var newAdmin = { name: name, email: email, password: password };
    admins.push(newAdmin);
    localStorage.setItem("hfc-admins", JSON.stringify(admins));

    openDashboard(newAdmin);
  });

  /* /  STEP 7: Log in button  / */

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); /* stop the page from reloading */

    /* Read what the person typed */
    var email = loginForm.elements["email"].value.trim().toLowerCase();
    var password = loginForm.elements["password"].value;

    /* Look in the saved accounts for the same email AND the same password */
    for (var i = 0; i < admins.length; i++) {
      if (admins[i].email === email && admins[i].password === password) {
        openDashboard(admins[i]); /* found it -> open the dashboard */
        return;
      }
    }

    /* Nothing was found -> show a message */
    if (admins.length === 0) {
      message.textContent = "No account yet. Please sign up first.";
    } else {
      message.textContent = "Wrong email or password.";
    }
  });
}

/* /  8. Admin pages  / */
/* The dashboard is NOT in this file. Every page inside /admin/ loads its own small
   files from admin/assets/js/ (admin.js + only what that page needs), so no page
   loads the code or data of the other sections. */

/* /  9. Startup  / */
/* Soft spotlight that follows the mouse over cards (professional hover) */
function initSpotlight() {
  const sel =
    ".values-card, .goals-section .value-card, .strategic-section .benefit-card, .service-detail-grid .service-detail, .sector-grid .sector-card, .strategic-list li, #page-team .team-card, .contact-card";
  document.addEventListener(
    "pointermove",
    (e) => {
      const card = e.target.closest ? e.target.closest(sel) : null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    },
    { passive: true },
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initSpotlight();
  initSite();
  initPublicContent();
  initBlogDetails();
  initBlog();
  if (PAGE === "admin.html") initAdmin();
});

/* Reliable mobile navigation handler (independent from theme initialization) */
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".site-header");
  const toggle = header && header.querySelector(".menu-toggle");
  const nav = header && header.querySelector(".primary-nav");
  if (!toggle || !nav || toggle.dataset.menuReady === "1") return;
  toggle.dataset.menuReady = "1";
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    toggle.textContent = open ? "×" : "☰";
  };
  toggle.addEventListener("click", function (event) {
    event.preventDefault(); event.stopPropagation();
    setMenu(!nav.classList.contains("open"));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", e => { if (!header.contains(e.target)) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 1100) setMenu(false); });
});
