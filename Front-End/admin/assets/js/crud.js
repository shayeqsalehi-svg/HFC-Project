/* Shared CRUD for admin lists */
(function () {
  "use strict";

  if (!window.Admin || !Admin.ready) return;

  /* Item property -> id of its form field (a field is used only if the page has it). */
  const FIELD_IDS = {
    name: "item-name",
    role: "item-role",
    email: "item-email",
    phone: "item-phone",
    category: "item-category",
    date: "item-date",
    author: "item-author",
    content: "item-content",
    bio: "item-bio",
    details: "item-client-details",
    image: "item-image",
    status: "item-status",
  };

  const DEFAULT_AUTHOR = "Hewad Future Consultancy";

  const DEFAULT_CATEGORIES = [
    "Business Strategy",
    "Leadership",
    "Business Growth",
    "Governance & Risk",
    "Digital & AI",
  ];

  /* Photos already inside the project (shown in "Browse existing photos"). */
  const PROJECT_IMAGES = [
    "assets/Image/logo/hfc-logo.svg",
    "assets/Image/HFC_image/strategic-planning-illustration.webp",
    "assets/Image/HFC_image/private-sector.webp",
    "assets/Image/HFC_image/our-offered-services.webp",
    "assets/Image/HFC_image/development-sector.webp",
    "assets/Image/HFC_image/intro.webp",
    "assets/Image/HFC_image/financial-sector.webp",
    "assets/Image/HFC_image/hero-consultants.webp",
    "assets/Image/HFC_image/mission.webp",
    "assets/Image/HFC_image/vision.webp",
    "assets/Image/HFC_image/government-public-sector.webp",
    "assets/Image/HFC_image/target-clients.webp",
    "assets/Image/HFC_image/our-work.webp",
    "assets/Image/HFC_image/strategy.webp",
    "assets/Image/HFC_image/financial.webp",
    "assets/Image/HFC_image/digital.webp",
    "assets/Image/HFC_image/project-management.webp",
    "assets/Image/HFC_image/training.webp",
    "assets/Image/HFC_image/strategic-positioning-banner.webp",
    "assets/Image/HFC_image/target-clients-2.webp",
    "assets/Image/HFC_image/goals-coins-charts.webp",
    "assets/Image/HFC_image/strategic-planning-board.webp",
    "assets/Image/HFC_image/strategic-planning-meeting.webp",
    "assets/Image/team/team-member.webp",
  ];

  const byId = function (id) {
    return document.getElementById(id);
  };

  /**
   * Starts one admin list page.
   * config = {
   *   type:       "team" | "services" | "blog" | "work" | "clients"
   *   label:      singular name used in the modal title, e.g. "team member"
   *   storageKey: localStorage key of the list
   *   defaults:   items shown on the first visit
   *   columns:    table columns, e.g. ["name", "role", "bio", "actions"]
   *   slug:       true -> create a URL slug from the title (blog posts)
   *   categoryKey: localStorage key of the saved custom categories (optional)
   *   bioLength:  how many characters of the description the table shows (default 60)
   *   detailsPage: page that shows one item, e.g. "blog-details.html" (adds a Details link)
   * }
   */
  Admin.collectionPage = function (config) {
    const type = config.type;
    let list = Admin.load(config.storageKey, config.defaults);

    const modal = byId("item-modal");
    const form = byId("item-form");
    const modalTitle = byId("modal-title");
    const tbody = document.querySelector("#table-" + type + " tbody");
    const emptyMessage = byId("empty-" + type);
    const addButton = byId("add-item-btn");

    if (!tbody || !modal || !form || !addButton) {
      console.warn("Admin CRUD: missing elements for", type);
      return;
    }

    /* Table */

    function actionButton(action, text, id, extraClass) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button-small" + (extraClass || "");
      button.dataset.action = action;
      button.dataset.id = id;
      button.textContent = text;
      return button;
    }

    function render() {
      tbody.innerHTML = "";
      list.forEach(function (item) {
        const row = document.createElement("tr");
        config.columns.forEach(function (column) {
          const cell = document.createElement("td");
          if (column === "actions") {
            const actions = document.createElement("div");
            actions.className = "admin-row-actions";
            if (config.detailsPage) {
              const details = document.createElement("a");
              details.className = "button button-small button-outline";
              details.href = config.detailsPage + "?id=" + encodeURIComponent(item.id);
              details.textContent = "Details";
              actions.appendChild(details);
            }
            actions.append(
              actionButton("edit", "Edit", item.id),
              actionButton("delete", "Delete", item.id, " button-danger"),
            );
            cell.appendChild(actions);
          } else if (column === "image") {
            if (item.image) {
              const thumb = document.createElement("img");
              thumb.className = "admin-thumb";
              thumb.src = Admin.resolveSrc(item.image);
              thumb.alt = "";
              thumb.loading = "lazy";
              thumb.addEventListener("error", function () {
                thumb.hidden = true; /* broken path: no picture */
              });
              cell.appendChild(thumb);
            } else {
              cell.textContent = "—";
            }
          } else if (column === "bio") {
            cell.textContent = Admin.truncate(item.bio, config.bioLength || 60);
          } else {
            cell.textContent = item[column] || "—";
          }
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
      if (emptyMessage) emptyMessage.hidden = list.length > 0;
    }

    /* Save the new list; keep the old one if the browser storage is full. */
    function persist(nextList) {
      try {
        Admin.save(config.storageKey, nextList);
        list = nextList;
        return true;
      } catch (error) {
        alert(
          "The browser storage is full, so this change was not saved. Try a smaller image or delete unused items.",
        );
        return false;
      }
    }

    /* 3. Categories (only when t */

    const categorySelect = byId("item-category");

    function getCategories() {
      let saved = null;
      try {
        saved = JSON.parse(localStorage.getItem(config.categoryKey) || "null");
      } catch (error) {
        saved = null;
      }
      return Array.isArray(saved) && saved.length
        ? saved
        : DEFAULT_CATEGORIES.slice();
    }

    function fillCategories(selected) {
      const categories = getCategories();
      if (selected && !categories.includes(selected)) categories.push(selected);
      categorySelect.innerHTML = "";
      categories.forEach(function (category) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
      if (selected) categorySelect.value = selected;
    }

    const addCategoryButton = byId("add-category-btn");
    if (categorySelect && addCategoryButton) {
      addCategoryButton.addEventListener("click", function () {
        const input = byId("new-category-name");
        const name = input.value.trim();
        if (!name) {
          input.focus();
          return;
        }
        const categories = getCategories();
        const exists = categories.some(function (category) {
          return category.toLowerCase() === name.toLowerCase();
        });
        if (exists) {
          alert("This category already exists.");
          return;
        }
        categories.push(name);
        localStorage.setItem(config.categoryKey, JSON.stringify(categories));
        fillCategories(name);
        input.value = "";
      });
    }

    /* 4. Image picker (only when */

    const imageInput = byId("item-image");
    const imageUpload = byId("item-image-upload");
    const previewWrap = byId("image-preview-wrap");
    const preview = byId("item-image-preview");
    const gallery = byId("image-gallery");
    const galleryGrid = byId("image-gallery-grid");

    function showPreview(src) {
      if (!src) {
        previewWrap.hidden = true;
        preview.removeAttribute("src");
        return;
      }
      preview.src = Admin.resolveSrc(src);
      previewWrap.hidden = false;
    }

    function renderGallery() {
      galleryGrid.innerHTML = "";
      PROJECT_IMAGES.forEach(function (src) {
        const fileName = src.split("/").pop();
        const button = document.createElement("button");
        button.type = "button";
        button.className = "image-gallery-item";
        const image = document.createElement("img");
        image.src = Admin.resolveSrc(src);
        image.alt = fileName;
        image.loading = "lazy";
        const caption = document.createElement("span");
        caption.textContent = fileName;
        button.append(image, caption);
        button.addEventListener("click", function () {
          imageInput.value = src;
          showPreview(src);
          gallery.hidden = true;
        });
        galleryGrid.appendChild(button);
      });
    }

    /* Resize to max 1200px and compress, so localStorage does not fill up. */
    function compressUpload(file) {
      const reader = new FileReader();
      reader.onload = function () {
        const original = new Image();
        original.onload = function () {
          const canvas = document.createElement("canvas");
          const scale = Math.min(
            1,
            1200 / Math.max(original.width, original.height),
          );
          canvas.width = Math.round(original.width * scale);
          canvas.height = Math.round(original.height * scale);
          canvas
            .getContext("2d")
            .drawImage(original, 0, 0, canvas.width, canvas.height);
          let data = canvas.toDataURL("image/webp", 0.8);
          if (data.indexOf("data:image/webp") !== 0) {
            data = canvas.toDataURL("image/jpeg", 0.82); /* Safari has no WebP encoder */
          }
          imageInput.value = data;
          showPreview(data);
        };
        original.src = reader.result;
      };
      reader.readAsDataURL(file);
    }

    if (imageInput) {
      byId("show-image-gallery").addEventListener("click", function () {
        renderGallery();
        gallery.hidden = !gallery.hidden;
      });
      imageInput.addEventListener("input", function () {
        showPreview(imageInput.value.trim());
      });
      byId("clear-image-selection").addEventListener("click", function () {
        imageInput.value = "";
        showPreview("");
      });
      imageUpload.addEventListener("change", function () {
        const file = imageUpload.files && imageUpload.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          alert("Please select an image file.");
          imageUpload.value = "";
          return;
        }
        compressUpload(file);
      });
    }

    /* 2. Add / Edit modal */

    function openModal(item) {
      form.reset();
      byId("item-id").value = item ? item.id : "";
      modalTitle.textContent = (item ? "Edit " : "Add ") + config.label;

      /* Fill every field this page has. */
      Object.keys(FIELD_IDS).forEach(function (key) {
        const field = byId(FIELD_IDS[key]);
        if (field && key !== "category") field.value = item ? item[key] || "" : "";
      });

      if (categorySelect) fillCategories(item && item.category ? item.category : "");
      if (byId("item-date") && !item) {
        byId("item-date").value = new Date().toISOString().slice(0, 10);
      }
      if (byId("item-author") && !byId("item-author").value) {
        byId("item-author").value = DEFAULT_AUTHOR;
      }
      if (imageInput) {
        showPreview(item && item.image ? item.image : "");
        gallery.hidden = true;
        imageUpload.value = "";
      }

      if (typeof modal.showModal === "function") modal.showModal();
      else modal.setAttribute("open", "");
    }

    function closeModal() {
      if (typeof modal.close === "function") modal.close();
      else modal.removeAttribute("open");
    }

    function makeSlug(title) {
      return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const id = byId("item-id").value;
      const existing = list.find(function (entry) {
        return entry.id === id;
      });

      /* Keep unknown saved properties; every known property is always present. */
      const item = Object.assign({}, existing, { id: id || Admin.uid() });
      Object.keys(FIELD_IDS).forEach(function (key) {
        const field = byId(FIELD_IDS[key]);
        if (field) {
          item[key] = key === "category" || key === "date" ? field.value : field.value.trim();
        } else if (item[key] === undefined) {
          item[key] = "";
        }
      });
      // Track the actual creation month for dashboard monthly analytics.
      if (!existing) item.createdAt = new Date().toISOString();
      else if (!item.createdAt) item.createdAt = existing.createdAt || new Date().toISOString();
      if (config.slug) item.slug = makeSlug(item.name);

      const nextList = id
        ? list.map(function (entry) {
            return entry.id === id ? item : entry;
          })
        : list.concat(item);

      if (persist(nextList)) {
        closeModal();
        render();
      }
    });

    byId("modal-close").addEventListener("click", closeModal);
    byId("modal-cancel").addEventListener("click", closeModal);
    addButton.addEventListener("click", function () {
      openModal(null);
    });

    /* Edit / Delete buttons inside the table. */
    tbody.addEventListener("click", function (event) {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const item = list.find(function (entry) {
        return entry.id === button.dataset.id;
      });
      if (!item) return;
      if (button.dataset.action === "edit") {
        openModal(item);
      } else if (confirm('Delete "' + item.name + '"?')) {
        if (
          persist(
            list.filter(function (entry) {
              return entry.id !== item.id;
            }),
          )
        ) {
          render();
        }
      }
    });

    render();

    /* "?edit=<id>" (used by the Details page) opens that item straight in the Edit form. */
    const editId = new URLSearchParams(window.location.search).get("edit");
    if (editId) {
      const itemToEdit = list.find(function (entry) {
        return entry.id === editId;
      });
      if (itemToEdit) openModal(itemToEdit);
      window.history.replaceState(null, "", window.location.pathname);
    }
  };
})();
