document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");
  const result = document.getElementById("result");

  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");

  let isConfirmed = localStorage.getItem("isConfirmed") === "true";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    result.style.display = "block";

    result.innerHTML = "<p>⏳ Проверяем данные...</p>";

    setTimeout(() => {
      result.innerHTML = `
      <h2 style="color:green;">✅ Ваши данные приняты</h2>
      <p>С вами свяжутся в ближайшее время</p>
    `;

      isConfirmed = true;
      localStorage.setItem("isConfirmed", "true");
    }, 1500);
  });

  // делаем доступной оплату
  window.pay = function () {
    if (!isConfirmed) {
      result.style.display = "block";

      result.innerHTML = `
    <h2 style="color:red;">⚠️ Сначала введите ваши данные</h2>
  `;

      return;
    }

    const totalPrice = document.getElementById("totalPrice").value;

    const paymentResult = document.getElementById("paymentResult");

    paymentResult.style.display = "block";
    paymentResult.innerHTML = "<p>⏳ Обработка платежа...</p>";

    setTimeout(() => {
      paymentResult.innerHTML = `
        <h2 style="color:green;">✅ Оплата прошла успешно</h2>
        <p>Сумма оплаты: <b>${totalPrice} сом</b></p>
        <p>Спасибо за заказ!</p>
      `;
    }, 2000);
  };
  if (isConfirmed) {
    result.style.display = "block";
    result.innerHTML = `
    <h2 style="color:green;">✅ Данные уже подтверждены</h2>
  `;
  }

  

renderCart();
});

function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");

    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "10px";

    div.innerHTML = `
      <div style="flex:1;">
        <b>${item.name}</b><br>
        ${item.price} сом
      </div>

      <div style="display:flex; gap:5px; align-items:center;">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>

      <button onclick="removeItem(${index})"
        style="background:red;color:#fff;border:none;width:25px;height:25px;">
        ✕
      </button>
    `;

    cartItems.appendChild(div);

    total += item.price * item.quantity;
  });

  totalPrice.value = total;
}

window.clearCart = function () {
  localStorage.removeItem("cart");
  localStorage.removeItem("isConfirmed");

  // очищаем список на странице
  document.getElementById("cartItems").innerHTML = "";

  // обнуляем сумму
  document.getElementById("totalPrice").value = 0;

  // сообщение
  document.getElementById("result").innerHTML =
    "<p style='color:red;'>Корзина очищена</p>";
};

window.changeQty = function(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cart[index]) return;

  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};


window.removeItem = function(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
};