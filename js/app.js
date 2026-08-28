/* =========================================================
   ShopSphere — App Shell
   Runs on every page: navbar behavior, theme button, auth
   pill, newsletter, and (on index.html) homepage sections.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateHeaderCounts();
  initMobileMenu();
  initThemeToggle();
  initAuthPill();
  initNewsletterForm();
  initGlobalSearchBar();

  if (document.body.dataset.page === "home") {
    renderCategories();
    renderProductRow("featured-products", PRODUCTS.filter(p => p.featured));
    renderProductRow("trending-products", PRODUCTS.filter(p => p.popular));
    renderReviews();
  }
});

/* ---------- Mobile hamburger menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector(".navbar-toggle");
  const menu = document.querySelector(".navbar-links");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.classList.toggle("active", isOpen);
  });
  menu.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("active");
    })
  );
}

/* ---------- Theme toggle button(s) ---------- */
function initThemeToggle() {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.addEventListener("click", toggleTheme);
  });
}

/* ---------- Auth pill (login/register vs. profile/logout) ---------- */
function initAuthPill() {
  const auth = getAuthState();
  document.querySelectorAll("[data-auth-slot]").forEach(slot => {
    if (auth.loggedIn) {
      const user = getUserProfile();
      slot.innerHTML = `
        <a href="profile.html" class="btn btn-ghost btn-sm">👤 ${user.name ? user.name.split(" ")[0] : "Profile"}</a>
        <button class="btn btn-outline btn-sm" id="logout-btn">Logout</button>
      `;
      const logoutBtn = slot.querySelector("#logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          setAuthState({ loggedIn: false });
          showToast("Logged out successfully.", "info");
          setTimeout(() => (window.location.href = "index.html"), 700);
        });
      }
    } else {
      slot.innerHTML = `<a href="login.html" class="btn btn-primary btn-sm">Login / Register</a>`;
    }
  });
}

/* ---------- Newsletter (footer) ---------- */
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    if (!input.value || !input.checkValidity()) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    showToast("Subscribed! Watch your inbox for offers.", "success");
    form.reset();
  });
}

/* ---------- Global navbar search → redirects to products.html ---------- */
function initGlobalSearchBar() {
  const form = document.getElementById("navbar-search-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = form.querySelector("input");
    const term = input.value.trim();
    window.location.href = `products.html${term ? "?search=" + encodeURIComponent(term) : ""}`;
  });
}

/* ---------- Homepage: categories ---------- */
function renderCategories() {
  const container = document.getElementById("category-grid");
  if (!container) return;
  container.innerHTML = CATEGORIES.map(cat => `
    <a class="category-card" href="products.html?category=${cat.id}">
      <span class="category-icon" aria-hidden="true">${cat.icon}</span>
      <span class="category-name">${cat.name}</span>
    </a>
  `).join("");
}

/* ---------- Homepage: featured / trending rows ---------- */
function renderProductRow(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!products.length) {
    container.innerHTML = `<p class="empty-note">No products to show right now.</p>`;
    return;
  }
  container.innerHTML = products.slice(0, 8).map(productCardHTML).join("");
  wireProductCardEvents(container);
}

/* Shared product-card markup, used by home + products + related + recently viewed */
function productCardHTML(p) {
  const wished = isInWishlist(p.id);
  const outOfStock = p.stock <= 0;
  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card-media">
        <a href="product-details.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}" loading="lazy" width="500" height="500">
        </a>
        ${p.discount > 0 ? `<span class="badge badge-discount">-${p.discount}%</span>` : ""}
        <button class="icon-btn wishlist-toggle ${wished ? "active" : ""}" data-id="${p.id}" aria-label="Toggle wishlist" title="Add to wishlist">
          ${wished ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="product-card-body">
        <span class="product-category">${CATEGORIES.find(c => c.id === p.category)?.name || p.category}</span>
        <h3 class="product-name"><a href="product-details.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating">${renderStars(p.rating)} <span class="rating-count">(${p.reviews})</span></div>
        <div class="product-price">
          <span class="price-current">${formatCurrency(p.price)}</span>
          ${p.discount > 0 ? `<span class="price-original">${formatCurrency(p.originalPrice)}</span>` : ""}
        </div>
        <div class="product-card-actions">
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${p.id}" ${outOfStock ? "disabled" : ""}>
            ${outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <a class="btn btn-outline btn-sm" href="product-details.html?id=${p.id}">View Details</a>
        </div>
      </div>
    </article>
  `;
}

/* Delegated-style wiring for cart/wishlist buttons inside a given container */
function wireProductCardEvents(container) {
  container.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id, 1));
  });
  container.querySelectorAll(".wishlist-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const active = toggleWishlist(btn.dataset.id);
      btn.classList.toggle("active", active);
      btn.textContent = active ? "❤️" : "🤍";
    });
  });
}

/* ---------- Homepage: customer reviews (site-wide testimonials) ---------- */
const SITE_TESTIMONIALS = [
  { name: "Ananya Rao", role: "Verified Buyer", text: "ShopSphere has the best prices I've found — the checkout process was quick and painless.", rating: 5 },
  { name: "Vikram Singh", role: "Verified Buyer", text: "Loved the range of electronics. Packaging was solid and delivery was on time.", rating: 4.5 },
  { name: "Meera Nair", role: "Verified Buyer", text: "Customer support helped me track my order instantly. Will shop again.", rating: 4.5 }
];
function renderReviews() {
  const container = document.getElementById("testimonial-grid");
  if (!container) return;
  container.innerHTML = SITE_TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-rating">${renderStars(t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <span class="testimonial-name">${t.name}</span>
        <span class="testimonial-role">${t.role}</span>
      </div>
    </div>
  `).join("");
}
