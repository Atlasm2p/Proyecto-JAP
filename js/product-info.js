document.addEventListener('DOMContentLoaded', () => {

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
            } else {
                console.error(result.data);
                alert("Hubo un error al cargar la información del producto.");
            }
        })
        .catch(error => {
            console.error("Error al procesar la solicitud:", error);
            alert("Hubo un error al cargar la información del producto.");
        });

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

    document.getElementById('btn-back').addEventListener('click', () => {
        window.history.back();
    });
});