/* Blog details helper */
if (window.Admin && Admin.ready) {
  Admin.onReady(function () {
    const byId = function (id) {
      return document.getElementById(id);
    };

    const posts = Admin.load(Admin.KEYS.blog, Admin.defaults.blog);
    const requested = new URLSearchParams(window.location.search).get("id");
    const post = posts.find(function (item) {
      return item.id === requested;
    });

    if (!post) {
      byId("post-missing").hidden = false;
      return;
    }

    /* Text details (textContent */
    document.title = post.name + " | Blog Details | Admin | Hewad Future Consultancy";
    byId("detail-title").textContent = post.name || "Untitled";
    byId("detail-category").textContent = post.category || "No category";
    byId("detail-date").textContent = post.date || "—";
    byId("detail-author").textContent = post.author || "—";
    byId("detail-slug").textContent = post.slug || "—";
    byId("detail-summary").textContent = post.bio || "—";

    /* The full article: one paragraph per blank-line-separated block. */
    const content = byId("detail-content");
    const blocks = (post.content || "").split(/\n\s*\n/).filter(Boolean);
    if (blocks.length) {
      blocks.forEach(function (block) {
        const paragraph = document.createElement("p");
        paragraph.textContent = block.trim();
        content.appendChild(paragraph);
      });
    } else {
      content.textContent = "No article text yet.";
    }

    /* Cover image ---------- */
    if (post.image) {
      const image = byId("detail-image");
      image.src = Admin.resolveSrc(post.image);
      image.alt = post.name;
      image.hidden = false;
      image.addEventListener("error", function () {
        image.hidden = true; /* broken path: show the details without a picture */
      });
    }

    /* Buttons ---------- */
    byId("detail-edit").href = "blog.html?edit=" + encodeURIComponent(post.id);
    byId("detail-view").href = "../blog-details.html?post=" + encodeURIComponent(post.id);

    byId("detail-delete").addEventListener("click", function () {
      if (!confirm('Delete "' + post.name + '"?')) return;
      Admin.save(
        Admin.KEYS.blog,
        posts.filter(function (item) {
          return item.id !== post.id;
        }),
      );
      window.location.href = "blog.html";
    });

    byId("post-detail").hidden = false;
  });
}
