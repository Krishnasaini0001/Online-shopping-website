/* =========================================================
   ShopSphere — Product Listing Page (products.html)
   Handles search, category/price/rating/discount/availability
   filters, sorting, and dynamic re-rendering (no reload).
   ========================================================= */

let currentFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
  discount: "",
  availability: "",
  sort: "default"
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "products") return;

  populateCategoryFilter();
  hydrateFiltersFromURL();
  bindFilterEvents();
  renderProducts();
});

/* Fill the category <select> and the category chips from CATEGORIES */
function populateCategoryFilter() {
  const select = document.getElementById("filter-category");
  if (select) {
    CATEGORIES.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  }
}

/* Read ?search= or ?category= from the URL (links from navbar/home) */
function hydrateFiltersFromURL() {
  const search = getQueryParam("search");
  const category = getQueryParam("category");
  if (search) {
    currentFilters.search = search;
    const input = document.getElementById("search-input");
    if (input) input.value = search;
  }
  if (category) {
    currentFilters.category = category;
    const select = document.getElementById("filter-category");
    if (select) select.value = category;
  }
}

function bindFilterEvents() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(() => {
      currentFilters.search = searchInput.value.trim();
      renderProducts();
    }, 200));
  }

  const ids = ["filter-category", "filter-min-price", "filter-max-price", "filter-rating", "filter-discount", "filter-availability", "sort-select"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", () => {
      currentFilters.category = document.getElementById("filter-category")?.value || "";
      currentFilters.minPrice = document.getElementById("filter-min-price")?.value || "";
      currentFilters.maxPrice = document.getElementById("filter-max-price")?.value || "";
      currentFilters.rating = document.getElementById("filter-rating")?.value || "";
      currentFilters.discount = document.getElementById("filter-discount")?.value || "";
      currentFilters.availability = document.getElementById("filter-availability")?.value || "";
      currentFilters.sort = document.getElementById("sort-select")?.value || "default";
      renderProducts();
    });
  });

  const clearBtn = document.getElementById("clear-filters-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      currentFilters = { search: "", category: "", minPrice: "", maxPrice: "", rating: "", discount: "", availability: "", sort: "default" };
      document.querySelectorAll("#filters-form input, #filters-form select").forEach(el => (el.value = ""));
      const sortSelect = document.getElementById("sort-select");
      if (sortSelect) sortSelect.value = "default";
      const search = document.getElementById("search-input");
      if (search) search.value = "";
      renderProducts();
      showToast("Filters cleared.", "info");
    });
  }

  const mobileToggle = document.getElementById("filters-toggle");
  const filtersPanel = document.getElementById("filters-panel");
  if (mobileToggle && filtersPanel) {
    mobileToggle.addEventListener("click", () => filtersPanel.classList.toggle("open"));
  }
}

function applyFilters() {
  let list = [...PRODUCTS];
  const f = currentFilters;

  if (f.search) {
    const term = f.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }
  if (f.category) list = list.filter(p => p.category === f.category);
  if (f.minPrice) list = list.filter(p => p.price >= Number(f.minPrice));
  if (f.maxPrice) list = list.filter(p => p.price <= Number(f.maxPrice));
  if (f.rating) list = list.filter(p => p.rating >= Number(f.rating));
  if (f.discount) list = list.filter(p => p.discount >= Number(f.discount));
  if (f.availability === "in-stock") list = list.filter(p => p.stock > 0);
  if (f.availability === "out-of-stock") list = list.filter(p => p.stock <= 0);

  switch (f.sort) {
    case "price-low": list.sort((a, b) => a.price - b.price); break;
    case "price-high": list.sort((a, b) => b.price - a.price); break;
    case "rating": list.sort((a, b) => b.rating - a.rating); break;
    case "newest": list.sort((a, b) => b.id - a.id); break;
    case "discount": list.sort((a, b) => b.discount - a.discount); break;
    case "popular": list.sort((a, b) => (b.popular === a.popular) ? 0 : b.popular ? 1 : -1); break;
    default: break;
  }
  return list;
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  const countLabel = document.getElementById("results-count");
  const emptyState = document.getElementById("no-results");
  if (!grid) return;

  const results = applyFilters();

  if (countLabel) countLabel.textContent = `${results.length} product${results.length === 1 ? "" : "s"} found`;

  if (!results.length) {
    grid.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }
  if (emptyState) emptyState.hidden = true;

  grid.innerHTML = results.map(productCardHTML).join("");
  wireProductCardEvents(grid);
}
