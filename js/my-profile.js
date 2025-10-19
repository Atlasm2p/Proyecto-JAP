document.addEventListener('DOMContentLoaded', () => {
    
    const PROFILE_DATA_KEY = 'userProfileData';
    const USER_EMAIL_KEY = 'userEmail'; 
    const DEFAULT_EMAIL = 'ejemplo@correo.com'; 
    
    const editableFields = [
        { key: 'email', valueElementId: 'profile-email', inputElementId: 'input-email' },
        { key: 'name', valueElementId: 'profile-name', inputElementId: 'input-name' },
        { key: 'phone', valueElementId: 'profile-phone', inputElementId: 'input-phone' },
        { key: 'email-footer', valueElementId: 'profile-email-footer', inputElementId: 'input-email-footer' }
    ];

    /** * 1. Precarga y carga inicial de datos. * - Inicializa los campos vacíos, excepto el email de sesión.*/
    function loadProfileData() {
        let savedData = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY)) || {};
        let emailFromLocalStorage = localStorage.getItem(USER_EMAIL_KEY) || DEFAULT_EMAIL;

        // **LÓGICA PARA INICIALIZAR LA PRIMERA VEZ (Registro en Mi Perfil)**
        if (Object.keys(savedData).length === 0) {
            // La primera vez, solo el "Usuario" y el "Correo" se inicializan con el email de sesión.
            // Los demás quedan explícitamente vacíos.
            savedData.email = emailFromLocalStorage; 
            savedData.name = '';
            savedData.phone = '';
            savedData['email-footer'] = emailFromLocalStorage; 
            
            saveProfileData(savedData);
        }

        // Rellenar todos los campos con los datos cargados
        editableFields.forEach(field => {
            const valueElement = document.getElementById(field.valueElementId);
            const dataValue = savedData[field.key] || ''; // Usar cadena vacía si el valor es null/undefined
            const inputElement = document.getElementById(field.inputElementId);

            if (valueElement) {
                // Si el valor está vacío, muestra un placeholder como en la imagen
                valueElement.textContent = dataValue || "No ingresado"; 
                // Si existe el input, precargar su valor
                if (inputElement) {
                    inputElement.value = dataValue;
                }
            }
        });
    }

    /**
     * 2. Guarda el objeto de datos completo en localStorage.
     */
    function saveProfileData(data) {
        localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));
    }

    /**
     * 3. Manejo de la Edición (Mostrar/Ocultar inputs).
     */
    function toggleEdit(event) {
        const itemContainer = event.target.closest('.data-item');
        if (!itemContainer) return;

        const valueElement = itemContainer.querySelector('.data-value');
        const inputElement = itemContainer.querySelector('.data-input');
        const editButton = itemContainer.querySelector('.edit-btn');
        const saveButton = itemContainer.querySelector('.save-btn');

        if (!valueElement || !inputElement || !editButton || !saveButton) return;

        const isEditing = valueElement.classList.contains('hidden');

        if (!isEditing) {
            // Entrar en modo edición
            valueElement.classList.add('hidden');
            inputElement.classList.remove('hidden');
            editButton.classList.add('hidden');
            saveButton.classList.remove('hidden');
            inputElement.focus();
        } else {
            // Salir de modo edición
            valueElement.classList.remove('hidden');
            inputElement.classList.add('hidden');
            editButton.classList.remove('hidden');
            saveButton.classList.add('hidden');
        }
    }

    /**
     * 4. Manejo del Guardado de Datos.
     */
    function handleSave(event) {
        const itemContainer = event.target.closest('.data-item');
        const fieldKey = itemContainer.dataset.field;
        const inputElement = itemContainer.querySelector('.data-input');
        
        if (!itemContainer || !fieldKey || !inputElement) return;

        const newValue = inputElement.value.trim();

        // 4.1 Actualizar el valor mostrado en el DOM (incluyendo placeholder si está vacío)
        const valueElement = itemContainer.querySelector('.data-value');
        if (valueElement) {
            valueElement.textContent = newValue || "No ingresado";
        }

        // 4.2 Guardar el nuevo valor en localStorage
        const savedData = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY)) || {};
        savedData[fieldKey] = newValue;
        saveProfileData(savedData);

        // 4.3 Salir del modo edición
        toggleEdit(event);
    }
    // ... (Lógica de Foto de Perfil y Listeners de menú se mantienen similares) ...
    
    // ----------------------------------------------------
    /**
     * Lógica para la Foto de Perfil (Visualización temporal)
     */
    const profilePicPlaceholder = document.getElementById('profile-picture');
    const imageInput = document.getElementById('profile-image-input');
    const editPhotoBtn = document.getElementById('edit-photo-btn');

    // Simular el clic en el input de archivo al hacer clic en el botón de la cámara
    if (editPhotoBtn && imageInput) {
        editPhotoBtn.addEventListener('click', () => {
            imageInput.click();
        });
    }

    // Manejar el cambio de imagen y mostrarla
    if (imageInput && profilePicPlaceholder) {
        imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const imageUrl = e.target.result;
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    // Limpia el contenido anterior y muestra la imagen
                    profilePicPlaceholder.innerHTML = ''; 
                    profilePicPlaceholder.appendChild(img);

                    // No se guarda en localStorage
                };

                // Lee el archivo como una URL de datos (Base64)
                reader.readAsDataURL(file);
            }
        });
    }
    // ----------------------------------------------------
    
    // Inicializar la carga de datos al cargar la página
    loadProfileData();

    // 5. Añadir Listeners a los botones de Editar y Guardar
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', toggleEdit);
    });

    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', handleSave);
    });

    // 6. Listener para el menú desplegable (Ahora apunta a 'dropdown-menu')
    const menuToggle = document.getElementById('menu-toggle');
    const userDropdown = document.getElementById('dropdown-menu'); 
    
    if (menuToggle && userDropdown) {
        menuToggle.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que el enlace # recargue la página
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (event) => {
            // Cierra el menú si se hace clic fuera de él o del botón
            if (!userDropdown.contains(event.target) && !menuToggle.contains(event.target)) {
                userDropdown.style.display = 'none';
            }
        });
    }

});