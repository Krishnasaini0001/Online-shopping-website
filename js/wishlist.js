/* =========================================================
   ShopSphere — Wishlist Page (wishlist.html)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "wishlist") return;
  renderWishlist();
});

function renderWishlist() {
  const ids = getWishlist();
  const products = ids.map(findProduct).filter(Boolean);
  const grid = document.getElementById("wishlist-grid");
  const emptyEl = document.getElementById("wishlist-empty");

  if (!products.length) {
    grid.innerHTML = "";
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  grid.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card-media">
        <a href="product-details.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </a>
        ${p.discount > 0 ? `<span class="badge badge-discount">-${p.discount}%</span>` : ""}
        <button class="icon-btn wishlist-remove-btn" data-id="${p.id}" aria-label="Remove from wishlist" title="Remove from wishlist">✖</button>
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
          <button class="btn btn-primary btn-sm move-to-cart-btn" data-id="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>
            ${p.stock <= 0 ? "Out of Stock" : "Move to Cart"}
          </button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".wishlist-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleWishlist(btn.dataset.id);
      renderWishlist();
    });
  });
  grid.querySelectorAll(".move-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      moveWishlistItemToCart(btn.dataset.id);
      renderWishlist();
    });
  });
}
