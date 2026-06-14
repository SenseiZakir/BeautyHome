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

let toastTimer;

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  // 🔵 СТИЛЬ (СИНИЙ ТОАСТ)
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

  // сбрасываем старый таймер
  clearTimeout(toastTimer);

  // reset анимации
  toast.style.transition = "none";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";

  void toast.offsetWidth;

  toast.style.transition = "all 0.3s ease";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  // новый таймер
  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 1200);
}

document.querySelectorAll(".card").forEach((card) => {
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

  // =========================
  // ⬅️➡️ СТРЕЛКИ (ТОЛЬКО СЛАЙДЕР)
  // =========================
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (index < images.length - 1) {
      index++;
      updateSlider();
    }
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  // =========================
  // 🖼 КЛИК ПО КАРТИНКЕ → ОТКРЫТЬ ТОВАР
  // =========================
  images.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = `product.html?id=${productId}`;
    });
  });

  updateSlider();
});


const applyBtn = document.getElementById("applyFilters");

if (applyBtn) {

  applyBtn.addEventListener("click", () => {

  const search = document
    .getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();

  const category = document
    .getElementById("categoryFilter")
    .value;

  const minPrice =
    Number(document.getElementById("minPrice").value) || 0;

  const maxPrice =
    Number(document.getElementById("maxPrice").value) || Infinity;

  const productsContainer = document.getElementById("products");

  let cards = Array.from(document.querySelectorAll(".card"));

  cards.forEach(card => {

    // 🔥 БЕЗОПАСНЫЙ ЗАГОЛОВОК (ВАЖНО)
    let title = "";

    const h3 = card.querySelector("h3");
    if (h3 && h3.textContent) {
      title = h3.textContent.toLowerCase().trim();
    }

    const price = Number(
      (card.dataset.price || "0").replace(/\s/g, "")
    );

    const categoryValue = card.dataset.category || "";

    // 🔥 ИСПРАВЛЕННЫЙ ПОИСК
    const matchesSearch =
      search === "" || title.includes(search);

    const matchesCategory =
      category === "" || categoryValue === category;

    const matchesPrice =
      price >= minPrice && price <= maxPrice;

    card.style.display =
      (matchesSearch && matchesCategory && matchesPrice)
        ? "block"
        : "none";
  });

  // сортировка
  const sortValue =
    document.getElementById("sortPrice").value;

  let visibleCards = cards.filter(
    card => card.style.display !== "none"
  );

  visibleCards.sort((a, b) => {
    const priceA = Number(a.dataset.price || 0);
    const priceB = Number(b.dataset.price || 0);

    if (sortValue === "asc") return priceA - priceB;
    if (sortValue === "desc") return priceB - priceA;

    return 0;
  });

  visibleCards.forEach(card => {
    productsContainer.appendChild(card);
  });

});
}


const resetBtn = document.getElementById("resetFilters");

if (resetBtn) {

  resetBtn.addEventListener("click", () => {

    // очищаем поля
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("sortPrice").value = "";

    // показываем все товары
    document.querySelectorAll(".card").forEach(card => {
      card.style.display = "block";
    });

  });

}

function openFilters() {
  document.getElementById("sidebarFilters").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeFilters() {
  document.getElementById("sidebarFilters").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

window.addEventListener("load", () => {
  const skeleton = document.getElementById("skeleton");

  if (skeleton) {
    setTimeout(() => {
      skeleton.style.display = "none";
    }, 800);
  }
});

