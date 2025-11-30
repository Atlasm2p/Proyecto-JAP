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

  // Estrellas promedio
  const overallStarsHTML = Array.from({ length: 5 }, (v, i) => {
    const roundedScore = Math.round(parseFloat(summary.average));
    return `<span class="fa fa-star ${i < roundedScore ? 'checked' : 'empty'}"></span>`;
  }).join('');
  document.getElementById('overall-star-rating').innerHTML = overallStarsHTML;

  // Barra de desglose
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

  // Comentarios individuales
  if (comments.length === 0) {
    commentsListContainer.innerHTML = '<p class="no-comments">Aún no hay opiniones para este producto.</p>';
    return;
  }

  commentsListContainer.innerHTML = comments.map(comment => {
    const stars = Array.from({ length: 5 }, (v, i) =>
      `<span class="fa fa-star ${i < comment.score ? 'checked' : 'empty'}"></span>`
    ).join('');

    const date = new Date(comment.dateTime).toLocaleString('es-UY', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).replace(',', '');

    return `
      <div class="comment-item">
        <div class="comment-header">
          <span class="comment-user"><strong>${comment.user}</strong></span>
          <span class="comment-date">${date}</span>
        </div>
        <div class="comment-title-rating">
          <div class="comment-rating">${stars}</div>
          ${comment.title ? `<strong>${comment.title}</strong>` : ''}
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
  }).join('');
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
    thumbsContainer.innerHTML = '';
    product.images.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.classList.add('img-thumbnail', 'm-1');
      img.style.cursor = 'pointer';
      img.style.maxWidth = '100px';
      img.addEventListener('click', () => mainImageElement.src = url);
      thumbsContainer.appendChild(img);
    });
  } else {
    mainImageElement.src = "img/placeholder.png";
    thumbsContainer.innerHTML = '<p>No hay imágenes disponibles.</p>';
  }

  const quantitySelector = document.getElementById('qty-select');
  const buyNowButton = document.getElementById('buy-now');
  const addToCartButton = document.getElementById('add-to-cart');

  function addToCart() {
    let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const selectedQuantity = parseInt(quantitySelector.value);

    const existing = cartProducts.find(p => p.name === product.name);

    if (existing) {
      existing.quantity += selectedQuantity;
    } else {
      cartProducts.push({
        id: product.id || parseInt(localStorage.getItem("prodID"), 10) || null,
        name: product.name,
        cost: product.cost,
        currency: product.currency,
        quantity: selectedQuantity,
        image: product.images[0]
      });
    }

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    alert(`${selectedQuantity} unidad(es) de ${product.name} agregadas al carrito`);
  }

  addToCartButton.addEventListener("click", () => {
    addToCart();
    updateCartBadge();
  });

  buyNowButton.addEventListener("click", () => {
    addToCart();
    window.location.href = "cart.html";
  });
}

// ==================== DOMContentLoaded ====================

document.addEventListener("DOMContentLoaded", () => {
  // --- Menú desplegable ---
  const menuToggle = document.getElementById("menu-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const menuOverlay = document.getElementById("menu-overlay");

  function toggleMenu() {
    dropdownMenu.classList.toggle("active");
    menuOverlay.classList.toggle("active");
  }

  function closeMenu() {
    dropdownMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
  }

  if (menuToggle) menuToggle.addEventListener("click", e => { e.preventDefault(); toggleMenu(); });
  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  const menuLinks = dropdownMenu ? dropdownMenu.querySelectorAll("a") : [];
  menuLinks.forEach(link => link.addEventListener("click", closeMenu));

  // --- Cargar datos del producto ---
  const productID = localStorage.getItem("prodID");
  if (!productID) {
    alert("No se ha seleccionado ningún producto.");
    window.location.href = "index.html";
    return;
  }

  // Comportamiento original: cargar desde JSON remoto
  getJSONData(PRODUCT_INFO_URL + productID + EXT_TYPE)
    .then(result => {
      if (result.status === "ok") {
        displayProductDetails(result.data);
        fetchAndDisplayComments(productID);
      } else {
        alert("Error al cargar el producto.");
      }
    });

  // --- Botón atrás ---
  document.getElementById("btn-back").addEventListener("click", () => window.history.back());

  // --- Rating interactivo ---
  const stars = document.querySelectorAll(".star-rating .fa-star");
  let rating = 0;
  stars.forEach(star => {
    star.addEventListener("mouseover", () => {
      const value = parseInt(star.getAttribute("data-value"));
      stars.forEach(s => s.classList.toggle("active", parseInt(s.getAttribute("data-value")) <= value));
    });
    star.addEventListener("mouseout", () => {
      stars.forEach(s => s.classList.toggle("active", parseInt(s.getAttribute("data-value")) <= rating));
    });
    star.addEventListener("click", () => {
      rating = parseInt(star.getAttribute("data-value"));
      document.getElementById("rating").value = rating;
    });
  });

  // --- Envío de reseña ---
  document.getElementById("review-form").addEventListener("submit", e => {
    e.preventDefault();
    const text = document.querySelector(".review-text").value.trim();
    const user = sessionStorage.getItem("usuario") || "Usuario";
    const score = parseInt(document.getElementById("rating").value);

    if (score > 0 && text !== "") {
      const newComment = {
        user,
        score,
        description: text,
        dateTime: new Date().toISOString()
      };
      allComments.push(newComment);
      displayComments(allComments);
      e.target.reset();
      stars.forEach(s => s.classList.remove("active"));
    } else {
      alert("Por favor, selecciona una calificación y escribe un comentario.");
    }
  });

  // --- Productos relacionados ---
  const catID = localStorage.getItem("catID") || 101;
  // Comportamiento original: relacionados desde JSON remoto
  getJSONData(PRODUCTS_URL + catID + EXT_TYPE)
    .then(result => {
      if (result.status === "ok") {
        const relatedContainer = document.getElementById("related-products");
        relatedContainer.innerHTML = "";
        result.data.products.forEach(prod => {
          if (prod.id == productID) return;
          const card = document.createElement("div");
          card.classList.add("card_product", "m-2");
          card.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}" class="product_image">
            <div class="name_item">${prod.name}</div>
            <div class="price">${prod.currency} ${prod.cost}</div>
          `;
          card.addEventListener("click", () => {
            localStorage.setItem("prodID", prod.id);
            window.location.href = "product-info.html";
          });
          relatedContainer.appendChild(card);
        });
      }
    });
});

// ======== MODO OSCURO ========
const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  icon.classList.replace("fa-moon", "fa-sun");
}
themeToggle.addEventListener("click", e => {
  e.preventDefault();
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  icon.classList.toggle("fa-sun", isDark);
  icon.classList.toggle("fa-moon", !isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
