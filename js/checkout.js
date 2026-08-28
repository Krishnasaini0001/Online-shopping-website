/* =========================================================
   ShopSphere — Checkout Page (checkout.html)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "checkout") return;

  const items = cartItemsWithData();
  if (!items.length) {
    document.getElementById("checkout-root").innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
        <a class="btn btn-primary" href="products.html">Browse Products</a>
      </div>`;
    return;
  }

  prefillFromProfile();
  renderOrderSummary(items);
  bindPaymentMethodUI();
  bindCheckoutForm(items);
});

function prefillFromProfile() {
  const profile = getUserProfile();
  const map = {
    "checkout-name": profile.name,
    "checkout-email": profile.email,
    "checkout-phone": profile.phone,
    "checkout-address": profile.address,
    "checkout-city": profile.city,
    "checkout-state": profile.state,
    "checkout-pincode": profile.pincode
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  });
}

function renderOrderSummary(items) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const originalTotal = items.reduce((sum, i) => sum + i.originalPrice * i.qty, 0);
  const discount = originalTotal - subtotal;
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + delivery;

  document.getElementById("checkout-items").innerHTML = items.map(i => `
    <div class="checkout-item-row">
      <img src="${i.image}" alt="${i.name}" loading="lazy">
      <div class="checkout-item-info">
        <span class="checkout-item-name">${i.name}</span>
        <span class="checkout-item-qty">Qty: ${i.qty}</span>
      </div>
      <span class="checkout-item-price">${formatCurrency(i.price * i.qty)}</span>
    </div>
  `).join("");

  document.getElementById("checkout-subtotal").textContent = formatCurrency(subtotal);
  document.getElementById("checkout-discount").textContent = "-" + formatCurrency(discount);
  document.getElementById("checkout-delivery").textContent = delivery === 0 ? "FREE" : formatCurrency(delivery);
  document.getElementById("checkout-total").textContent = formatCurrency(total);
}

function bindPaymentMethodUI() {
  const radios = document.querySelectorAll("input[name='payment-method']");
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".payment-option").forEach(opt => opt.classList.remove("selected"));
      radio.closest(".payment-option").classList.add("selected");
    });
  });
}

function bindCheckoutForm(items) {
  const form = document.getElementById("checkout-form");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const fields = {
      name: document.getElementById("checkout-name"),
      email: document.getElementById("checkout-email"),
      phone: document.getElementById("checkout-phone"),
      address: document.getElementById("checkout-address"),
      city: document.getElementById("checkout-city"),
      state: document.getElementById("checkout-state"),
      pincode: document.getElementById("checkout-pincode")
    };

    let valid = true;
    Object.values(fields).forEach(f => f.classList.remove("input-error"));

    if (!fields.name.value.trim()) { fields.name.classList.add("input-error"); valid = false; }
    if (!/^\S+@\S+\.\S+$/.test(fields.email.value.trim())) { fields.email.classList.add("input-error"); valid = false; }
    if (!/^\d{10}$/.test(fields.phone.value.trim())) { fields.phone.classList.add("input-error"); valid = false; }
    if (!fields.address.value.trim()) { fields.address.classList.add("input-error"); valid = false; }
    if (!fields.city.value.trim()) { fields.city.classList.add("input-error"); valid = false; }
    if (!fields.state.value.trim()) { fields.state.classList.add("input-error"); valid = false; }
    if (!/^\d{6}$/.test(fields.pincode.value.trim())) { fields.pincode.classList.add("input-error"); valid = false; }

    const paymentMethod = document.querySelector("input[name='payment-method']:checked");
    if (!paymentMethod) valid = false;

    if (!valid) {
      showToast("Please fill all fields correctly.", "error");
      return;
    }

    const currentItems = cartItemsWithData();
    const subtotal = currentItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const originalTotal = currentItems.reduce((sum, i) => sum + i.originalPrice * i.qty, 0);
    const discount = originalTotal - subtotal;
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const total = subtotal + delivery;

    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: currentItems.map(i => ({ id: i.id, name: i.name, image: i.image, price: i.price, qty: i.qty })),
      subtotal, discount, delivery, total,
      customer: {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        phone: fields.phone.value.trim()
      },
      shipping: {
        address: fields.address.value.trim(),
        city: fields.city.value.trim(),
        state: fields.state.value.trim(),
        pincode: fields.pincode.value.trim()
      },
      paymentMethod: paymentMethod.value,
      status: "Order Placed",
      estimatedDelivery: estimatedDeliveryDate()
    };

    setUserProfile({
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      address: order.shipping.address,
      city: order.shipping.city,
      state: order.shipping.state,
      pincode: order.shipping.pincode
    });

    saveOrder(order);
    clearCartSilently();
    showToast("Order placed successfully!", "success");
    window.location.href = `order-success.html?orderId=${order.id}`;
  });
}

function clearCartSilently() {
  Storage.set(LS_KEYS.CART, []);
  updateHeaderCounts();
}

function estimatedDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toISOString();
}
