document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.querySelector(".cart-list");
  const totalItemsEl = document.querySelector(".cart-summary .summary-item span[style*='orange']");
  const totalEl = document.querySelector(".cart-summary .summary-item span[style*='UYU']");
  const summaryBtn = document.getElementById("summary-btn");

  // Obtener productos desde localStorage (si existen)
  let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

  // Si el carrito está vacío
  if (cartProducts.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart" style="text-align:center; padding:20px;">
        <p>No hay productos en el carrito</p>
      </div>
    `;
    updateSummary(0, 0);
    return;
  }

  renderCart(cartProducts);

  function renderCart(products) {
    cartList.innerHTML = "";
    let totalUYU = 0;
    let totalItems = 0;

    products.forEach((product, index) => {
      const item = document.createElement("div");
      item.classList.add("cart-item");

      const priceUYU = product.currency === "USD" ? product.cost * 53.7 : product.cost;

      item.innerHTML = `
        <div class="item-image">
          <button class="save-btn select-btn"><i class="fa-solid fa-check"></i></button>
          <img src="${product.image}" alt="${product.name}">
          <h1 class="cart-item-title">${product.name}</h1>
        </div>
        <div class="item-data">
          <span>${product.currency} ${product.cost.toLocaleString()}</span>
          <span style="color: gray; font-size: 12px;">UYU ${priceUYU.toLocaleString()}</span>
          <span style="color: blue; font-size: 12px;">Disponible</span>
          <div class="trash-container">
            <button class="save-btn delete-btn"><i class="fa-solid fa-trash"></i></button>
            <div class="counter-container">
              <button class="counter-btn decrease">-</button>
              <span class="counter-value">${product.quantity || 1}</span>
              <button class="counter-btn increase">+</button>
            </div>
          </div>
        </div>
      `;

      cartList.appendChild(item);

      totalUYU += priceUYU * (product.quantity || 1);
      totalItems += product.quantity || 1;

      const decreaseBtn = item.querySelector(".decrease");
      const increaseBtn = item.querySelector(".increase");
      const counterValue = item.querySelector(".counter-value");
      const deleteBtn = item.querySelector(".delete-btn");

      increaseBtn.addEventListener("click", () => {
        product.quantity = (product.quantity || 1) + 1;
        saveAndRender();
      });

      decreaseBtn.addEventListener("click", () => {
        if ((product.quantity || 1) > 1) {
          product.quantity--;
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

  // Botón “Continuar compra”
  if (summaryBtn) {
    summaryBtn.addEventListener("click", () => {
      alert("Redirigiendo al proceso de compra ");
    });
  }
});

