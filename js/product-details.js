/* =========================================================
   ShopSphere — Product Details Page (product-details.html)
   ========================================================= */

let currentProduct = null;
let selectedQty = 1;

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "product-details") return;

  const id = getQueryParam("id");
  currentProduct = findProduct(id);

  if (!currentProduct) {
    document.getElementById("product-details-root").innerHTML = `
      <div class="empty-state">
        <h2>Product not found</h2>
        <p>This product may have been removed or the link is incorrect.</p>
        <a class="btn btn-primary" href="products.html">Browse Products</a>
      </div>`;
    return;
  }

  renderProductDetails(currentProduct);
  addRecentlyViewed(currentProduct.id);
  renderRelatedProducts(currentProduct);
  renderRecentlyViewedSection(currentProduct.id);
  bindDetailEvents(currentProduct);
});

function renderProductDetails(p) {
  document.title = `${p.name} — ShopSphere`;
  const wished = isInWishlist(p.id);
  const outOfStock = p.stock <= 0;

  document.getElementById("pd-image").src = p.image;
  document.getElementById("pd-image").alt = p.name;
  document.getElementById("pd-thumbs").innerHTML = p.images.map((src, i) => `
    <button class="pd-thumb ${i === 0 ? "active" : ""}" data-src="${src}"><img src="${src}" alt="${p.name} view ${i + 1}"></button>
  `).join("");

  document.getElementById("pd-category").textContent = CATEGORIES.find(c => c.id === p.category)?.name || p.category;
  document.getElementById("pd-name").textContent = p.name;
  document.getElementById("pd-rating").innerHTML = `${renderStars(p.rating)} <span class="rating-count">${p.rating} · ${p.reviews} reviews</span>`;
  document.getElementById("pd-price-current").textContent = formatCurrency(p.price);
  document.getElementById("pd-price-original").textContent = p.discount > 0 ? formatCurrency(p.originalPrice) : "";
  document.getElementById("pd-discount-badge").textContent = p.discount > 0 ? `${p.discount}% OFF` : "";
  document.getElementById("pd-discount-badge").hidden = p.discount <= 0;
  document.getElementById("pd-description").textContent = p.description;
  document.getElementById("pd-stock").textContent = outOfStock ? "Out of stock" : `${p.stock} available`;
  document.getElementById("pd-stock").className = outOfStock ? "stock-badge out" : "stock-badge in";

  const wishBtn = document.getElementById("pd-wishlist-btn");
  wishBtn.classList.toggle("active", wished);
  wishBtn.innerHTML = wished ? "❤️ In Wishlist" : "🤍 Add to Wishlist";

  const addCartBtn = document.getElementById("pd-add-cart-btn");
  const buyNowBtn = document.getElementById("pd-buy-now-btn");
  addCartBtn.disabled = outOfStock;
  buyNowBtn.disabled = outOfStock;

  document.getElementById("qty-value").textContent = selectedQty;

  const specsBody = document.getElementById("pd-specs");
  specsBody.innerHTML = Object.entries(p.specifications || {}).map(([k, v]) => `
    <tr><th>${k}</th><td>${v}</td></tr>
  `).join("");

  const reviewsContainer = document.getElementById("pd-reviews");
  reviewsContainer.innerHTML = (p.demoReviews || []).map(r => `
    <div class="review-card">
      <div class="review-head">
        <span class="review-avatar">${r.name.charAt(0)}</span>
        <div>
          <strong>${r.name}</strong>
          <div class="testimonial-rating">${renderStars(4 + Math.random())}</div>
        </div>
      </div>
      <p>${r.text}</p>
    </div>
  `).join("");
}

function bindDetailEvents(p) {
  document.getElementById("pd-thumbs").addEventListener("click", e => {
    const btn = e.target.closest(".pd-thumb");
    if (!btn) return;
    document.getElementById("pd-image").src = btn.dataset.src;
    document.querySelectorAll(".pd-thumb").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
  });

  document.getElementById("qty-decrease").addEventListener("click", () => {
    if (selectedQty > 1) selectedQty--;
    document.getElementById("qty-value").textContent = selectedQty;
  });
  document.getElementById("qty-increase").addEventListener("click", () => {
    if (selectedQty < p.stock) selectedQty++;
    else showToast(`Only ${p.stock} in stock.`, "error");
    document.getElementById("qty-value").textContent = selectedQty;
  });

  document.getElementById("pd-add-cart-btn").addEventListener("click", () => {
    addToCart(p.id, selectedQty);
  });

  document.getElementById("pd-buy-now-btn").addEventListener("click", () => {
    if (addToCart(p.id, selectedQty)) {
      window.location.href = "checkout.html";
    }
  });

  document.getElementById("pd-wishlist-btn").addEventListener("click", () => {
    const active = toggleWishlist(p.id);
    const btn = document.getElementById("pd-wishlist-btn");
    btn.classList.toggle("active", active);
    btn.innerHTML = active ? "❤️ In Wishlist" : "🤍 Add to Wishlist";
  });
}

function renderRelatedProducts(p) {
  const container = document.getElementById("related-products");
  if (!container) return;
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  if (!related.length) {
    container.closest("section").hidden = true;
    return;
  }
  container.innerHTML = related.map(productCardHTML).join("");
  wireProductCardEvents(container);
}

function renderRecentlyViewedSection(excludeId) {
  const container = document.getElementById("recently-viewed");
  const section = document.getElementById("recently-viewed-section");
  if (!container || !section) return;
  const recent = getRecentlyViewed(excludeId);
  if (!recent.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  container.innerHTML = recent.map(productCardHTML).join("");
  wireProductCardEvents(container);
}
