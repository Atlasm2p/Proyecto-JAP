document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".catalog_container");

    // --- Lógica del menú
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function toggleMenu() {
        dropdownMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    }

    function closeMenu() {
        dropdownMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    }

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

    document.addEventListener('click', function (e) {
        if (dropdownMenu && menuToggle &&
            !dropdownMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    const menuLinks = dropdownMenu ? dropdownMenu.querySelectorAll('a') : [];
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- Lógica de productos por categoría
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

    const categoryMap = {
        'autos': '101',
        // 'juguetes': 'XXX',
        // 'muebles': 'XXX',
        // 'computadoras': 'XXX',
        // 'deportes': 'XXX',
        // 'celulares': 'XXX',
        // 'vestimenta': 'XXX',
        // 'electrodomesticos': 'XXX',
        // 'herramientas': 'XXX'
    };

    // Función principal para cargar los datos
    async function loadCategoryProducts() {
        const params = new URLSearchParams(window.location.search);
        const categoryName = params.get('category');
        
        if (!categoryName || !categoryMap[categoryName]) {
            console.error("Categoría no válida o no encontrada.");
            container.innerHTML = "<p>No se encontraron productos para esta categoría.</p>";
            return;
        }

        const categoryId = categoryMap[categoryName];
        const CATALOG_URL = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;

        try {
            const response = await fetch(CATALOG_URL);
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            const data = await response.json();
            
            const products = data.products;
            container.innerHTML = "";
            products.forEach(product => {
                const card = createProductCard(product);
                container.appendChild(card);
            });

        } catch (error) {
            console.error("Error al cargar productos:", error);
            container.innerHTML = "<p>Hubo un error al mostrar los productos.</p>";
        }
    }

    // Llamamos a la función principal
    loadCategoryProducts();
});