/* Services page */
if (window.Admin && Admin.ready) {
  Admin.collectionPage({
    type: "services",
    label: "service",
    storageKey: Admin.KEYS.services,
    defaults: Admin.defaults.services,
    columns: ["image", "name", "bio", "actions"],
    bioLength: 150,
  });
}
