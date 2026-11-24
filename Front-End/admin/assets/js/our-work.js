/* Our Work page */
if (window.Admin && Admin.ready) {
  Admin.collectionPage({
    type: "work",
    label: "project",
    storageKey: Admin.KEYS.work,
    defaults: Admin.defaults.work,
    columns: ["name", "category", "date", "bio", "actions"],
    categoryKey: "hfc-work-categories",
  });
}
