let allComments = [];

function fetchAndDisplayComments(prodId) { 
        getJSONData(PRODUCT_INFO_COMMENTS_URL + prodId + EXT_TYPE) 
            .then(response => {
                if (response.status === "ok") {
                    displayComments(response.data);
                } else {
                    console.error("Error al cargar los comentarios:", response.data);
                }
            })
            .catch(error => {
                console.error("Error en la solicitud de comentarios:", error);
            });
    }

    function calculateRatingsSummary(comments) {
        let totalScore = 0;
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        if (comments.length === 0) {
            return { average: 0, totalCount: 0, percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
        }

        comments.forEach(comment => {
            totalScore += comment.score;
            if (comment.score >= 1 && comment.score <= 5) {
                ratingCounts[comment.score]++;
            }
        });

        const average = (totalScore / comments.length).toFixed(1);

        const percentages = {};
        for (let score = 1; score <= 5; score++) {
            percentages[score] = Math.round((ratingCounts[score] / comments.length) * 100);
        }

        return {
            average: average,
            totalCount: comments.length,
            counts: ratingCounts,
            percentages: percentages
        };
    }

    function displayComments(comments) {
        const commentsListContainer = document.getElementById('comments-list');
        const summary = calculateRatingsSummary(comments);
        allComments = comments;
        
        document.getElementById('overall-score-big').textContent = summary.average;
        document.getElementById('total-ratings-count').textContent = `${summary.totalCount} calificaciones totales`;

        
        const overallStarsHTML = Array.from({ length: 5 }, (v, i) => {
            
            const roundedScore = Math.round(parseFloat(summary.average));
            return `<span class="fa fa-star ${i < roundedScore ? 'checked' : 'empty'}"></span>`;
        }).join('');
        document.getElementById('overall-star-rating').innerHTML = overallStarsHTML;
        
        
        const ratingBreakdownContainer = document.getElementById('rating-breakdown');
        const ratingBreakdownHTML = Array.from({ length: 5 }, (v, i) => {
            const score = 5 - i;
            const percentage = summary.percentages[score] || 0; 
            
            return `
                <div class="rating-row">
                    <span class="stars">${score} estrella${score !== 1 ? 's' : ''}</span>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${percentage}%;"></div>
                    </div>
                    <span class="percentage">${percentage}%</span>
                </div>
            `;
        }).join('');
        ratingBreakdownContainer.innerHTML = ratingBreakdownHTML;


        
        let commentsHTML = "";
        
        if (comments.length === 0) {
            commentsListContainer.innerHTML = '<p class="no-comments">Aún no hay opiniones para este producto.</p>';
            return;
        }

        comments.forEach(comment => {
            const starRating = Array.from({ length: 5 }, (v, i) => {
                return `<span class="fa fa-star ${i < comment.score ? 'checked' : 'empty'}"></span>`;
            }).join('');

            
            const title = comment.title ? `<strong>${comment.title}</strong>` : '';

            
            const date = new Date(comment.dateTime).toLocaleString('es-UY', {
                year: 'numeric', month: '2-digit', day: '2-digit', 
                hour: '2-digit', minute: '2-digit'
            }).replace(',', ''); 

            commentsHTML += `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-user">
                            <strong>${comment.user}</strong>
                        </span>
                        <span class="comment-date">${date}</span>
                    </div>
                    <div class="comment-title-rating">
                        <div class="comment-rating">${starRating}</div>
                        ${title}
                        <div class="comment-actions">
                            <button class="btn btn-sm btn-light comment-useful-btn">
                                <i class="far fa-thumbs-up"></i> Útil
                            </button>
                            <span class="useful-count">5</span>
                        </div>
                    </div>
                    <p class="comment-description">${comment.description}</p>
                </div>
            `;
        });
        commentsListContainer.innerHTML = commentsHTML;
    }


    

    function displayProductDetails(product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-sold').textContent = `${product.soldCount} vendidos`;
        document.getElementById('product-price').textContent = `${product.currency} ${product.cost}`;
        document.getElementById('product-description').textContent = product.description;

        document.getElementById('product-category').textContent = product.category; 

        const mainImageElement = document.getElementById('product-image-main');
        const thumbsContainer = document.getElementById('product-thumbs');

        if (product.images && product.images.length > 0) {
            mainImageElement.src = product.images[0];
            mainImageElement.alt = `Imagen principal de ${product.name}`;

            thumbsContainer.innerHTML = ''; 

            product.images.forEach(imageUrl => {
                const thumbImg = document.createElement('img');
                thumbImg.src = imageUrl;
                thumbImg.classList.add('img-thumbnail', 'm-1'); 
                thumbImg.style.cursor = 'pointer'; 
                thumbImg.style.maxWidth = '100px'; 
                
                thumbImg.addEventListener('click', () => {
                    mainImageElement.src = imageUrl;
                });

                thumbsContainer.appendChild(thumbImg);
            });
        } else {
            mainImageElement.src = "img/placeholder.png"; 
            mainImageElement.alt = "Imagen no disponible";
            thumbsContainer.innerHTML = '<p>No hay imágenes disponibles.</p>';
        }

        const quantitySelector = document.getElementById('qty-select');
        const buyNowButton = document.getElementById('buy-now');
        buyNowButton.addEventListener('click', () => {
            const selectedQuantity = parseInt(quantitySelector.value);
            alert(`Agregando ${selectedQuantity} unidad(es) de ${product.name} al carrito.`);
        });
    }

    // Funciones para el boton comprar

    const btnComprar = document.getElementById('buy-now');

    btnComprar.addEventListener("click", function() {
        let infoProducto = [];

        getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE)
        .then(result => {
            if (result.status === "ok") {
                const productData = result.data;
                productData.products.forEach(product => {
                    if (product.id === parseInt(localStorage.getItem('prodID'))) {
                        infoProducto.push({
                            nombre: product.name,
                            costo: product.cost,
                            moneda: product.currency,
                            cantidad: document.getElementById("qty-select").value,
                            imagen: product.image,
                            subtotal: product.cost * document.getElementById("qty-select").value
                        });
                        localStorage.setItem("productInfo", JSON.stringify(infoProducto));
                        window.location.href = "cart.html"
                    };
                });
            } else {
                console.error(result.data);
                alert("Hubo un error al cargar la información del producto.");
            }
        })
        .catch(error => {
            console.error("Error al procesar la solicitud:", error);
            alert("Hubo un error al cargar la información del producto.");
        });
    });


document.addEventListener('DOMContentLoaded', () => {
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
    
    const productID = localStorage.getItem('prodID');

    if (!productID) {
        alert("No se ha seleccionado ningún producto.");
        window.location.href = "index.html"; 
        return;
    }

    
    getJSONData(PRODUCT_INFO_URL + productID + EXT_TYPE)
        .then(result => {
            if (result.status === "ok") {
                const productData = result.data;
                displayProductDetails(productData);
                
                fetchAndDisplayComments(productID);
            } else {
                console.error(result.data);
                alert("Hubo un error al cargar la información del producto.");
            }
        })
        .catch(error => {
            console.error("Error al procesar la solicitud:", error);
            alert("Hubo un error al cargar la información del producto.");
        });

    document.getElementById('btn-back').addEventListener('click', () => {
        window.history.back();
    });

    const stars = document.querySelectorAll(".star-rating .fa-star");
    let rating = 0;

    stars.forEach(star => {

        star.addEventListener("mouseover", () => {
            const value = parseInt(star.getAttribute("data-value"));
            stars.forEach(s => {
                s.classList.toggle("active", parseInt(s.getAttribute("data-value")) <= value);
            });
        });

        star.addEventListener("mouseout", () => {
            if (rating == 0) {
                stars.forEach(s => s.classList.remove("active"));
            } else {
                stars.forEach(s => {
                s.classList.toggle("active", parseInt(s.getAttribute("data-value")) <= rating);    
                })
            }
        });

        star.addEventListener("click", () => {
            rating = parseInt(star.getAttribute("data-value"));
            stars.forEach(s => {
            s.classList.toggle("active", parseInt(s.getAttribute("data-value")) <= rating);
            });
            document.getElementById("rating").value = rating;
        });
    });

    document.getElementById("review-form").addEventListener("submit", function(e) {
        if (rating === 0) {
            e.preventDefault();
            alert("⚠️ Por favor selecciona una calificación antes de enviar.");
            return;
        }
    })

    const catID = localStorage.getItem("catID") || 101;

    getJSONData(PRODUCTS_URL + catID + EXT_TYPE)
        .then(result => {
            if (result.status === "ok") {
                const productData = result.data;
                displayRelatedProducts(productData);
            } else {
                console.error(result.data);
                alert("Hubo un error al cargar la información del producto.");
            }
        })
        .catch(error => {
            console.error("Error al procesar la solicitud:", error);
            alert("Hubo un error al cargar la información del producto.");
        });

    function displayRelatedProducts(relatedProducts) {
        const relatedContainer = document.getElementById('related-products');
        relatedContainer.innerHTML = '';

        relatedProducts.products.forEach(prod => {
            if (prod.id === productID) return;
            const prodCard = document.createElement('div');
            prodCard.classList.add('card_product', 'm-2');
            prodCard.style.cursor = 'pointer';

            prodCard.innerHTML = `
                <img src="${prod.image}" alt="${prod.name}" class="product_image">
                <div class="name_item">${prod.name}</div>
                <div class="price">${prod.currency} ${prod.cost}</div>
            `;

            prodCard.addEventListener('click', () => {
                localStorage.setItem('prodID', prod.id);
                window.location.href = 'product-info.html';
            });

            relatedContainer.appendChild(prodCard);
        });
    }


});
document.getElementById('review-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const selectedStars = document.getElementById('rating');
    const commentText = document.querySelector('.review-text').value.trim();
    const usuario = sessionStorage.getItem('usuario');

    if (selectedStars.value>0 && commentText !== '') {
        const newComment = {
            user: usuario,
            score: selectedStars.value,
            description: commentText,
            dateTime: new Date().toISOString()
        };
        allComments.push(newComment);
        displayComments(allComments); // Re-render comments
        document.getElementById('review-form').reset();
        document.querySelectorAll('.star-rating .fa-star').forEach(star => {
            star.classList.remove('active');
        });
        const commentsList = document.getElementById('comments-list');
        const y = commentsList.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
        alert('Por favor, selecciona una calificación y escribe un comentario.');
    }
});

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
