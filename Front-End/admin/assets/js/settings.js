/* Account settings */
(function () {
  "use strict";

  if (!window.Admin || !Admin.ready) return;

  const session = Admin.session;

  function showMessage(element, text, state) {
    element.textContent = text;
    element.className = "admin-settings-message" + (state ? " is-" + state : "");
  }

  /* 1. Email and password */

  function initAccountForm() {
    const form = document.getElementById("account-settings-form");
    if (!form) return;

    const emailInput = document.getElementById("settings-email");
    const currentInput = document.getElementById("settings-current-password");
    const newInput = document.getElementById("settings-new-password");
    const confirmInput = document.getElementById("settings-confirm-password");
    const message = document.getElementById("settings-message");

    emailInput.value = session.email || "";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      message.textContent = "";

      const sameEmail = function (a, b) {
        return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
      };
      const admins = Admin.load(Admin.KEYS.admins, []);
      const account = admins.find(function (item) {
        return sameEmail(item.email, session.email);
      });

      if (!account || account.password !== currentInput.value) {
        showMessage(message, "Current password is incorrect.", "error");
        return;
      }

      const nextEmail = emailInput.value.trim().toLowerCase();
      const emailTaken = admins.some(function (item) {
        return item !== account && sameEmail(item.email, nextEmail);
      });
      if (emailTaken) {
        showMessage(message, "This email address is already in use.", "error");
        return;
      }
      if (newInput.value && newInput.value.length < 6) {
        showMessage(message, "New password must contain at least 6 characters.", "error");
        return;
      }
      if (newInput.value && newInput.value !== confirmInput.value) {
        showMessage(message, "New passwords do not match.", "error");
        return;
      }

      account.email = nextEmail;
      if (newInput.value) account.password = newInput.value;
      Admin.save(Admin.KEYS.admins, admins);
      session.email = nextEmail;
      Admin.save(Admin.KEYS.session, session);

      const userName = document.getElementById("admin-user-name");
      if (userName) userName.textContent = session.name || nextEmail;
      currentInput.value = "";
      newInput.value = "";
      confirmInput.value = "";
      showMessage(message, "Account details updated successfully.", "success");
    });
  }

  /* 2. Approved sign-up emails */

  function initApprovedEmails() {
    const form = document.getElementById("allowed-emails-form");
    if (!form) return;

    const input = document.getElementById("approved-email-input");
    const items = document.getElementById("approved-email-items");
    const count = document.getElementById("approved-email-count");
    const message = document.getElementById("allowed-emails-message");

    const defaultEmails = [
      "shayeqsalehi@gmail.com",
      "admin@hewadfuture.com",
      "hewadfuture@gmail.com",
    ];
    let emails = Admin.load(Admin.KEYS.allowedEmails, defaultEmails);
    emails = Array.isArray(emails)
      ? emails
          .map(function (email) {
            return String(email).trim().toLowerCase();
          })
          .filter(Boolean)
      : defaultEmails.slice();

    function render() {
      items.innerHTML = "";
      count.textContent = emails.length;
      if (!emails.length) {
        const empty = document.createElement("li");
        empty.className = "empty-approved-email";
        empty.textContent = "No approved emails added yet.";
        items.appendChild(empty);
        return;
      }
      emails.forEach(function (email) {
        const item = document.createElement("li");
        const address = document.createElement("span");
        address.textContent = email;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-approved-email";
        remove.textContent = "Remove";
        remove.setAttribute("aria-label", "Remove " + email);
        remove.addEventListener("click", function () {
          emails = emails.filter(function (entry) {
            return entry !== email;
          });
          Admin.save(Admin.KEYS.allowedEmails, emails);
          render();
          showMessage(message, "Email removed from the approved list.");
        });
        item.append(address, remove);
        items.appendChild(item);
      });
    }

    render();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = input.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage(message, "Please enter a valid email address.", "error");
        input.focus();
        return;
      }
      if (emails.indexOf(email) !== -1) {
        showMessage(message, "This email is already in the approved list.", "error");
        return;
      }
      emails.push(email);
      Admin.save(Admin.KEYS.allowedEmails, emails);
      input.value = "";
      render();
      showMessage(message, "Email added and saved successfully.");
    });
  }

  /* 3. Show / hide password */

  function initPasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        const input = button.parentElement.querySelector("input");
        const eyeOpen = button.querySelector(".eye-on");
        const eyeCrossed = button.querySelector(".eye-off");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        if (eyeOpen) eyeOpen.style.display = show ? "none" : "block";
        if (eyeCrossed) eyeCrossed.style.display = show ? "block" : "none";
      });
    });
  }

  Admin.onReady(function () {
    initAccountForm();
    initApprovedEmails();
    initPasswordToggles();
  });
})();
