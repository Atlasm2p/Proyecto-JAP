const japceibal = "https://japceibal.github.io/emercado-api/cats_products/";

document.addEventListener("DOMContentLoaded", () => {
    const catID = localStorage.getItem("catID") || 101;
    const CATALOG_URL = japceibal + catID + ".json";
    const container = document.querySelector(".catalog_container");
    const buscarInput = document.getElementById('buscar-input');
    
    if (buscarInput) {
        buscarInput.addEventListener('input', buscarProductos);
    }

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

    
        
        
        // Añado un evento de clic a cada tarjeta de producto
        card.addEventListener('click', () => {
            // Guardo el ID del producto en el almacenamiento local
            localStorage.setItem('prodID', product.id);
            // Redirijo al usuario a la página de detalles del producto
            window.location.href = 'product-info.html';
        });
        
        
        return card;
    }

    function visualizarProductos(productos) {
        const container = document.querySelector(".catalog_container");
        container.innerHTML = "";
        productos.forEach(producto => {
        const card = createProductCard(producto);
        container.appendChild(card);
        });
    }

    let productos = []
    let productosFiltrados = []
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

    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function toggleMenu() {
        dropdownMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        console.log('Menú toggled');
    }

    function closeMenu() {
        dropdownMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        console.log('Menú cerrado');
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

    document.getElementById('filtrar-precio').addEventListener('click', () => {
    const min = parseFloat(document.getElementById('precio-min').value) || 0;
    const max = parseFloat(document.getElementById('precio-max').value) || Infinity;

    productosFiltrados = productos.filter(p => p.cost >= min && p.cost <= max);
    visualizarProductos(productosFiltrados);
    })

    document.getElementById('ordenar').addEventListener('change', (e) => {
        const value = e.target.value;

        if (value === "precio-asc") {
            productosFiltrados.sort((a, b) => a.cost - b.cost);
        } else if (value === "precio-desc") {
            productosFiltrados.sort((a, b) => b.cost - a.cost);
        } else if (value === "relevancia") {
            productosFiltrados.sort((a, b) => b.soldCount - a.soldCount);
        }
        visualizarProductos(productosFiltrados)
    })
});

function buscarProductos() {
    const input = document.getElementById('buscar-input');
    const filter = input.value.toLowerCase();
    const container = document.querySelector('.catalog_container');
    const cards = container.getElementsByClassName('card_product');

    Array.from(cards).forEach(card => {
        const nameElem = card.querySelector('.name_item');
        const descElem = card.querySelector('.desc_item');
        const name = nameElem.textContent.toLowerCase();
        const description = descElem.textContent.toLowerCase();
        if (name.includes(filter) || description.includes(filter)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
