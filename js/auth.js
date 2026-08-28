/* =========================================================
   ShopSphere — Auth Pages (login.html / register.html)
   Frontend-only demo authentication — no real password
   storage or verification takes place here.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "login") bindLoginForm();
  if (document.body.dataset.page === "register") bindRegisterForm();
});

function bindLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    let valid = true;
    [email, password].forEach(f => f.classList.remove("input-error"));

    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { email.classList.add("input-error"); valid = false; }
    if (password.value.length < 4) { password.classList.add("input-error"); valid = false; }

    if (!valid) {
      showToast("Please enter a valid email and password.", "error");
      return;
    }

    const profile = getUserProfile();
    if (!profile.email) setUserProfile({ ...profile, email: email.value.trim() });
    setAuthState({ loggedIn: true });
    showToast("Login successful! Redirecting…", "success");
    setTimeout(() => (window.location.href = "index.html"), 800);
  });

  const forgotLink = document.getElementById("forgot-password-link");
  if (forgotLink) {
    forgotLink.addEventListener("click", e => {
      e.preventDefault();
      showToast("Password reset link sent (demo only).", "info");
    });
  }
}

function bindRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("register-name");
    const email = document.getElementById("register-email");
    const password = document.getElementById("register-password");
    const confirm = document.getElementById("register-confirm");

    [name, email, password, confirm].forEach(f => f.classList.remove("input-error"));
    let valid = true;

    if (!name.value.trim()) { name.classList.add("input-error"); valid = false; }
    if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { email.classList.add("input-error"); valid = false; }
    if (password.value.length < 6) { password.classList.add("input-error"); valid = false; }
    if (confirm.value !== password.value || !confirm.value) { confirm.classList.add("input-error"); valid = false; }

    if (!valid) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    setUserProfile({ ...getUserProfile(), name: name.value.trim(), email: email.value.trim() });
    setAuthState({ loggedIn: true });
    showToast("Account created successfully!", "success");
    setTimeout(() => (window.location.href = "index.html"), 800);
  });
}
