# Hewad Future Consultancy (HFC)

A responsive company website and front-end content management dashboard for **Hewad Future Consultancy**, built with HTML5, CSS3, and vanilla JavaScript.

The project brings together a public-facing consultancy website and a browser-based administration area for managing website content, reviewing activity, and viewing analytics.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Public Website Pages](#public-website-pages)
- [Admin Dashboard](#admin-dashboard)
- [Getting Started](#getting-started)
- [Working with Website Content](#working-with-website-content)
- [Data Storage and Important Limitations](#data-storage-and-important-limitations)
- [Customization and Development](#customization-and-development)
- [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## Project Overview

Hewad Future Consultancy is a consultancy website project designed to present the company's profile, services, projects, clients, team, and articles through a responsive interface.

The project also includes an admin interface with content-management screens and supporting tools. The current implementation is a **front-end prototype**: it runs in the browser and does not include a server-side application or connected production database.

## Features

### Public Website
- Responsive layouts for desktop, tablet, and mobile devices.
- Company profile, mission, vision, and introduction pages.
- Consultancy services and project/work presentation.
- Team, clients, and contact pages.
- Blog listing and individual article details.
- Light and dark theme interface.
- Responsive navigation and interactive page elements.

### Administration
- Admin sign-in and account interface.
- Dashboard overview and analytics pages.
- Management screens for team members, services, blog posts, clients, and projects.
- Blog article details and editing interface.
- Comments moderation.
- Contact messages inbox.
- Media library for selecting and organizing available media.
- Activity log.
- Backup and restore interface.
- Profile and account settings.

> **Implementation note:** The admin screens and browser-side features are included in this project. Authentication, permissions, persistence, email delivery, and multi-user synchronization are not production-secure until implemented by a backend.

## Technology Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure and semantic content |
| CSS3 | Layout, styling, themes, and responsive design |
| Vanilla JavaScript (ES6+) | Interactions, page behavior, and browser-side content management |
| `localStorage` | Local browser data used by the current prototype |
| SVG / WebP | Logo and image assets |
| Google Fonts | DM Sans, Manrope, and other page-specific typography |
| Visual Studio Code | Recommended development editor |
| Live Server | Recommended local development server |

No React, Node.js, npm, or build process is required to run the current front-end version.

## Project Structure

```text
HEWAD-FUTURE-CONSULTANCY_V3-7/
└── Front-End/
    ├── index.html
    ├── about.html
    ├── services.html
    ├── our-work.html
    ├── our-team.html
    ├── clients.html
    ├── contact.html
    ├── blog.html
    ├── blog-details.html
    ├── admin.html
    │
    ├── admin/
    │   ├── dashboard.html
    │   ├── analytics.html
    │   ├── activity.html
    │   ├── team.html
    │   ├── services.html
    │   ├── blog.html
    │   ├── blog-details.html
    │   ├── our-work.html
    │   ├── clients.html
    │   ├── comments.html
    │   ├── messages.html
    │   ├── media.html
    │   ├── backup.html
    │   ├── profile.html
    │   ├── settings.html
    │   └── assets/
    │       └── js/
    │           ├── admin.js
    │           ├── crud.js
    │           ├── dashboard.js
    │           ├── analytics.js
    │           ├── team.js
    │           ├── services.js
    │           ├── blog.js
    │           ├── blog-details.js
    │           ├── our-work.js
    │           ├── clients.js
    │           ├── comments-manager.js
    │           ├── messages-manager.js
    │           ├── media-library.js
    │           ├── activity-log.js
    │           ├── backup-manager.js
    │           ├── profile.js
    │           ├── settings.js
    │           └── other dashboard modules
    │
    ├── assets/
    │   ├── style/
    │   │   └── style.css
    │   ├── js/
    │   │   ├── script.js
    │   │   └── analytics-tracker.js
    │   └── Image/
    │       ├── HFC_image/
    │       ├── logo/
    │       └── team/
    │
    └── README.md
```

The project documentation is kept at the repository root. The website itself is inside the `Front-End` directory.

## Public Website Pages

| Page | Description |
|---|---|
| `index.html` | Main landing page and company introduction |
| `about.html` | Company background, mission, and vision |
| `services.html` | Consultancy services |
| `our-work.html` | Projects, work, and insights |
| `our-team.html` | Team presentation |
| `clients.html` | Clients and partners |
| `contact.html` | Contact information and contact form |
| `blog.html` | Blog articles and listing |
| `blog-details.html` | Individual blog article view |
| `admin.html` | Admin access and account interface |

## Admin Dashboard

Open the admin interface through `admin.html`. The dashboard pages are located in `admin/`.

| Module | Purpose |
|---|---|
| Overview | Dashboard summary and key information |
| Analytics | Website analytics and visual reports |
| Our Team | Manage team member entries |
| Services | Manage consultancy services |
| Blog Posts | Manage articles and blog content |
| Our Work | Manage projects and portfolio entries |
| Clients | Manage client and partner entries |
| Comments | Review and moderate comments |
| Contact Messages | Review messages submitted through the contact page |
| Media Library | Browse and select available media |
| Activity Log | Review recorded admin activity |
| Backup & Restore | Browser-side data backup and restoration tools |
| Profile | Admin profile interface |
| Settings | Account and application settings |

The exact capabilities of each module depend on its current front-end implementation and browser data.

## Getting Started

### Requirements
- A modern web browser.
- Visual Studio Code (recommended).
- The **Live Server** extension for Visual Studio Code.

### Run Locally

1. Download or clone this repository.
2. Extract the project if you downloaded it as a ZIP file.
3. Open the project folder in Visual Studio Code.
4. Open the `Front-End` directory.
5. Locate `index.html`.
6. Right-click `index.html` and select **Open with Live Server**.
7. The website should open in your default browser.

To access the administration interface, open:

```text
http://127.0.0.1:<live-server-port>/admin.html
```

You can also use the Dashboard link in the website navigation if it is available in the current page version.

## Working with Website Content

### Update Text and Page Structure
Edit the relevant HTML file inside `Front-End/`.

### Update Styling
The main stylesheet is:

```text
Front-End/assets/style/style.css
```

It contains the website's visual styles, layout rules, themes, and responsive behavior.

### Update Public Website Behavior
The main public JavaScript file is:

```text
Front-End/assets/js/script.js
```

The analytics tracking script is:

```text
Front-End/assets/js/analytics-tracker.js
```

### Update Admin Functionality
Admin JavaScript modules are stored in:

```text
Front-End/admin/assets/js/
```

Use the module associated with the relevant admin page when making changes. Shared functionality is handled by common admin scripts such as `admin.js` and `crud.js`.

### Manage Images
Current image assets are organized under:

```text
Front-End/assets/Image/
```

- `HFC_image/` — general company and consultancy images.
- `logo/` — company logo assets.
- `team/` — team-related images.

When adding or moving an image, update every relevant HTML, CSS, and JavaScript path. Prefer descriptive filenames and web-friendly image formats such as WebP or SVG.

## Data Storage and Important Limitations

The current project uses browser-side JavaScript and `localStorage` for parts of its dashboard and content-management functionality.

This means:

- Data is stored in the browser and origin where it was created.
- Data does not automatically synchronize between different browsers, devices, or users.
- Clearing browser storage may remove locally stored project data.
- A browser-based login interface is **not secure production authentication**.
- Front-end code cannot securely protect private credentials or enforce reliable admin permissions.
- A local media selection or browser storage workflow is not a substitute for server-side file storage.

### Before Production Use

To turn this prototype into a real multi-admin content management system, implement a backend with:

- Server-side authentication and secure password hashing.
- Role-based access control and permission checks.
- A database for users, content, comments, messages, and activity records.
- Authenticated API endpoints for create, read, update, and delete operations.
- Server-side file uploads and media storage.
- A secure password-reset and email-delivery process.
- Server-side validation, logging, backups, and security controls.

Do not store real passwords, secret keys, or private credentials in client-side HTML, CSS, or JavaScript.

## Customization and Development

- Keep file paths relative and verify them after moving files.
- Preserve the existing folder organization when adding new pages or assets.
- Test both light and dark themes after changing styles.
- Check desktop, tablet, and mobile layouts.
- Use the browser Developer Tools (`F12`) to inspect JavaScript errors and missing network resources.
- After significant changes, perform a hard refresh (`Ctrl + F5`) to avoid cached files.

## Pre-Deployment Checklist

- [ ] Replace placeholder content with approved company information.
- [ ] Verify company contact details and external links.
- [ ] Check all navigation links and page routes.
- [ ] Test forms and interactive elements.
- [ ] Test responsive layouts on common screen sizes.
- [ ] Test light and dark theme readability.
- [ ] Check the browser Console and Network panel for errors.
- [ ] Optimize images and verify image paths.
- [ ] Configure hosting and the correct website base path.
- [ ] Implement backend authentication, database, API, and file storage before using the admin panel with real users or sensitive data.
- [ ] Configure HTTPS and production security settings.

---

## Project Information

**Project:** Hewad Future Consultancy (HFC)  
**Project Type:** Consultancy Website & Front-End Admin Dashboard  
**Primary Technologies:** HTML5, CSS3, Vanilla JavaScript  
**Current Architecture:** Front-end / browser-based prototype

