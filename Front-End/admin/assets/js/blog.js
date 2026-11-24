/* Blog page */
if (window.Admin && Admin.ready) {
  Admin.collectionPage({
    type: "blog",
    label: "blog post",
    storageKey: Admin.KEYS.blog,
    defaults: Admin.defaults.blog,
    columns: ["name", "category", "date", "bio", "actions"],
    slug: true, /* the public blog details page opens a post by its slug */
    categoryKey: "hfc-blog-categories",
    detailsPage: "blog-details.html", /* adds a "Details" link in every row */
  });
}
