/* =========================================================
   ShopSphere — Cart Page (cart.html)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "cart") return;
  renderCart();

  const clearBtn = document.getElementById("clear-cart-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Remove all items from your cart?")) {
        clearCart();
        renderCart();
      }
    });
  }
});

function renderCart() {
  const items = cartItemsWithData();
  const listEl = document.getElementById("cart-items");
  const emptyEl = document.getElementById("cart-empty");
  const summaryEl = document.getElementById("cart-summary");

  if (!items.length) {
    listEl.innerHTML = "";
    if (emptyEl) emptyEl.hidden = false;
    if (summaryEl) summaryEl.hidden = true;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;
  if (summaryEl) summaryEl.hidden = false;

  listEl.innerHTML = items.map(item => `
    <div class="cart-row" data-id="${item.id}">
      <a href="product-details.html?id=${item.id}" class="cart-row-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </a>
      <div class="cart-row-info">
        <a href="product-details.html?id=${item.id}" class="cart-row-name">${item.name}</a>
        <span class="product-category">${CATEGORIES.find(c => c.id === item.category)?.name || item.category}</span>
        <div class="cart-row-price-mobile">${formatCurrency(item.price)}</div>
      </div>
      <div class="cart-row-qty">
        <button class="qty-btn" data-action="decrease" aria-label="Decrease quantity">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" data-action="increase" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-row-price">${formatCurrency(item.price)}</div>
      <div class="cart-row-subtotal">${formatCurrency(item.price * item.qty)}</div>
      <button class="icon-btn cart-remove-btn" data-action="remove" aria-label="Remove item">🗑️</button>
    </div>
  `).join("");

  listEl.querySelectorAll(".cart-row").forEach(row => {
    const id = row.dataset.id;
    row.querySelector("[data-action='decrease']").addEventListener("click", () => {
      const item = cartItemsWithData().find(i => i.id === Number(id));
      updateCartQty(id, item.qty - 1);
      renderCart();
    });
    row.querySelector("[data-action='increase']").addEventListener("click", () => {
      const item = cartItemsWithData().find(i => i.id === Number(id));
      updateCartQty(id, item.qty + 1);
      renderCart();
    });
    row.querySelector("[data-action='remove']").addEventListener("click", () => {
      removeFromCart(id);
      renderCart();
    });
  });

  renderCartSummary(items);
}

function renderCartSummary(items) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const originalTotal = items.reduce((sum, i) => sum + i.originalPrice * i.qty, 0);
  const discount = originalTotal - subtotal;
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_CHARGE;
  const total = subtotal + delivery;
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  document.getElementById("summary-total-items").textContent = totalItems;
  document.getElementById("summary-subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("summary-discount").textContent = "-" + formatCurrency(discount);
  document.getElementById("summary-delivery").textContent = delivery === 0 ? "FREE" : formatCurrency(delivery);
  document.getElementById("summary-total").textContent = formatCurrency(total);
}
