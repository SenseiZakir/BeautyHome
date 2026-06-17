function getLangText(ru, kg) {
  const lang = localStorage.getItem("lang") || "ru";
  return lang === "kg" ? kg : ru;
}


let isConfirmed = false;


// ======================
// ЗАГРУЗКА
// ======================

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("orderForm");
  const result = document.getElementById("result");
  const paymentResult = document.getElementById("paymentResult");


  if(result) result.style.display = "none";
  if(paymentResult) paymentResult.style.display = "none";


  // если уже подтверждали
  if(localStorage.getItem("isConfirmed") === "true"){
    isConfirmed = true;
  }



  // ======================
  // ФОРМА ЗАКАЗА
  // ======================

  if(form){

    form.addEventListener("submit", (e)=>{

      e.preventDefault();


      result.style.display="block";


      result.innerHTML = `
      <p>
      ${getLangText(
      "⏳ Проверяем данные...",
      "⏳ Маалыматтар текшерилүүдө..."
      )}
      </p>
      `;



      setTimeout(()=>{


        isConfirmed = true;

        localStorage.setItem(
          "isConfirmed",
          "true"
        );


        result.innerHTML = `

        <h2 style="color:green">

        ${getLangText(
        "✅ Ваши данные приняты",
        "✅ Маалыматтарыңыз кабыл алынды"
        )}

        </h2>


        <p>

        ${getLangText(
        "С вами свяжутся в ближайшее время",
        "Сиз менен жакын арада байланышабыз"
        )}

        </p>

        `;


      },1500);


    });

  }


  renderCart();

});




// ======================
// ОПЛАТА
// ======================

function pay(){

  console.log("PAY CLICK WORK");


  const form = document.getElementById("orderForm");
  const result = document.getElementById("result");
  const paymentResult = document.getElementById("paymentResult");


  // проверяем заполнение формы
  if(!form.checkValidity()){

    result.style.display="block";

    result.innerHTML = `
    <h2 style="color:red">

    ${getLangText(
      "⚠️ Сначала введите данные",
      "⚠️ Адегенде маалыматтарды жазыңыз"
    )}

    </h2>
    `;

    form.reportValidity();

    return;
  }



  // проверяем подтверждение заказа
  if(localStorage.getItem("isConfirmed") !== "true"){


    result.style.display="block";


    result.innerHTML = `

    <h2 style="color:red">

    ${getLangText(
    "⚠️ Сначала подтвердите заказ",
    "⚠️ Адегенде буйрутманы ырастаңыз"
    )}

    </h2>

    `;


    return;
  }



  const total =
  document.getElementById("totalPrice").innerText;



  paymentResult.style.display="block";


  paymentResult.innerHTML = `

  <p>

  ${getLangText(
  "⏳ Обработка платежа...",
  "⏳ Төлөм иштетилүүдө..."
  )}

  </p>

  `;



  setTimeout(()=>{


    paymentResult.innerHTML = `


    <h2 style="color:green">

    ${getLangText(
    "✅ Оплата прошла успешно",
    "✅ Төлөм ийгиликтүү өттү"
    )}

    </h2>


    <p>

    ${getLangText(
    "Сумма:",
    "Суммасы:"
    )}

    <b>${total} сом</b>

    </p>


    <p>

    ${getLangText(
    "Спасибо за заказ!",
    "Буйрутмаңыз үчүн рахмат!"
    )}

    </p>


    `;


  },2000);


}


window.pay = pay;




// ======================
// КОРЗИНА
// ======================


function renderCart(){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


const cartItems =
document.getElementById("cartItems");


const totalPrice =
document.getElementById("totalPrice");



if(!cartItems) return;



cartItems.innerHTML="";


let total=0;



cart.forEach((item,index)=>{


const div=document.createElement("div");


div.innerHTML = `


<div>

<b>${item.name}</b>

<br>

${item.price} сом

</div>


<div>


<button onclick="changeQty(${index},-1)">
−
</button>


${item.quantity}


<button onclick="changeQty(${index},1)">
+
</button>


<button onclick="removeItem(${index})">
✕
</button>


</div>


`;



cartItems.appendChild(div);


total += item.price * item.quantity;


});



totalPrice.innerText = total;


}




window.changeQty=function(index,delta){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


if(!cart[index]) return;


cart[index].quantity += delta;


if(cart[index].quantity <= 0){

cart.splice(index,1);

}


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


renderCart();

};





window.removeItem=function(index){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


cart.splice(index,1);



localStorage.setItem(
"cart",
JSON.stringify(cart)
);


renderCart();

};





window.clearCart=function(){


localStorage.removeItem("cart");

localStorage.removeItem("isConfirmed");


isConfirmed=false;


renderCart();


document.getElementById("result").innerHTML = `

<p style="color:red">

${getLangText(
"Корзина очищена",
"Себет тазаланды"
)}

</p>

`;

};

document.addEventListener("DOMContentLoaded", function(){

  const payBtn = document.getElementById("payBtn");

  if(payBtn){

    payBtn.addEventListener("click", pay);

  }

});
