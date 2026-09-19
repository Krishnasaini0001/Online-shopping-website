
# 🛍️ ShopSphere — Modern E-Commerce Website

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Frameworks](https://img.shields.io/badge/Frameworks-None-lightgrey?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A complete, fully functional e-commerce website front end built with **only HTML5, CSS3, and vanilla JavaScript** — no React, no Bootstrap, no jQuery, no build tools. Built as a placement/portfolio project to demonstrate real-world front-end engineering skills: DOM manipulation, state management via `localStorage`, dynamic rendering, and responsive UI design.

---

## 🔗 Live Demo

> Open `index.html` in your browser, or deploy the folder to GitHub Pages / Netlify / Vercel for a live link. (Add your deployed URL here once published.)

## 📸 Screenshots

> Add screenshots of the homepage, product listing, product details, cart, and checkout pages to `assets/screenshots/` and reference them here, e.g.:
>
> `![Homepage](assets/screenshots/home.png)`

---

## ✨ Features

- **Home page** with hero banner, category grid, featured & trending products, special offers, testimonials, and newsletter signup
- **Product listing** with live **search**, **filters** (category, price range, rating, discount, availability) and **sorting** (price, rating, newest, discount, popularity) — all without page reloads
- **Product details page** with image gallery, quantity selector, specifications, reviews, related products, and recently viewed products
- **Cart** with quantity controls, stock validation, subtotal/discount/delivery/total calculation
- **Wishlist** with move-to-cart support
- **Checkout** with customer info, shipping address, and simulated payment method selection (COD / Card / UPI)
- **Order confirmation** page with order ID, date, items, and estimated delivery
- **Order history** with a visual status tracker (Order Placed → Processing → Shipped → Delivered)
- **Profile page** with editable account details and order/wishlist stats
- **Login / Register** pages with client-side validation (demo authentication only)
- **Dark / light theme** toggle, persisted across sessions
- **Toast notifications** for cart, wishlist, auth and form events
- **Empty states** for cart, wishlist, search results, and order history
- Fully **responsive** design (desktop, tablet, mobile) with a hamburger menu
- Data for **cart, wishlist, profile, orders, theme, and recently viewed** all persist via `localStorage`

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="25%">

*🎨 Frontend*
- HTML5 / CSS3
- Vanilla JavaScript
- Custom design system
- Font Awesome icons
- Google Fonts (Poppins/Inter)

</td>
<td valign="top" width="25%">

*⚙️ Backend*
- Python 3.10+
- Flask (App Factory)
- Flask-SQLAlchemy
- Werkzeug security
- python-dotenv

</td>
<td valign="top" width="25%">

*🗄️ Database*
- SQLite
- SQLAlchemy ORM
- Flask-Migrate (planned)

</td>
<td valign="top" width="25%">

*🧪 Tooling*
- pytest (planned)
- Git & GitHub
- Chart.js (planned)

</td>
</tr>
</table>

<br>

## 🏗️ Architecture

mermaid
flowchart LR
    A[Browser] -->|HTTP requests| B(Flask App Factory)
    B --> C{Blueprints}
    C --> D[main — public pages]
    C --> E[auth — planned]
    C --> F[cart / orders — planned]
    C --> G[admin — planned]
    D & E & F & G --> H[(SQLite via SQLAlchemy)]
    B --> I[Jinja2 Templates]
    I --> J[base.html]
    J --> K[navbar / footer partials]
    J --> L[page content blocks]


<br>

---

## 📁 Project Structure

```
shop-sphere/
│
├── index.html
├── products.html
├── product-details.html
├── cart.html
├── wishlist.html
├── checkout.html
├── order-success.html
├── orders.html
├── profile.html
├── login.html
├── register.html
│
├── css/
│   ├── style.css          # design tokens, reset, typography, page sections
│   ├── components.css     # navbar, footer, buttons, cards, forms, toasts
│   └── responsive.css     # tablet & mobile breakpoints
│
├── js/
│   ├── data.js             # product dataset & categories
│   ├── utils.js            # storage, formatting, toast, cart/wishlist helpers
│   ├── app.js               # navbar, theme toggle, homepage rendering
│   ├── products.js          # listing page: search, filter, sort
│   ├── product-details.js   # product detail page logic
│   ├── cart.js               # cart page logic
│   ├── wishlist.js           # wishlist page logic
│   ├── checkout.js           # checkout form & order placement
│   ├── orders.js              # order success & order history
│   ├── profile.js             # profile view/edit
│   └── auth.js                # login/register validation (demo only)
│
├── assets/
│   ├── images/
│   └── screenshots/
│
└── README.md
```

---

## 🚀 Installation & Usage

No build tools or package installation required.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krishnasaini0001/shop-sphere.git
   cd shop-sphere
   ```
2. **Open it in a browser**
   - Simplest: double-click `index.html`.
   - Recommended (for correct relative paths and live reload): use a local server, e.g. with VS Code's **Live Server** extension, or:
     ```bash
     npx serve .
     # or
     python3 -m http.server 8000
     ```
3. Browse products, add items to your cart/wishlist, and walk through the full checkout flow — everything is saved in your browser's `localStorage`, so it persists across refreshes.

---

## 💾 How LocalStorage Is Used

| Key | Stores |
|---|---|
| `shopsphere_cart` | Cart items (`id`, `qty`) |
| `shopsphere_wishlist` | Wishlisted product IDs |
| `shopsphere_user` | Profile info (name, email, phone, address) |
| `shopsphere_auth` | Demo login state |
| `shopsphere_orders` | Order history |
| `shopsphere_theme` | Selected theme (light/dark) |
| `shopsphere_recent` | Last 5 recently viewed product IDs |

All reads/writes go through a small `Storage` wrapper in `js/utils.js` with try/catch guards.

---

## 🧠 JavaScript Concepts Demonstrated

- DOM manipulation & dynamic HTML rendering (template literals)
- Event delegation & event listeners
- Array methods: `map`, `filter`, `reduce`, `sort`, `find`, `includes`
- Object destructuring & spread syntax
- `localStorage` CRUD operations with JSON serialization
- Debounced live search
- Form validation (regex-based) with inline error states
- Client-side routing via query parameters (`?id=`, `?search=`, `?category=`)
- State-driven UI (cart/wishlist counts, theme, auth pill)
- Reusable component functions (`productCardHTML`, `renderStars`, `showToast`)
- Modular file architecture (one concern per file)

---

## ✅ Manual Testing Checklist

- [x] Navigation across all 11 pages
- [x] Search (name, category, description) with empty-state handling
- [x] All filters (category, price, rating, discount, availability) + Clear Filters
- [x] All sort options
- [x] Product details: gallery, quantity selector, specs, reviews, related & recently viewed
- [x] Cart: add, remove, increase/decrease qty, stock limits, clear cart, totals
- [x] Wishlist: add, remove, move to cart
- [x] Login/Register validation
- [x] Checkout: form validation, payment method selection, order placement
- [x] Order success & order history with status tracker
- [x] Profile view/edit
- [x] Dark/light mode toggle + persistence
- [x] Responsive layout on mobile, tablet, desktop
- [x] No console errors

---

## 🔮 Future Improvements

- Connect to a real backend (Node/Express + MongoDB or Firebase) for persistent multi-device accounts
- Real payment gateway integration (Razorpay/Stripe sandbox)
- Product image uploads and an admin dashboard for inventory management
- Pagination or infinite scroll for large catalogs
- Unit tests for cart/filter/sort logic
- Accessibility audit with axe-core and full keyboard-navigation pass
- PWA support (offline mode, installable app)

---

## 👤 Author

Built as a placement/portfolio project.

**Krishna Saini**
[GitHub](https://github.com/Krishnasaini0001) · [LinkedIn](https://linkedin.com/in/https://www.linkedin.com/in/krishna-saini-b07a2b294/)
