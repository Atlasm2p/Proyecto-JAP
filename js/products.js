document.addEventListener("DOMContentLoaded", () => {
    const CATALOG_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
    const container = document.querySelector(".catalog_container");

    // Función para crear la tarjeta de producto
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
                    <div class="quantity_sold">Vendidos: ${product.soldCount}</div>
                    <div class="button_pucharsed">
                        <button>Comprar</button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function toggleMenu() {
        dropdownMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        console.log('Menú toggled'); // Para debug
    }

    function closeMenu() {
        dropdownMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        console.log('Menú cerrado'); // Para debug
    }

    // Event listeners para el menú
    if (menuToggle) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (dropdownMenu && menuToggle && 
            !dropdownMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Cerrar menú con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
            
    // Cerrar menú al hacer clic en los enlaces
    const menuLinks = dropdownMenu ? dropdownMenu.querySelectorAll('a') : [];
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Traemos los productos del JSON
    fetch(CATALOG_URL)
        .then(response => response.json())
        .then(data => {
            const products = data.products;
            container.innerHTML = "";
            products.forEach(product => {
                const card = createProductCard(product);
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
});