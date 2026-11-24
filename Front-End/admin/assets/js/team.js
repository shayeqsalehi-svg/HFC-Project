/* Team page */
if (window.Admin && Admin.ready) {
  Admin.collectionPage({
    type: "team",
    label: "team member",
    storageKey: Admin.KEYS.team,
    defaults: Admin.defaults.team,
    columns: ["name", "role", "bio", "email", "phone", "actions"],
  });
}
