document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.querySelector(".cart-list");
  const totalItemsEl = document.querySelector(".cart-summary .summary-item span[style*='orange']");
  const subtotalEl = document.querySelector(".cart-summary .summary-item span[style*='UYU']");
  const envioPrecio = document.querySelectorAll(".cart-summary .summary-item span[style*='UYU']")[1];
  const totalEl = document.querySelector(".cart-summary .summary-item span[style*='font-weight: bold; font-size: large; margin-left: auto; margin-right: 5%;']");
  const summaryBtn = document.getElementById("summary-btn");
  let tipoEnvio = "standard";
  let subtotalUYU = 0;
  let envioUYU = 0;
  let totalUYU = 0;
  let totalItems = 0;

  // Obtener productos desde localStorage (si existen)
  let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

  // Si el carrito está vacío
  if (cartProducts.length === 0) {
    showEmptyCart();
    return;
  }

  renderCart(cartProducts);


  function renderCart(products) {
    cartList.innerHTML = "";
    subtotalUYU = 0;
    calcularEnvio();
    totalItems = 0;

    products.forEach((product, index) => {
      const item = document.createElement("div");
      item.classList.add("cart-item");

      const priceUYU = product.currency === "USD" ? product.cost * 53.7 : product.cost;

      item.innerHTML = `
        <div class="item-image">
          <button class="save-btn select-btn ${product.selected ? "selected" : ""}">
            <i class="fa-solid fa-check"></i>
          </button>
          <img src="${product.image}" alt="${product.name}">
          <h1 class="cart-item-title">${product.name}</h1>
        </div>
        <div class="item-data">
          <span>${product.currency} ${product.cost.toLocaleString()}</span>
          <span style="color: gray; font-size: 12px;">UYU ${priceUYU.toLocaleString()}</span>
          <span style="color: blue; font-size: 12px;">Disponible</span>
          <div class="trash-container">
            <button class="save-btn delete-btn"><i class="fa-solid fa-trash"></i></button>
            <div class="counter-container">
              <button class="counter-btn decrease">-</button>
              <span class="counter-value">${product.quantity || 1}</span>
              <button class="counter-btn increase">+</button>
            </div>
          </div>
        </div>
      `;

      cartList.appendChild(item);

      // Totales solo para productos seleccionados
      if (product.selected !== false) {
        subtotalUYU += priceUYU * (product.quantity || 1);
        calcularEnvio();
        totalItems += product.quantity || 1;
      }

      // Botones
      const decreaseBtn = item.querySelector(".decrease");
      const increaseBtn = item.querySelector(".increase");
      const deleteBtn = item.querySelector(".delete-btn");
      const selectBtn = item.querySelector(".select-btn");

      // Aumentar cantidad
      increaseBtn.addEventListener("click", () => {
        product.quantity = (product.quantity || 1) + 1;
        saveAndRender();
        updateCartBadge();
      });

      // Disminuir cantidad
      decreaseBtn.addEventListener("click", () => {
        if ((product.quantity || 1) > 1) {
          product.quantity--;
          saveAndRender();
          updateCartBadge();
        }
      });

      // Eliminar producto
      deleteBtn.addEventListener("click", () => {
        products.splice(index, 1);
        if (products.length === 0) {
          showEmptyCart();
        }
        saveAndRender();
        updateCartBadge();
      });

      // Seleccionar producto
      selectBtn.addEventListener("click", () => {
        product.selected = !product.selected;
        saveAndRender();
      });
    });

    updateSummary(totalItems, subtotalUYU, envioUYU);
  }

  // Guardar cambios y volver a renderizar
  function saveAndRender() {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    renderCart(cartProducts);
  }

  // Mostrar carrito vacío
  function showEmptyCart() {
    cartList.innerHTML = `
      <div class="empty-cart" style="text-align:center; padding:20px;">
        <p>No hay productos en el carrito</p>
      </div>
    `;
    updateSummary(0, 0, 0);
  }

  // Actualizar totales
  function updateSummary(totalItems = 0, subtotalUYU = 0, envioUYU = 0) {
    totalItemsEl.textContent = totalItems;
    subtotalEl.textContent = `UYU ${subtotalUYU.toLocaleString()}`;
    envioPrecio.textContent = `UYU ${(parseInt(envioUYU)).toLocaleString()}`;
    totalUYU = subtotalUYU + (parseInt(envioUYU));
    totalEl.textContent = `UYU ${(totalUYU).toLocaleString()}`;
  }

  // Botón “Finalizar compra” (Implementación de Pauta 4)
  if (summaryBtn) {
    summaryBtn.textContent = "Finalizar Compra"; // Actualiza el texto del botón
    summaryBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Previene cualquier envío de formulario no deseado

      // Ejecuta la validación principal
      if (validarCompra()) {
        // Si es exitoso, muestra el feedback
        mostrarFeedbackExitoso();
      } else {
        // Si falla, el feedback se mostrará a través de las clases 'is-invalid' de Bootstrap
        // Opcional: Podrías usar un alert o un toast aquí.
      }
    });
  }
  const themeToggle = document.getElementById("theme-toggle");
  const icon = themeToggle.querySelector("i");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  }

  themeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    icon.classList.toggle("fa-sun", isDark);
    icon.classList.toggle("fa-moon", !isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  const menuToggle = document.getElementById("menu-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        dropdownMenu.classList.remove("active");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") dropdownMenu.classList.remove("active");
    });
  }

  // Actualizar Tipo de envio
  const envioSelect = document.getElementById("tipo-envio");
  const labelEnvio = document.getElementById("label-tipo-envio");

  envioSelect.addEventListener("change", () => {
    if (envioSelect.value === "premium") {
      tipoEnvio = envioSelect.value;
      labelEnvio.textContent = "2 a 5 días (15%)";
      calcularEnvio();
    } else if (envioSelect.value === "express") {
      tipoEnvio = envioSelect.value;
      labelEnvio.textContent = "5 a 8 días (7%)";
      calcularEnvio();
    } else if (envioSelect.value === "standard") {
      tipoEnvio = envioSelect.value;
      labelEnvio.textContent = "12 a 15 días (5%)";
      calcularEnvio();
    }


  });

  function calcularEnvio() {
    if (tipoEnvio === "premium") {
      envioUYU = subtotalUYU * 0.15;
    } else if (tipoEnvio === "express") {
      envioUYU = subtotalUYU * 0.07;
    } else {
      envioUYU = subtotalUYU * 0.05;
    }

    updateSummary(totalItems, subtotalUYU, envioUYU);
  }

  // Api para departamentos y localidades

  // Elementos del formulario
  const departamentoSelect = document.getElementById("departamento");
  const localidadSelect = document.getElementById("localidad");

  // Cargar JSON local
  fetch("js/departamentos.json")
    .then(res => res.json())
    .then(data => {

      // Cargar departamentos en el <select>
      data.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep.name;
        option.textContent = dep.name;
        departamentoSelect.appendChild(option);
      });

      // Cuando cambia un departamento → cargar sus localidades
      departamentoSelect.addEventListener("change", () => {
        const seleccionado = departamentoSelect.value;

        const depObj = data.find(d => d.name === seleccionado);

        localidadSelect.innerHTML = "<option value=''>Seleccione localidad...</option>";

        // Si existe, cargar sus localidades
        if (depObj) {
          depObj.towns.forEach(loc => {
            const opt = document.createElement("option");
            opt.value = loc.name;
            opt.textContent = loc.name;
            localidadSelect.appendChild(opt);
          });
        }
      });

    })
    .catch(err => {
      console.error("Error cargando JSON:", err);
      departamentoSelect.innerHTML = "<option>Error al cargar...</option>";
    });

  // --- LÓGICA PARA GUARDAR DATOS DE MODALES ---

  // 1. Guardar Dirección y Mostrarla en el Resumen
  const guardarDirBtn = document.getElementById("guardarDir-btn");
  const editarDireccionBtn = document.getElementById("editarDireccionBtn");

  if (guardarDirBtn) {
    guardarDirBtn.addEventListener("click", (e) => {
      e.preventDefault();

      
      const direccionModalElement = document.getElementById('formDireccion');
      const direccionModal = bootstrap.Modal.getInstance(direccionModalElement);
      if (direccionModal) {
        direccionModal.hide();
      }

      
      actualizarTextoDireccion();
    });
  }

  function actualizarTextoDireccion() {
    const nombre = document.getElementById('nombre').value.trim();
    const departamento = document.getElementById('departamento').value;
    const localidad = document.getElementById('localidad').value;
    const calle = document.getElementById('calle').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const esquina = document.getElementById('esquina').value.trim();

    const direccionTextoElement = editarDireccionBtn.previousElementSibling.querySelector('span');

    if (departamento && localidad && calle && numero) {
      let texto = `${nombre}, ${departamento}, ${localidad}, ${calle}, N° ${numero}`;
      if (esquina) {
        texto += `, Esq. ${esquina}`;
      }
      direccionTextoElement.textContent = texto;
      direccionTextoElement.style.color = 'black';
    } else {
      direccionTextoElement.textContent = 'Nombre, Departamento, Localidad, Calle, Número, Esquina';
      direccionTextoElement.style.color = 'gray';
    }
  }

  // 2. Guardar Pago con Tarjeta
  const guardarTarjetaBtn = document.getElementById("guardarTarjeta-btn");
  if (guardarTarjetaBtn) {
    guardarTarjetaBtn.addEventListener("click", (e) => {
      e.preventDefault();

      
      const numTarjeta = document.getElementById('numeroTarjeta').value.trim();
      const cvvTarjeta = document.getElementById('cvvTarjeta').value.trim();

      if (numTarjeta !== "" && cvvTarjeta !== "") {
        const modalTarjetaElement = document.getElementById('modalTarjeta');
        const modalTarjeta = bootstrap.Modal.getInstance(modalTarjetaElement);
        if (modalTarjeta) {
          modalTarjeta.hide();
        }
      }
      
    });
  }

  // 3. Guardar Pago con Transferencia
  const guardarTransferenciaBtn = document.getElementById("guardarTransferencia-btn");
  if (guardarTransferenciaBtn) {
    guardarTransferenciaBtn.addEventListener("click", (e) => {
      e.preventDefault();

      
      const numCuenta = document.getElementById('numeroCuenta').value.trim();

      if (numCuenta !== "") {
        const modalTransferenciaElement = document.getElementById('modalTransferencia');
        const modalTransferencia = bootstrap.Modal.getInstance(modalTransferenciaElement);
        if (modalTransferencia) {
          modalTransferencia.hide();
        }
      }
    });
  }

  // --- FUNCIONES DE VALIDACIÓN (PAUTA 4) ---

  // Función principal que verifica todos los requisitos
  function validarCompra() {
    let esValido = true;

    
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    // 1. Validar campos de Dirección 
    if (!validarDireccion()) {
      esValido = false;
    }

    
    

    // 3. Validar que la cantidad para cada producto sea > 0
    if (!validarCantidadProductos()) {
      alert("La cantidad para cada producto en el carrito debe ser mayor a 0.");
      esValido = false;
    }

    // 4. Validar Forma de Pago y sus campos asociados
    if (!validarFormaPago()) {
      alert("Debe seleccionar una forma de pago y completar sus campos requeridos.");
      esValido = false;
    }

    return esValido;
  }

  // A. Validar campos de Dirección
  function validarDireccion() {
    let valido = true;
    
    const camposObligatorios = [
      'departamento', 'localidad', 'calle', 'numero', 'nombre' 
    ];

    camposObligatorios.forEach(id => {
      const campo = document.getElementById(id);

      
      if (campo && campo.value.trim() === "") {
        campo.classList.add('is-invalid');
        valido = false;
      } else if (campo) {
        campo.classList.remove('is-invalid');
      }
    });

    // Si la dirección no es válida, abre el modal para que el usuario complete.
    if (!valido) {
      const direccionModal = new bootstrap.Modal(document.getElementById('formDireccion'));
      direccionModal.show();
    }

    return valido;
  }

  // B. Validar que la cantidad de productos sea > 0 y que haya al menos uno seleccionado
  function validarCantidadProductos() {
    
    if (cartProducts.length === 0) {
      return false;
    }

    
    const productosSeleccionados = cartProducts.filter(p => p.selected !== false);
    if (productosSeleccionados.length === 0) {
      return false;
    }

    
    const cantidadesValidas = productosSeleccionados.every(product => (product.quantity || 1) > 0);

    return cantidadesValidas;
  }

  // C. Validar forma de pago y sus campos asociados
  function validarFormaPago() {
    const radioCredito = document.getElementById('credito');
    const radioTransferencia = document.getElementById('transferencia');

    let pagoSeleccionado = false;
    let camposPagoValidos = true;

    // 1. Validar Tarjeta de Crédito 
    if (radioCredito && radioCredito.checked) {
      pagoSeleccionado = true;
      const numTarjeta = document.getElementById('numeroTarjeta');
      const cvvTarjeta = document.getElementById('cvvTarjeta');

      if (!numTarjeta || numTarjeta.value.trim() === "") {
        camposPagoValidos = false;
        numTarjeta.classList.add('is-invalid');
      } else {
        numTarjeta.classList.remove('is-invalid');
      }

      if (!cvvTarjeta || cvvTarjeta.value.trim() === "") {
        camposPagoValidos = false;
        cvvTarjeta.classList.add('is-invalid');
      } else {
        cvvTarjeta.classList.remove('is-invalid');
      }

      
      if (!camposPagoValidos) {
        const modalTarjeta = new bootstrap.Modal(document.getElementById('modalTarjeta'));
        modalTarjeta.show();
      }

    } else {
      
      const numTarjeta = document.getElementById('numeroTarjeta');
      const cvvTarjeta = document.getElementById('cvvTarjeta');
      if (numTarjeta) numTarjeta.classList.remove('is-invalid');
      if (cvvTarjeta) cvvTarjeta.classList.remove('is-invalid');
    }

    // 2. Validar Transferencia Bancaria 
    if (radioTransferencia && radioTransferencia.checked) {
      pagoSeleccionado = true;
      const numCuenta = document.getElementById('numeroCuenta');

      if (!numCuenta || numCuenta.value.trim() === "") {
        camposPagoValidos = false;
        numCuenta.classList.add('is-invalid');
        
        const modalTransferencia = new bootstrap.Modal(document.getElementById('modalTransferencia'));
        modalTransferencia.show();
      } else {
        numCuenta.classList.remove('is-invalid');
      }

    } else {
      
      const numCuenta = document.getElementById('numeroCuenta');
      if (numCuenta) numCuenta.classList.remove('is-invalid');
    }

    
    return pagoSeleccionado && camposPagoValidos;
  }

  // D. Feedback de compra exitosa
function mostrarFeedbackExitoso() {
    
    alert("¡Compra exitosa! Su pedido ha sido procesado correctamente.");

    
    if (summaryBtn) {
        summaryBtn.disabled = true;
        summaryBtn.textContent = 'Compra Finalizada';
    }

    
}
});
