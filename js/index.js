document.addEventListener("DOMContentLoaded", async () => {
    // --- Lógica del menú ---
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

// Categorías
const categorias = [
    { nombre: 'autos', icono: 'fa-car', id: 101 },
    { nombre: 'juguetes', icono: 'fa-puzzle-piece', id: 102 },
    { nombre: 'muebles', icono: 'fa-couch', id: 103 },
    { nombre: 'herramientas', icono: 'fa-tools', id: 104 },
    { nombre: 'computadoras', icono: 'fa-laptop', id: 105 },
    { nombre: 'vestimenta', icono: 'fa-shirt', id: 106 },
    { nombre: 'electrodomesticos', icono: 'fa-plug', id: 107 },
    { nombre: 'deportes', icono: 'fa-baseball-ball', id: 108 },
    { nombre: 'celulares', icono: 'fa-mobile-alt', id: 109}
];

// Obtenemos los elementos del DOM
const carousel = document.querySelector('.categories-carousel');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Función para crear las tarjetas
function crearTarjetas() {
    categorias.forEach(categoria => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('category-card');
        tarjeta.dataset.categoria = categoria.nombre;

        // Frente de la tarjeta
        const frente = document.createElement('div');
        frente.classList.add('card-face', 'card-front');
        const icono = document.createElement('i');
        icono.classList.add('fa-solid', categoria.icono);
        frente.appendChild(icono);

        // Dorso de la tarjeta
        const dorso = document.createElement('div');
        dorso.classList.add('card-face', 'card-back');
        const nombreCategoria = document.createElement('span');
        nombreCategoria.textContent = categoria.nombre.toUpperCase();
        dorso.appendChild(nombreCategoria);

        tarjeta.appendChild(frente);
        tarjeta.appendChild(dorso);

        carousel.appendChild(tarjeta);

        // Añadir el evento de clic a cada tarjeta
        tarjeta.addEventListener('click', () => {
            // Redirección a products.html con el nombre de la categoría en la URL y actualizar CatID
            localStorage.setItem("catID", categoria.id);
            window.location.href = `products.html?category=${categoria.nombre}`;
        });
    });
}

// Llamar a la función para generar las tarjetas
crearTarjetas();

// Lógica de desplazamiento
nextBtn.addEventListener('click', () => {
    carousel.scrollBy({
        left: 200, // Ajusta este valor para el desplazamiento deseado
        behavior: 'smooth'
    });
});

prevBtn.addEventListener('click', () => {
    carousel.scrollBy({
        left: -200, // Ajusta este valor para el desplazamiento deseado
        behavior: 'smooth'
    });
});

})

    // --- Lógica de productos destacados ---
    const productosDestacados = [
        {
            name: "Bugatti Chiron",
            description: "El mejor hiperdeportivo de mundo. Producción limitada a 500 unidades.",
            image: "img/prod50925_2.jpg",
            cost: 3500000,
            currency: "USD"
        },
        {
            name: "Balón de basketball Wilson",
            description: "Balón oficial para entrenamientos, fabricado con materiales resistentes.",
            image: "img/prod50742_1.jpg",
            cost: 45,
            currency: "USD"
        },
        {
            name: "Sillón de tres plazas",
            description: "Perfecto para cualquier sala de estar. Comodidad garantizada.",
            image: "img/prod60802_2.jpg",
            cost: 1200,
            currency: "USD"
        },
        {
            name: "Laptop HP Spectre x360",
            description: "Convertible 2 en 1, con pantalla táctil y procesador de última generación.",
            image: "img/cat105_1.jpg",
            cost: 1599,
            currency: "USD"
        }
    ];

    const featuredProductsContainer = document.getElementById("featured-products-container");

    function createProductCard(product) {
        const card = document.createElement("div");
        card.classList.add("col-12", "col-md-6", "col-lg-3", "mb-4");
        
        card.innerHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-desc">${product.description}</p>
                    <p class="product-price"><strong>${product.currency} ${product.cost.toLocaleString()}</strong></p>
                </div>
            </div>
        `;
        return card;
    }

    function renderFeaturedProducts() {
        productosDestacados.forEach(product => {
            const productCard = createProductCard(product);
            featuredProductsContainer.appendChild(productCard);
        });
    }

    // ======== MODO OSCURO ========

// Referencia al botón
const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");

// Verificar si el usuario ya tiene guardado el modo oscuro
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  icon.classList.replace("fa-moon", "fa-sun");
}

// Cambiar el tema al hacer clic
themeToggle.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("dark-mode");

  // Actualizar icono
  const isDark = document.body.classList.contains("dark-mode");
  icon.classList.toggle("fa-sun", isDark);
  icon.classList.toggle("fa-moon", !isDark);

  // Guardar preferencia en localStorage
  localStorage.setItem("theme", isDark ? "dark" : "light");
});


    renderFeaturedProducts();