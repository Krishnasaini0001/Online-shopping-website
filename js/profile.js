/* =========================================================
   ShopSphere — Profile Page (profile.html)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "profile") return;

  const auth = getAuthState();
  if (!auth.loggedIn) {
    document.getElementById("profile-root").innerHTML = `
      <div class="empty-state">
        <h2>You're not logged in</h2>
        <p>Please log in to view and edit your profile.</p>
        <a class="btn btn-primary" href="login.html">Go to Login</a>
      </div>`;
    return;
  }

  loadProfileStats();
  bindProfileForm();
  bindEditToggle();
});

function loadProfileStats() {
  const profile = getUserProfile();
  const orders = getOrders();
  const wishlistCount = getWishlist().length;

  document.getElementById("profile-name").value = profile.name || "";
  document.getElementById("profile-email").value = profile.email || "";
  document.getElementById("profile-phone").value = profile.phone || "";
  document.getElementById("profile-address").value = profile.address || "";
  document.getElementById("profile-city").value = profile.city || "";
  document.getElementById("profile-state").value = profile.state || "";
  document.getElementById("profile-pincode").value = profile.pincode || "";

  document.getElementById("profile-display-name").textContent = profile.name || "ShopSphere Customer";
  document.getElementById("profile-display-email").textContent = profile.email || "";
  document.getElementById("stat-orders").textContent = orders.length;
  document.getElementById("stat-wishlist").textContent = wishlistCount;
  document.getElementById("profile-avatar").textContent = (profile.name || "S").charAt(0).toUpperCase();
}

function bindEditToggle() {
  const editBtn = document.getElementById("edit-profile-btn");
  const form = document.getElementById("profile-form");
  const fields = form.querySelectorAll("input");

  fields.forEach(f => (f.disabled = true));

  editBtn.addEventListener("click", () => {
    const isEditing = editBtn.dataset.editing === "true";
    if (!isEditing) {
      fields.forEach(f => (f.disabled = false));
      editBtn.textContent = "Save Changes";
      editBtn.dataset.editing = "true";
    } else {
      form.requestSubmit();
    }
  });
}

function bindProfileForm() {
  const form = document.getElementById("profile-form");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");
    const phone = document.getElementById("profile-phone");

    if (!name.value.trim()) { showToast("Name cannot be empty.", "error"); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { showToast("Enter a valid email.", "error"); return; }
    if (phone.value.trim() && !/^\d{10}$/.test(phone.value.trim())) { showToast("Enter a valid 10-digit phone number.", "error"); return; }

    const profile = {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      address: document.getElementById("profile-address").value.trim(),
      city: document.getElementById("profile-city").value.trim(),
      state: document.getElementById("profile-state").value.trim(),
      pincode: document.getElementById("profile-pincode").value.trim()
    };
    setUserProfile(profile);
    loadProfileStats();

    const fields = form.querySelectorAll("input");
    fields.forEach(f => (f.disabled = true));
    const editBtn = document.getElementById("edit-profile-btn");
    editBtn.textContent = "Edit Profile";
    editBtn.dataset.editing = "false";

    showToast("Profile updated successfully.", "success");
  });
}
