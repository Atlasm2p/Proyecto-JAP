 function updateSummary(totalItems, totalUYU) {
    const itemCount = document.querySelector(".cart-summary .item-count");
    const totalPrice = document.querySelector(".cart-summary .total-price");

    if (itemCount && totalPrice) {
        itemCount.textContent = totalItems;
        totalPrice.textContent = `UYU ${totalUYU.toLocaleString()}`;
    }
}

 function renderCart(products) {
    let cartList = document.querySelector(".cart-list");
    cartList.innerHTML = "";
    let totalUYU = 0;
    let totalItems = 0;

    products.forEach((product, index) => {
      const item = document.createElement("div");
      item.classList.add("cart-item");

      const priceUYU = product.moneda === "USD" ? product.costo * 53.7 : product.costo;

      item.innerHTML = `
      <div class="item-image">
        <button class="save-btn select-btn"><i class="fa-solid fa-check"></i></button>
        <img src="${product.imagen}" alt="${product.nombre}">
        <h1 class="cart-item-title">${product.nombre}</h1>
      </div>
      <div class="item-data">
        <span>${product.moneda} ${product.costo.toLocaleString()}</span>
        <span style="color: gray; font-size: 12px;">UYU ${priceUYU.toLocaleString()}</span>
        <span style="color: blue; font-size: 12px;">Disponible</span>
        <div class="trash-container">
        <button class="save-btn delete-btn"><i class="fa-solid fa-trash"></i></button>
        <div class="counter-container">
          <button class="counter-btn decrease">-</button>
          <span class="counter-value">${product.cantidad || 1}</span>
          <button class="counter-btn increase">+</button>
        </div>
        </div>
      </div>
      `;

      cartList.appendChild(item);

      totalUYU += priceUYU * (product.cantidad || 1);
      totalItems += product.cantidad || 1;

      const decreaseBtn = item.querySelector(".decrease");
      const increaseBtn = item.querySelector(".increase");
      const deleteBtn = item.querySelector(".delete-btn");
      increaseBtn.addEventListener("click", () => {
      product.cantidad = (product.cantidad || 1) + 1;
      saveAndRender();
      });

      decreaseBtn.addEventListener("click", () => {
      if ((product.cantidad || 1) > 1) {
        product.cantidad--;
        saveAndRender();
      }
      });

      deleteBtn.addEventListener("click", () => {
      products.splice(index, 1);
      saveAndRender();
      });
    });

  }

  function saveAndRender() {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    renderCart(cartProducts);
  }
document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.querySelector(".cart-list");
  const summaryBtn = document.getElementById("summary-btn");

  // Obtener productos desde localStorage (si existen)
  let cartProducts = JSON.parse(localStorage.getItem("cartItems")) === null ? [] : JSON.parse(localStorage.getItem("cartItems"));

  // Si el carrito está vacío
  if (cartProducts.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart" style="text-align:center; padding:20px;">
        <p>No hay productos en el carrito</p>
      </div>
    `;
    return;
  }

  renderCart(cartProducts);



  // Botón “Continuar compra”
  if (summaryBtn) {
    summaryBtn.addEventListener("click", () => {
      alert("Redirigiendo al proceso de compra ");
    });
  }
});

