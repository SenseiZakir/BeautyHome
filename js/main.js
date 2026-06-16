let isSearching = false;

/* =========================
   CART
========================= */
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
    showToast("Количество увеличено (+1)");
  } else {
    cart.push({
      name,
      price,
      image,
      quantity: 1
    });

    showToast("Добавлено в корзину");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
   TOAST (ОДИН)
========================= */
let toastTimer;

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#2563eb";
  toast.style.color = "#fff";
  toast.style.padding = "12px 16px";
  toast.style.borderRadius = "10px";
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  toast.style.zIndex = "9999";

  clearTimeout(toastTimer);

  toast.style.transition = "none";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";

  void toast.offsetWidth;

  toast.style.transition = "all 0.3s ease";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 1200);
}

/* =========================
   CARDS SLIDER + CLICK
========================= */
document.querySelectorAll(".card").forEach(card => {
  const productId = card.dataset.id;

  const track = card.querySelector(".track");
  const images = card.querySelectorAll(".track img");
  const nextBtn = card.querySelector(".next");
  const prevBtn = card.querySelector(".prev");
  const slider = card.querySelector(".slider");

  let index = 0;

  function updateSlider() {
    const width = slider.clientWidth;
    track.style.transform = `translateX(${-index * width}px)`;
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (index < images.length - 1) {
        index++;
        updateSlider();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (index > 0) {
        index--;
        updateSlider();
      }
    });
  }

  images.forEach(img => {
    img.addEventListener("click", e => {
      if (isSearching) return;

      e.stopPropagation();
      window.location.href = `product.html?id=${productId}`;
    });
  });

  card.addEventListener("click", e => {
    if (isSearching) {
      e.preventDefault();
      return;
    }
  });

  updateSlider();
});

/* =========================
   FILTERS (если есть)
========================= */
function openFilters() {
  document.getElementById("sidebarFilters").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeFilters() {
  document.getElementById("sidebarFilters").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

/* =========================
   HOME LINK SCROLL
========================= */
document.querySelectorAll(".homeLink").forEach(link => {
  link.addEventListener("click", e => {
    if (
      window.location.pathname.includes("index.html") ||
      window.location.pathname === "/"
    ) {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });
});

/* =========================
   BANNER BUTTON
========================= */
const bannerCatalogBtn = document.getElementById("bannerCatalogBtn");

if (bannerCatalogBtn) {
  bannerCatalogBtn.addEventListener("click", () => {
    const catalog = document.getElementById("catalog");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  });
}

/* =========================
   HEADER SEARCH (ЕДИНСТВЕННЫЙ)
========================= */


/* =========================
   RESET SEARCH STATE
========================= */
window.addEventListener("load", () => {
  isSearching = false;
});

function initFilters() {
  const applyBtn = document.getElementById("applyFilters");
  const resetBtn = document.getElementById("resetFilters");
  const productsContainer = document.getElementById("products");

  if (!applyBtn || !resetBtn || !productsContainer) return;

  applyBtn.addEventListener("click", () => {
    const search = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
    const category = document.getElementById("categoryFilter")?.value || "";
    const minPrice = Number(document.getElementById("minPrice")?.value) || 0;
    const maxPrice = Number(document.getElementById("maxPrice")?.value) || Infinity;
    const sortValue = document.getElementById("sortPrice")?.value || "";

    const cards = Array.from(document.querySelectorAll(".card"));

    const visible = [];

    cards.forEach(card => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const price = Number(card.dataset.price || 0);
      const cat = card.dataset.category || "";

      const matchSearch = !search || title.includes(search);
      const matchCat = !category || cat === category;
      const matchPrice = price >= minPrice && price <= maxPrice;

      if (matchSearch && matchCat && matchPrice) {
        card.style.display = "block";
        visible.push(card);
      } else {
        card.style.display = "none";
      }
    });

    if (sortValue) {
      visible.sort((a, b) => {
        const pa = Number(a.dataset.price || 0);
        const pb = Number(b.dataset.price || 0);

        return sortValue === "asc" ? pa - pb : pb - pa;
      });

      visible.forEach(card => productsContainer.appendChild(card));
    }
  });

  resetBtn.addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("sortPrice").value = "";

    document.querySelectorAll(".card").forEach(card => {
      card.style.display = "block";
    });
  });
}

document.addEventListener("DOMContentLoaded", initFilters);

document.addEventListener("DOMContentLoaded", () => {
  const skeleton = document.getElementById("skeleton");

  if (skeleton) {
    skeleton.style.display = "none";
  }
});

function initHeaderSearch() {
  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("headerSearch");

  if (!btn || !input) return;

  function findProductAndOpen() {
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    // ищем товар в массиве products
    const found = products.find(p => {
      return (
        p.title.toLowerCase().includes(query) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(query)))
      );
    });

    if (found) {
      window.location.href = `product.html?id=${found.id}`;
    } else {
      alert("Товар не найден");
    }
  }

  btn.addEventListener("click", findProductAndOpen);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      findProductAndOpen();
    }
  });
}

document.addEventListener("DOMContentLoaded", initHeaderSearch);


