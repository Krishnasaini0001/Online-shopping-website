/* =========================================================
   ShopSphere — Product Dataset
   Static demo data used across the whole site. Loaded first
   so every other script can read window.PRODUCTS / CATEGORIES.
   ========================================================= */

const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "shoes", name: "Shoes", icon: "👟" },
  { id: "accessories", name: "Accessories", icon: "👜" },
  { id: "home", name: "Home & Living", icon: "🛋️" },
  { id: "beauty", name: "Beauty", icon: "💄" },
  { id: "sports", name: "Sports", icon: "🏸" },
  { id: "books", name: "Books", icon: "📚" }
];

/* Helper to build a placeholder image (keeps the project dependency-free) */
function img(seed, w = 500, h = 500) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function calcDiscount(price, originalPrice) {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

const RAW_PRODUCTS = [
  { id: 1, name: "Aeris Wireless Headphones", category: "electronics", originalPrice: 4999, price: 3299, rating: 4.5, reviews: 218, stock: 24, featured: true, popular: true,
    description: "Over-ear wireless headphones with active noise cancellation, 40-hour battery life and plush memory-foam ear cushions.",
    specifications: { "Battery Life": "40 hours", "Connectivity": "Bluetooth 5.3", "Weight": "250g", "Warranty": "1 Year" } },
  { id: 2, name: "Nimbus 4K Action Camera", category: "electronics", originalPrice: 8999, price: 6499, rating: 4.3, reviews: 142, stock: 15, featured: true, popular: false,
    description: "Waterproof 4K action camera with image stabilization, perfect for travel, sports and vlogging.",
    specifications: { "Resolution": "4K/60fps", "Waterproof": "Up to 30m", "Storage": "microSD up to 512GB" } },
  { id: 3, name: "Quantum Mechanical Keyboard", category: "electronics", originalPrice: 5499, price: 3999, rating: 4.7, reviews: 310, stock: 40, featured: true, popular: true,
    description: "Hot-swappable mechanical keyboard with RGB backlighting and tactile brown switches.",
    specifications: { "Switch Type": "Tactile Brown", "Backlight": "RGB", "Connectivity": "USB-C / Bluetooth" } },
  { id: 4, name: "Pulse Smartwatch Series 3", category: "electronics", originalPrice: 7999, price: 5999, rating: 4.2, reviews: 189, stock: 30, featured: false, popular: true,
    description: "Fitness-focused smartwatch with heart-rate monitoring, GPS and a 10-day battery life.",
    specifications: { "Display": "1.4\" AMOLED", "Battery": "10 days", "Water Resistance": "5 ATM" } },
  { id: 5, name: "Vortex Portable Bluetooth Speaker", category: "electronics", originalPrice: 3499, price: 2299, rating: 4.4, reviews: 97, stock: 50, featured: false, popular: false,
    description: "Compact speaker with 360° sound, IPX7 waterproofing and 12-hour playtime.",
    specifications: { "Battery": "12 hours", "Waterproof": "IPX7", "Output": "20W" } },
  { id: 6, name: "Halo 27-inch 4K Monitor", category: "electronics", originalPrice: 24999, price: 19999, rating: 4.6, reviews: 76, stock: 12, featured: true, popular: false,
    description: "27-inch 4K IPS monitor with 99% sRGB coverage, ideal for design and productivity.",
    specifications: { "Panel": "IPS", "Resolution": "3840x2160", "Refresh Rate": "60Hz" } },
  { id: 7, name: "Zenith Slim Laptop Backpack", category: "accessories", originalPrice: 2499, price: 1699, rating: 4.5, reviews: 154, stock: 60, featured: false, popular: true,
    description: "Water-resistant laptop backpack with padded compartment, USB charging port and anti-theft zip.",
    specifications: { "Capacity": "25L", "Laptop Size": "Up to 15.6\"", "Material": "Nylon" } },
  { id: 8, name: "Solstice Aviator Sunglasses", category: "accessories", originalPrice: 1999, price: 1199, rating: 4.1, reviews: 88, stock: 45, featured: false, popular: false,
    description: "Polarized aviator sunglasses with UV400 protection and a lightweight metal frame.",
    specifications: { "Lens": "Polarized", "UV Protection": "UV400", "Frame": "Alloy" } },
  { id: 9, name: "Meridian Leather Wallet", category: "accessories", originalPrice: 1499, price: 999, rating: 4.6, reviews: 203, stock: 80, featured: true, popular: true,
    description: "Genuine leather bifold wallet with RFID-blocking lining and 8 card slots.",
    specifications: { "Material": "Genuine Leather", "Card Slots": "8", "RFID Protection": "Yes" } },
  { id: 10, name: "Drift Canvas Tote Bag", category: "accessories", originalPrice: 1299, price: 799, rating: 4.0, reviews: 61, stock: 70, featured: false, popular: false,
    description: "Durable canvas tote bag, perfect for everyday errands and light shopping trips.",
    specifications: { "Material": "Canvas", "Capacity": "18L" } },
  { id: 11, name: "Cascade Denim Jacket", category: "fashion", originalPrice: 3499, price: 2399, rating: 4.3, reviews: 132, stock: 35, featured: true, popular: true,
    description: "Classic washed-denim jacket with a relaxed fit, suitable for all seasons.",
    specifications: { "Material": "100% Cotton Denim", "Fit": "Relaxed", "Care": "Machine Wash" } },
  { id: 12, name: "Ember Wool-Blend Sweater", category: "fashion", originalPrice: 2999, price: 1999, rating: 4.4, reviews: 87, stock: 40, featured: false, popular: false,
    description: "Soft wool-blend sweater with ribbed cuffs, great for layering in cold weather.",
    specifications: { "Material": "Wool Blend", "Fit": "Regular" } },
  { id: 13, name: "Solace Cotton Formal Shirt", category: "fashion", originalPrice: 1999, price: 1399, rating: 4.2, reviews: 156, stock: 55, featured: false, popular: true,
    description: "Wrinkle-resistant cotton formal shirt, tailored fit, perfect for office wear.",
    specifications: { "Material": "100% Cotton", "Fit": "Tailored", "Sleeve": "Full" } },
  { id: 14, name: "Nova Summer Floral Dress", category: "fashion", originalPrice: 2799, price: 1899, rating: 4.5, reviews: 176, stock: 28, featured: true, popular: true,
    description: "Lightweight floral-print dress with a flattering A-line silhouette, ideal for summer.",
    specifications: { "Material": "Rayon", "Length": "Midi" } },
  { id: 15, name: "Fenix Slim-Fit Chinos", category: "fashion", originalPrice: 2199, price: 1499, rating: 4.1, reviews: 92, stock: 48, featured: false, popular: false,
    description: "Stretch-cotton slim-fit chinos that pair well with both casual and formal outfits.",
    specifications: { "Material": "Stretch Cotton", "Fit": "Slim" } },
  { id: 16, name: "Stride Running Shoes", category: "shoes", originalPrice: 4499, price: 2999, rating: 4.6, reviews: 264, stock: 65, featured: true, popular: true,
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
    specifications: { "Sole": "EVA Foam", "Upper": "Mesh", "Type": "Running" } },
  { id: 17, name: "Ridgeline Hiking Boots", category: "shoes", originalPrice: 5999, price: 4499, rating: 4.5, reviews: 118, stock: 22, featured: false, popular: false,
    description: "Waterproof hiking boots with reinforced ankle support and rugged rubber outsole.",
    specifications: { "Waterproof": "Yes", "Ankle Support": "High", "Outsole": "Rubber" } },
  { id: 18, name: "Bounce Casual Sneakers", category: "shoes", originalPrice: 3299, price: 2199, rating: 4.3, reviews: 201, stock: 58, featured: true, popular: true,
    description: "Everyday casual sneakers with a cushioned insole and durable canvas build.",
    specifications: { "Material": "Canvas", "Closure": "Lace-up" } },
  { id: 19, name: "Glide Formal Oxford Shoes", category: "shoes", originalPrice: 4999, price: 3599, rating: 4.2, reviews: 74, stock: 20, featured: false, popular: false,
    description: "Classic leather oxford shoes with a polished finish, ideal for formal occasions.",
    specifications: { "Material": "Genuine Leather", "Style": "Oxford" } },
  { id: 20, name: "Marina Slide Sandals", category: "shoes", originalPrice: 1499, price: 899, rating: 4.0, reviews: 63, stock: 90, featured: false, popular: false,
    description: "Comfortable everyday slide sandals with a soft cushioned footbed.",
    specifications: { "Material": "EVA", "Type": "Slide" } },
  { id: 21, name: "Haven Memory Foam Pillow", category: "home", originalPrice: 1799, price: 1099, rating: 4.4, reviews: 145, stock: 75, featured: false, popular: true,
    description: "Ergonomic memory foam pillow that contours to your neck for better sleep support.",
    specifications: { "Material": "Memory Foam", "Cover": "Removable, Washable" } },
  { id: 22, name: "Ember Scented Candle Set", category: "home", originalPrice: 1299, price: 799, rating: 4.6, reviews: 98, stock: 100, featured: true, popular: false,
    description: "Set of 3 soy-wax scented candles with warm woody and citrus notes, up to 30 hours burn each.",
    specifications: { "Wax": "Soy", "Burn Time": "30 hrs each", "Set": "3 candles" } },
  { id: 23, name: "Lumen Ceramic Table Lamp", category: "home", originalPrice: 2499, price: 1799, rating: 4.3, reviews: 54, stock: 34, featured: false, popular: false,
    description: "Minimalist ceramic table lamp with a warm fabric shade, perfect for bedside reading.",
    specifications: { "Material": "Ceramic + Fabric", "Bulb": "E27 (included)" } },
  { id: 24, name: "Terra Non-Stick Cookware Set", category: "home", originalPrice: 4999, price: 3499, rating: 4.5, reviews: 167, stock: 26, featured: true, popular: true,
    description: "5-piece non-stick cookware set with heat-resistant handles, compatible with all stovetops.",
    specifications: { "Pieces": "5", "Coating": "Non-Stick", "Induction Compatible": "Yes" } },
  { id: 25, name: "Weave Cotton Bedsheet Set", category: "home", originalPrice: 2299, price: 1599, rating: 4.2, reviews: 121, stock: 40, featured: false, popular: false,
    description: "100% cotton bedsheet set with 2 pillow covers, breathable and soft finish.",
    specifications: { "Material": "100% Cotton", "Thread Count": "300" } },
  { id: 26, name: "Glow Vitamin C Face Serum", category: "beauty", originalPrice: 1499, price: 999, rating: 4.6, reviews: 289, stock: 88, featured: true, popular: true,
    description: "Brightening vitamin C serum that reduces dark spots and evens out skin tone.",
    specifications: { "Volume": "30ml", "Key Ingredient": "Vitamin C", "Skin Type": "All" } },
  { id: 27, name: "Petal Matte Lipstick Set", category: "beauty", originalPrice: 1899, price: 1299, rating: 4.4, reviews: 176, stock: 65, featured: false, popular: true,
    description: "Set of 4 long-lasting matte lipsticks in versatile everyday shades.",
    specifications: { "Set": "4 shades", "Finish": "Matte" } },
  { id: 28, name: "Silk Hydrating Hair Mask", category: "beauty", originalPrice: 999, price: 649, rating: 4.3, reviews: 83, stock: 70, featured: false, popular: false,
    description: "Deep-conditioning hair mask enriched with argan oil for smooth, frizz-free hair.",
    specifications: { "Volume": "200ml", "Key Ingredient": "Argan Oil" } },
  { id: 29, name: "Rally Yoga Mat Pro", category: "sports", originalPrice: 1999, price: 1299, rating: 4.5, reviews: 143, stock: 55, featured: true, popular: true,
    description: "Extra-thick non-slip yoga mat with carrying strap, ideal for yoga and floor workouts.",
    specifications: { "Thickness": "8mm", "Material": "TPE", "Length": "183cm" } },
  { id: 30, name: "Ironclad Adjustable Dumbbells", category: "sports", originalPrice: 6999, price: 5299, rating: 4.6, reviews: 112, stock: 18, featured: false, popular: false,
    description: "Space-saving adjustable dumbbell pair, 2.5kg to 24kg per hand in one compact unit.",
    specifications: { "Weight Range": "2.5kg - 24kg", "Pair": "Yes" } },
  { id: 31, name: "Summit Insulated Water Bottle", category: "sports", originalPrice: 1299, price: 849, rating: 4.4, reviews: 198, stock: 95, featured: false, popular: true,
    description: "Double-wall insulated bottle that keeps drinks cold for 24 hours or hot for 12.",
    specifications: { "Capacity": "750ml", "Insulation": "24 hrs cold / 12 hrs hot" } },
  { id: 32, name: "Atlas Badminton Racket Pro", category: "sports", originalPrice: 2999, price: 2099, rating: 4.3, reviews: 71, stock: 42, featured: false, popular: false,
    description: "Lightweight carbon-fiber badminton racket with high tension stringing for power shots.",
    specifications: { "Material": "Carbon Fiber", "Weight": "85g" } },
  { id: 33, name: "The Silent Orchard — A Novel", category: "books", originalPrice: 599, price: 399, rating: 4.7, reviews: 340, stock: 120, featured: true, popular: true,
    description: "A gripping literary fiction novel about family, memory and the passage of time.",
    specifications: { "Pages": "384", "Format": "Paperback", "Language": "English" } },
  { id: 34, name: "Atomic Habits for Beginners", category: "books", originalPrice: 499, price: 349, rating: 4.8, reviews: 512, stock: 150, featured: true, popular: true,
    description: "A practical, beginner-friendly guide to building good habits and breaking bad ones.",
    specifications: { "Pages": "256", "Format": "Paperback" } },
  { id: 35, name: "The Code Craftsman", category: "books", originalPrice: 899, price: 649, rating: 4.5, reviews: 128, stock: 60, featured: false, popular: false,
    description: "An engaging guide to writing clean, maintainable code for aspiring software engineers.",
    specifications: { "Pages": "312", "Format": "Paperback" } }
];

/* Compute discount %, attach an image and a fixed set of demo reviews to every product. */
const DEMO_REVIEW_POOL = [
  { name: "Aarav Sharma", text: "Great quality for the price, exactly as described." },
  { name: "Priya Menon", text: "Fast delivery and the product feels premium." },
  { name: "Rohan Gupta", text: "Good value, would recommend to a friend." },
  { name: "Sneha Iyer", text: "Works well, matches the description closely." },
  { name: "Karan Verma", text: "Solid build quality, happy with the purchase." }
];

const PRODUCTS = RAW_PRODUCTS.map((p, idx) => ({
  ...p,
  discount: calcDiscount(p.price, p.originalPrice),
  image: img(`shopsphere-${p.id}`),
  images: [img(`shopsphere-${p.id}`), img(`shopsphere-${p.id}-b`), img(`shopsphere-${p.id}-c`)],
  demoReviews: [DEMO_REVIEW_POOL[idx % DEMO_REVIEW_POOL.length], DEMO_REVIEW_POOL[(idx + 2) % DEMO_REVIEW_POOL.length]]
}));

const DELIVERY_CHARGE = 49;
const FREE_DELIVERY_THRESHOLD = 999;
