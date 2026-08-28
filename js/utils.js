/* =========================================================
   ShopSphere — Shared Utilities
   Storage helpers, formatting, star rendering, toasts.
   Loaded on every page, right after data.js.
   ========================================================= */

/* ---------- LocalStorage keys ---------- */
const LS_KEYS = {
  CART: "shopsphere_cart",
  WISHLIST: "shopsphere_wishlist",
  USER: "shopsphere_user",
  AUTH: "shopsphere_auth",
  ORDERS: "shopsphere_orders",
  THEME: "shopsphere_theme",
  RECENT: "shopsphere_recent"
};

/* ---------- Generic storage helpers ---------- */
const Storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn("Storage read failed for", key, e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("Storage write failed for", key, e);
      return false;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

/* ---------- Cart / Wishlist data access ---------- */
function getCart() {
  return Storage.get(LS_KEYS.CART, []); // [{id, qty}]
}
function setCart(cart) {
  Storage.set(LS_KEYS.CART, cart);
  updateHeaderCounts();
}
function getWishlist() {
  return Storage.get(LS_KEYS.WISHLIST, []); // [id, id, ...]
}
function setWishlist(list) {
  Storage.set(LS_KEYS.WISHLIST, list);
  updateHeaderCounts();
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function cartItemsWithData() {
  return getCart()
    .map(entry => {
      const product = findProduct(entry.id);
      return product ? { ...product, qty: entry.qty } : null;
    })
    .filter(Boolean);
}

function cartTotalItems() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(id, qty = 1) {
  const product = findProduct(id);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(c => c.id === Number(id));
  const currentQty = existing ? existing.qty : 0;
  if (currentQty + qty > product.stock) {
    showToast(`Only ${product.stock} in stock — can't add more.`, "error");
    return false;
  }
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: Number(id), qty });
  }
  setCart(cart);
  showToast(`${product.name} added to cart.`, "success");
  return true;
}

function removeFromCart(id) {
  const cart = getCart().filter(c => c.id !== Number(id));
  setCart(cart);
  showToast("Product removed from cart.", "info");
}

function updateCartQty(id, qty) {
  const product = findProduct(id);
  const cart = getCart();
  const item = cart.find(c => c.id === Number(id));
  if (!item || !product) return;
  if (qty < 1) {
    removeFromCart(id);
    return;
  }
  if (qty > product.stock) {
    showToast(`Only ${product.stock} in stock.`, "error");
    qty = product.stock;
  }
  item.qty = qty;
  setCart(cart);
}

function clearCart() {
  setCart([]);
  showToast("Cart cleared.", "info");
}

function isInWishlist(id) {
  return getWishlist().includes(Number(id));
}

function toggleWishlist(id) {
  const product = findProduct(id);
  if (!product) return;
  let list = getWishlist();
  if (list.includes(Number(id))) {
    list = list.filter(x => x !== Number(id));
    setWishlist(list);
    showToast(`${product.name} removed from wishlist.`, "info");
    return false;
  } else {
    list.push(Number(id));
    setWishlist(list);
    showToast(`${product.name} added to wishlist.`, "success");
    return true;
  }
}

function moveWishlistItemToCart(id) {
  if (addToCart(id, 1)) {
    setWishlist(getWishlist().filter(x => x !== Number(id)));
  }
}

/* ---------- Recently viewed ---------- */
function addRecentlyViewed(id) {
  let recent = Storage.get(LS_KEYS.RECENT, []);
  recent = recent.filter(x => x !== Number(id));
  recent.unshift(Number(id));
  recent = recent.slice(0, 5);
  Storage.set(LS_KEYS.RECENT, recent);
}
function getRecentlyViewed(excludeId) {
  return Storage.get(LS_KEYS.RECENT, [])
    .filter(id => id !== Number(excludeId))
    .map(findProduct)
    .filter(Boolean);
}

/* ---------- Formatting ---------- */
function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) html += "★";
  if (half) html += "⯪";
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += "☆";
  return `<span class="stars" aria-label="${rating} out of 5 stars">${html}</span>`;
}

/* ---------- Toast notifications ---------- */
function ensureToastContainer() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = "info") {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icons = { success: "✔", error: "✖", info: "ℹ" };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-show"));
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ---------- Header counts (cart/wishlist badges) ---------- */
function updateHeaderCounts() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = cartTotalItems();
  });
  document.querySelectorAll("[data-wishlist-count]").forEach(el => {
    el.textContent = getWishlist().length;
  });
}

/* ---------- Theme (dark/light) ---------- */
function applyStoredTheme() {
  const theme = Storage.get(LS_KEYS.THEME, "light");
  document.documentElement.setAttribute("data-theme", theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  Storage.set(LS_KEYS.THEME, next);
  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    btn.textContent = next === "dark" ? "☀️" : "🌙";
  });
}
applyStoredTheme();

/* ---------- Auth (demo only — never store real passwords securely) ---------- */
function getAuthState() {
  return Storage.get(LS_KEYS.AUTH, { loggedIn: false });
}
function setAuthState(state) {
  Storage.set(LS_KEYS.AUTH, state);
}
function getUserProfile() {
  return Storage.get(LS_KEYS.USER, {
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: ""
  });
}
function setUserProfile(profile) {
  Storage.set(LS_KEYS.USER, profile);
}

/* ---------- Orders ---------- */
function getOrders() {
  return Storage.get(LS_KEYS.ORDERS, []);
}
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  Storage.set(LS_KEYS.ORDERS, orders);
}
function generateOrderId() {
  return "SS" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
}

/* ---------- Query string helpers ---------- */
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- Simple debounce ---------- */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
