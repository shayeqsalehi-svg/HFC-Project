/* Clients page */
if (window.Admin && Admin.ready) {
  Admin.collectionPage({
    type: "clients",
    label: "client",
    storageKey: Admin.KEYS.clients,
    defaults: Admin.defaults.clients,
    columns: ["image", "name", "role", "bio", "actions"],
  });
}
