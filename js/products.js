const japceibal = "https://japceibal.github.io/emercado-api/cats_products/";

document.addEventListener("DOMContentLoaded", () => {
    const catID = localStorage.getItem("catID") || 101;
    const CATALOG_URL = japceibal + catID + ".json";
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
                    <div class="button_pucharsed">
                        <button>Comprar</button>
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            localStorage.setItem('prodID', product.id);
            window.location.href = 'product-info.html';
        });

        return card;
    }

    function visualizarProductos(productos) {
        container.innerHTML = "";
        productos.forEach(producto => {
            container.appendChild(createProductCard(producto));
        });
    }

    let productos = [];
    let productosFiltrados = [];

    // Traemos los productos del JSON
    fetch(CATALOG_URL)
        .then(response => response.json())
        .then(data => {
            const titleElement = document.getElementById('title');
            titleElement.textContent = data.catName || 'Catálogo';
            productos = data.products;
            productosFiltrados = [...productos];
            visualizarProductos(productosFiltrados);
        })
        .catch(error => console.error("Error al cargar productos:", error));

    // Función central de filtros
    function aplicarFiltros() {
        const min = parseFloat(document.getElementById('precio-min').value) || 0;
        const max = parseFloat(document.getElementById('precio-max').value) || Infinity;
        const financiableSwitch = document.getElementById('financiable-switch').checked;
        const buscar = document.getElementById('buscar-input').value.toLowerCase();

        productosFiltrados = productos.filter(p => {
            let cumple = true;

            // Precio
            if (!(p.cost >= min && p.cost <= max)) cumple = false;

            // Financiable
            const financiables = [...productos];
            financiables.splice(-1, 1);
            if (financiableSwitch && !financiables.includes(p)) cumple = false;

            // Búsqueda
            const nombreDesc = (p.name + " " + p.description).toLowerCase();
            if (buscar && !nombreDesc.includes(buscar)) cumple = false;

            return cumple;
        });

        // Orden
        const orden = document.getElementById('ordenar').value;
        if (orden === "precio-asc") {
            productosFiltrados.sort((a, b) => a.cost - b.cost);
        } else if (orden === "precio-desc") {
            productosFiltrados.sort((a, b) => b.cost - a.cost);
        } else if (orden === "relevancia") {
            productosFiltrados.sort((a, b) => b.soldCount - a.soldCount);
        }

        visualizarProductos(productosFiltrados);
    }

    // Asignar eventos a filtros
    ['precio-min', 'precio-max', 'tipo', 'marca', 'ano', 'ordenar', 'financiable-switch', 'buscar-input'].forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.addEventListener(id === 'buscar-input' ? 'input' : 'change', aplicarFiltros);
        }
    });

    // Botón mostrar todos
    const botonMostrarTodos = document.querySelector('.filtro-boton-todo');
    if (botonMostrarTodos) {
        botonMostrarTodos.addEventListener('click', () => {
            productosFiltrados = [...productos]; 
            visualizarProductos(productosFiltrados);

            document.getElementById('precio-min').value = "";
            document.getElementById('precio-max').value = "";
            document.getElementById('ordenar').value = "";
            document.getElementById('tipo').value = "";
            document.getElementById('marca').value = "";
            document.getElementById('ano').value = "";
            document.getElementById('buscar-input').value = "";
            document.getElementById('financiable-switch').checked = false;
        });
    }

    // --- MENÚ (igual que tu versión original) ---
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

    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    document.addEventListener('click', function (e) {
        if (dropdownMenu && menuToggle &&
            !dropdownMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    const menuLinks = dropdownMenu ? dropdownMenu.querySelectorAll('a') : [];
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));
});
