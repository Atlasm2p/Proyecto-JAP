document.addEventListener("DOMContentLoaded", async () => {
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

    // Abrir/cerrar menú con el ícono
    if (menuToggle) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Cerrar menú al hacer clic en overlay
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

    const buttons = document.querySelectorAll(".section-head .btn button"); 
    const cards = document.querySelectorAll(".cat-grid .card"); 
    let activeIndex = -1; 
    buttons.forEach((btn, i) => { 
        btn.addEventListener("click", () => { 
            if (i === 0) { 
                if (activeIndex !== -1) { 
                    cards[activeIndex].classList.remove("active"); 
                    activeIndex += -1; 
                    cards[activeIndex].classList.add("active"); 
                } else { 
                    activeIndex = 5; 
                    cards[activeIndex].classList.add("active"); 
                } 
            } else if (i === 1) { 
                if (activeIndex === 5) { 
                    cards[activeIndex].classList.remove("active"); 
                    activeIndex = -1; 
                } else { 
                    if (activeIndex !== -1) { 
                        cards[activeIndex].classList.remove("active"); 
                    } 
                    activeIndex += 1; 
                    cards[activeIndex].classList.add("active"); 
                } 
            } 
        });
    });
        

    const CATALOG_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
    const slidesContainer = document.querySelector(".slides");
    const productsContainer = document.querySelector(".products");
    slidesContainer.innerHTML = "";
    productsContainer.innerHTML = "";
    try {
        const response = await fetch(CATALOG_URL);
        const data = await response.json();
        const products = data.products;
        for (let i = 0; i < 5; i++) {
            console.log(i)
            if (i < 3) {
                const slide = document.createElement("div");
                slide.classList.add("slide");
            
                slide.innerHTML = `
                    <div class="slide-text">
                        <div class= "slide-header">${products[i].name}</div>
                        <div class="slide-desc">${products[i].description}</div>
                        <div class="slide-btn"><button onclick="window.location.href='products.html'">Más Información</button></div>
                    </div>
                    <div class="slide-img"><img src="${products[i].image}" alt="${products[i].name}">
                `;
                slidesContainer.appendChild(slide)
            }
            const product = document.createElement("article");
            product.classList.add("product");

            product.innerHTML = `
            <div class="thumb"><img src="${products[i].image}" alt=""></div>
            <div class="info"><h4>${products[i].name}</h4>
                <div class="cost">${products[i].cost} ${products[i].currency}</div>
            </div>
            <a class="buy" href="products.html">Ver producto</a>
          `
          productsContainer.appendChild(product)
        }
    } catch (error) {
    console.error("Error al cargar catálogo:", error);
  }
});