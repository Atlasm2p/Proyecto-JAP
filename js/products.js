document.addEventListener("DOMContentLoaded", () => {
    const CATALOG_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
    const container = document.querySelector(".catalog_container");

    // Función que crea la tarjeta de producto
    function createProductCard(product) {
      const card = document.createElement("div");
      card.classList.add("card_product");
  
      card.innerHTML = `
        <div class="section_image">
          <img src="${product.image}" alt="${product.name}" class="product_image">
        </div>
        <div class="section_info">
          <div class="name_item">${product.name}</div>
          <div class="desc_item">${product.description}</div>
          <div class="payment_item">
            <div class="price">${product.currency} ${product.cost.toLocaleString()}</div>
            <div class="button_pucharsed">
              <button>Comprar</button>
            </div>
          </div>
        </div>
      `;
  
      return card;
    }
  
    // Traemos los productos del JSON
    fetch(CATALOG_URL)
      .then(response => response.json())
      .then(data => {
        const products = data.products;
  
        // Limpiamos el contenedor antes de agregar productos
        container.innerHTML = "";
  
        // Insertamos cada tarjeta en el contenedor
        products.forEach(product => {
          const card = createProductCard(product);
          container.appendChild(card);
        });
      })
      .catch(error => console.error("Error al cargar productos:", error));
  });
