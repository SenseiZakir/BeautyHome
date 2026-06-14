const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const product = products.find(p => p.id === id);

if (!product) {
  document.body.innerHTML = "<h1>Товар не найден</h1>";
}

// HERO
document.querySelector("h1").textContent = product.title;
document.querySelector(".price").textContent = product.price + " сом";

// ОПИСАНИЕ
document.querySelector(".description").textContent = product.description;

// ГЛАВНАЯ КАРТИНКА
const mainImg = document.querySelector("#mainImage");
mainImg.src = product.images[0];

// МИНИАТЮРЫ
const thumbs = document.querySelector(".thumbnails");
thumbs.innerHTML = "";

product.images.forEach((img, index) => {
  const image = document.createElement("img");
  image.src = img;

  // первая картинка активная по умолчанию
  if (index === 0) {
    image.classList.add("active");
    mainImg.src = img;
  }

  image.addEventListener("click", () => {
    mainImg.src = img;

    // убрать актив у всех
    document.querySelectorAll(".thumbnails img")
      .forEach(i => i.classList.remove("active"));

    // поставить актив на текущую
    image.classList.add("active");
  });

  thumbs.appendChild(image);
});



const addToCartBtn = document.getElementById("addToCartBtn");

if (product && addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === product.title);

    if (existingItem) {
      existingItem.quantity += 1;
      showToast("Товар уже в корзине (+1)");
    } else {
      cart.push({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1
      });

      showToast("Добавлено в корзину");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  });
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

  // стиль (СИНИЙ)
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

  // reset анимации
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
  }, 1800);
}