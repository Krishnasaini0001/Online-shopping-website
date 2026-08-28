/* =========================================================
   ShopSphere — Order Success & My Orders pages
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "order-success") renderOrderSuccess();
  if (document.body.dataset.page === "orders") renderOrdersList();
});

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ---------- Order success page ---------- */
function renderOrderSuccess() {
  const orderId = getQueryParam("orderId");
  const order = getOrders().find(o => o.id === orderId);
  const root = document.getElementById("order-success-root");

  if (!order) {
    root.innerHTML = `
      <div class="empty-state">
        <h2>Order not found</h2>
        <p>We couldn't find that order. It may have already been viewed or the link is invalid.</p>
        <a class="btn btn-primary" href="index.html">Back to Home</a>
      </div>`;
    return;
  }

  document.getElementById("success-order-id").textContent = order.id;
  document.getElementById("success-order-date").textContent = fmtDate(order.date);
  document.getElementById("success-order-total").textContent = formatCurrency(order.total);
  document.getElementById("success-delivery-address").textContent =
    `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}`;
  document.getElementById("success-estimated-delivery").textContent = fmtDate(order.estimatedDelivery);

  document.getElementById("success-items").innerHTML = order.items.map(i => `
    <div class="checkout-item-row">
      <img src="${i.image}" alt="${i.name}" loading="lazy">
      <div class="checkout-item-info">
        <span class="checkout-item-name">${i.name}</span>
        <span class="checkout-item-qty">Qty: ${i.qty}</span>
      </div>
      <span class="checkout-item-price">${formatCurrency(i.price * i.qty)}</span>
    </div>
  `).join("");
}

/* ---------- My Orders page ---------- */
function renderOrdersList() {
  const orders = getOrders();
  const list = document.getElementById("orders-list");
  const emptyEl = document.getElementById("orders-empty");

  if (!orders.length) {
    list.innerHTML = "";
    if (emptyEl) emptyEl.hidden = false;
    return;
  }
  if (emptyEl) emptyEl.hidden = true;

  const statusSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];

  list.innerHTML = orders.map(order => {
    const stepIndex = statusSteps.indexOf(order.status) >= 0 ? statusSteps.indexOf(order.status) : 0;
    return `
    <div class="order-card">
      <div class="order-card-head">
        <div>
          <span class="order-id">Order #${order.id}</span>
          <span class="order-date">Placed on ${fmtDate(order.date)}</span>
        </div>
        <span class="order-status-badge status-${stepIndex}">${order.status}</span>
      </div>
      <div class="order-progress">
        ${statusSteps.map((s, i) => `<div class="order-step ${i <= stepIndex ? "done" : ""}"><span class="dot"></span><span class="label">${s}</span></div>`).join("")}
      </div>
      <div class="order-card-items">
        ${order.items.map(i => `
          <div class="order-item-thumb" title="${i.name} x${i.qty}">
            <img src="${i.image}" alt="${i.name}" loading="lazy">
            <span class="order-item-qty-badge">${i.qty}</span>
          </div>
        `).join("")}
      </div>
      <div class="order-card-footer">
        <span>${order.items.length} item${order.items.length > 1 ? "s" : ""}</span>
        <span class="order-total">${formatCurrency(order.total)}</span>
      </div>
    </div>
  `;
  }).join("");
}
