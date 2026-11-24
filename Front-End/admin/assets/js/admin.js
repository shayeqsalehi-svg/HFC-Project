/* Admin core – auth, storage, shared UI */
(function () {
  "use strict";

  const LOGIN_URL = "../admin.html";

  /* localStorage keys (the public pages read the same keys). */
  const KEYS = {
    team: "hfc-team",
    services: "hfc-services",
    blog: "hfc-blog",
    work: "hfc-work",
    clients: "hfc-clients",
    admins: "hfc-admins",
    session: "hfc-session",
    allowedEmails: "hfc-allowed-emails",
  };

  /* 2. Storage helpers */

  /* Read JSON from localStorage; return a copy of `fallback` when missing/broken. */
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback.slice() : JSON.parse(raw);
    } catch (error) {
      console.warn("Could not read " + key + "; using default data.", error);
      return fallback.slice();
    }
  }

  /* Write JSON to localStorage (throws when the browser storage is full). */
  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid() {
    return (
      "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
    );
  }

  function truncate(text, max) {
    if (!text) return "—";
    return text.length > max ? text.slice(0, max) + "…" : text;
  }

  /* Image paths are saved relative to the site root ("assets/..."), the way the
     public pages need them. Pages inside /admin/ must go one folder up to show them. */
  function resolveSrc(src) {
    return /^(data:|https?:|\/|\.\.\/)/.test(src) ? src : "../" + src;
  }

  /* Run a function once the page is parsed. */
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  /* 1. Auth guard ---------- * */

  /* A session is valid only when a saved admin account has the same email. */
  function readSession() {
    try {
      const saved = localStorage.getItem(KEYS.session);
      const session = saved ? JSON.parse(saved) : null;
      const accounts = JSON.parse(localStorage.getItem(KEYS.admins) || "[]");
      const email = session && session.email;
      const valid =
        email &&
        Array.isArray(accounts) &&
        accounts.some(function (account) {
          return account.email === String(email).trim().toLowerCase();
        });
      return valid ? session : null;
    } catch (error) {
      return null;
    }
  }

  const session = readSession();

  if (!session) {
    localStorage.removeItem(KEYS.session);
    window.Admin = { ready: false };
    window.location.replace(LOGIN_URL);
    return;
  }

  /* 3. Default data (first vis */

  const defaults = {
    team: [
      {
        id: "t1",
        name: "Ahmad Ahmadi",
        role: "Strategic Planning",
        bio: "Experienced in business strategy, organizational development, and project management.",
        image: "assets/Image/team/team-member.webp",
      },
    ],

    /* The same 5 services that are written in the public services.html, so the
       dashboard, the Services page and the website always start identical. */
    services: [
      {
        id: "s1",
        name: "Strategy, Management & Organizational Development",
        bio: "We help organizations develop effective strategies, strengthen organizational structures, improve management systems, and achieve sustainable growth",
        image: "assets/Image/HFC_image/strategy.webp",
      },
      {
        id: "s2",
        name: "Financial Advisory, Risk Management, Governance & compliance",
        bio: "We provide financial advisory, risk management, internal audit, compliance, and governance solutions to strengthen financial sustainability, accountability, and institutional performance",
        image: "assets/Image/HFC_image/financial.webp",
      },
      {
        id: "s3",
        name: "IT, Artificial Intelligence, Cyber Security & Digital Transformation",
        bio: "We support organizations through IT consulting, AI solutions, digital transformation, cybersecurity, and technology-driven innovation to improve efficiency and organizational capabilities.",
        image: "assets/Image/HFC_image/digital.webp",
      },
      {
        id: "s4",
        name: "Project Management, Research & Development",
        bio: "We provide project management, monitoring and evaluation, market research, policy development, institutional strengthening, and business development advisory services",
        image: "assets/Image/HFC_image/project-management.webp",
      },
      {
        id: "s5",
        name: "Training, Capacity Building & Human Resources",
        bio: "We help organizations develop their human resources, strengthen professional skills, improve institutional capacity, and establish effective knowledge management systems.",
        image: "assets/Image/HFC_image/training.webp",
      },
    ],

    blog: [
      {
        id: "b1",
        name: "The Power of Strategic Planning",
        category: "STRATEGY",
        date: "2026-10-18",
        bio: "Learn how effective planning creates a clear path toward long-term business success.",
        image: "./assets/Image/HFC_image/mission.webp",
      },
      {
        id: "b2",
        name: "Leadership That Inspires Results",
        category: "LEADERSHIP",
        date: "2026-10-15",
        bio: "Explore leadership practices that build stronger teams and improve business performance.",
        image: "./assets/Image/HFC_image/mission.webp",
      },
      {
        id: "b3",
        name: "Turning Challenges into Opportunities",
        category: "BUSINESS GROWTH",
        date: "2026-10-12",
        bio: "Discover practical ways to overcome challenges and identify new growth opportunities.",
        image: "./assets/Image/HFC_image/mission.webp",
      },
    ],

    work: [],
    clients: [],
  };

  /* 4. Common UI (every admin */

  onReady(function () {
    const userName = document.getElementById("admin-user-name");
    if (userName) userName.textContent = session.name || session.email || "Admin";

    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem(KEYS.session);
        window.location.href = LOGIN_URL;
      });
    }
  });

  /* ---------- 3b. One-time update of the old default services ----------
     Earlier versions started with a different list of services. If the saved list is
     still exactly that old list (nobody changed it), replace it with the services
     of the public services.html. A list the admin edited is never touched. */
  const OLD_DEFAULT_SERVICES = [["s1", "Business Strategy & Management Consulting", "Integrated multidisciplinary advisory for growth and performance."], ["s2", "Organizational Development & Human Resources", "Building capable teams and healthy organizational culture."], ["s3", "Financial Advisory & Business Finance", "Sound financial planning, analysis and advisory support."], ["s4", "Risk Management, Governance & Compliance", "Strengthening controls, governance and risk frameworks."], ["s5", "IT, AI, Digital Transformation & Cybersecurity", "Digital solutions that improve efficiency and security."], ["s6", "Project Management, Monitoring & Performance", "End-to-end project delivery and results tracking."], ["s7", "Marketing, Market Research & Development", "Insights and strategies to reach the right markets."], ["s8", "Research, Policy & Institutional Development", "Evidence-based policy and institutional capacity work."], ["s9", "Training, Capacity Building & Knowledge Management", "Practical learning programs for lasting capability."], ["s10", "Audit, Internal Controls & Performance Assurance", "Independent assurance and continuous improvement."]];

  (function updateOldDefaultServices() {
    try {
      const raw = localStorage.getItem(KEYS.services);
      if (raw === null) return;
      const saved = JSON.parse(raw);
      const isOldList =
        Array.isArray(saved) &&
        saved.length === OLD_DEFAULT_SERVICES.length &&
        saved.every(function (item, index) {
          const old = OLD_DEFAULT_SERVICES[index];
          return item.id === old[0] && item.name === old[1] && item.bio === old[2] && !item.image;
        });
      if (isOldList) localStorage.setItem(KEYS.services, JSON.stringify(defaults.services));
    } catch (error) {
      /* Broken or blocked storage: leave it as it is. */
    }
  })();

  window.Admin = {
    ready: true,
    session: session,
    KEYS: KEYS,
    defaults: defaults,
    load: load,
    save: save,
    uid: uid,
    truncate: truncate,
    resolveSrc: resolveSrc,
    onReady: onReady,
  };
})();
