/* Keep the sidebar state consistent while moving between admin sections. */
(function () {
  "use strict";

  var KEY = "hfc-admin-sidebar-collapsed";
  var CLASS = "hfc-sidebar-collapsed";
  var SCROLL_KEY = "hfc-admin-sidebar-scroll-top";
  var root = document.documentElement;

  function readStoredState() {
    try {
      var value = localStorage.getItem(KEY);
      if (value === "1" || value === "0") return value === "1";
    } catch (error) {}

    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function apply(collapsed) {
    root.classList.toggle(CLASS, Boolean(collapsed));
  }

  function save(collapsed) {
    collapsed = Boolean(collapsed);
    apply(collapsed);

    // Keep both stores in sync so page navigation retains the same layout.
    try { localStorage.setItem(KEY, collapsed ? "1" : "0"); } catch (error) {}
    try { sessionStorage.setItem(KEY, collapsed ? "1" : "0"); } catch (error) {}
  }

  // Apply before the page is painted to prevent the sidebar from flashing open.
  apply(readStoredState());

  // Save the navigation scroll position before moving to another admin page.
  function saveNavScroll() {
    var nav = document.querySelector(".admin-sidebar .admin-nav");
    if (!nav) return;
    try { sessionStorage.setItem(SCROLL_KEY, String(nav.scrollTop)); } catch (error) {}
  }

  // Restore the same scroll position after the next page has loaded.
  function restoreNavScroll() {
    var nav = document.querySelector(".admin-sidebar .admin-nav");
    if (!nav) return;
    var stored = null;
    try { stored = sessionStorage.getItem(SCROLL_KEY); } catch (error) {}
    if (stored === null) return;
    var top = Math.max(0, Number(stored) || 0);
    requestAnimationFrame(function () {
      nav.scrollTop = top;
      requestAnimationFrame(function () { nav.scrollTop = top; });
    });
  }

  // Save sidebar layout and scroll position before following an admin link.
  document.addEventListener("click", function (event) {
    var link = event.target.closest(".admin-nav-link, .admin-user-card");
    if (!link) return;
    save(root.classList.contains(CLASS));
    saveNavScroll();
  }, true);

  // Also preserve position for keyboard navigation and browser-driven page changes.
  window.addEventListener("pagehide", saveNavScroll);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreNavScroll, { once: true });
  } else {
    restoreNavScroll();
  }

  window.addEventListener("pageshow", function () {
    apply(readStoredState());
    restoreNavScroll();
  });

  window.addEventListener("storage", function (event) {
    if (event.key === KEY) apply(event.newValue === "1");
  });

  window.HFCSidebarState = {
    isCollapsed: function () { return root.classList.contains(CLASS); },
    set: save
  };
})();
