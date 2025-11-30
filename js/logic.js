document.addEventListener("DOMContentLoaded", function() {
    
    const USER_EMAIL_KEY = 'userEmail';
    const PROFILE_DATA_KEY = 'userProfileData';
    
    
    if (sessionStorage.getItem("loggedIn") === "true") {
        if (document.getElementById("login-button")) {
        document.getElementById("login-button").style.display = "none";
        }
        
        const storedNombre = sessionStorage.getItem('usuario');
        const userEmail = storedNombre || sessionStorage.getItem('usuarioEmail') || '';
        localStorage.setItem(USER_EMAIL_KEY, userEmail);
        const profileData = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY));
        let nameForWelcome = storedNombre || (userEmail.includes('@') ? userEmail.split('@')[0] : userEmail);
        if (profileData && profileData.name) {
            nameForWelcome = profileData.name;
        }
        document.querySelector('.nav-icons').insertAdjacentHTML('afterBegin',
            `<span id="welcome-user-name">Bienvenido, ${nameForWelcome}</span>`
        );

    } else {
        
        window.location.href = "login.html"
    }
    badge();
}); 

function badge(){
    const cartItems = JSON.parse(localStorage.getItem('cartProducts')) || [];
    const cartIcon = document.getElementById('cart-icon');
    if (!cartIcon) return;

    // make sure the icon can be a positioning context
    if (getComputedStyle(cartIcon).position === 'static') {
        cartIcon.style.position = 'relative';
    }

    // remove any existing badge
    const old = document.getElementById('cart-badge');
    if (old) old.remove();

    // total quantity
    const total = cartItems.reduce((sum, it) => sum + (parseInt(it.quantity, 10) || 0), 0);
    if (total <= 0) return;

    const badge = document.createElement('span');
    badge.id = 'cart-badge';
    badge.textContent = total > 99 ? '99+' : String(total);
    badge.setAttribute('aria-label', `${total} items in cart`);

    // style the badge as a small red circle on top-right of the bag
    Object.assign(badge.style, {
        position: 'absolute',
        top: '0',
        right: '0',
        transform: 'translate(50%,-50%)',
        background: '#e53935',
        color: '#fff',
        minWidth: '20px',
        height: '20px',
        padding: '0 6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '999px',
        fontSize: '12px',
        lineHeight: '1',
        fontWeight: '600',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        zIndex: '50',
        pointerEvents: 'none'
    });

    cartIcon.appendChild(badge);
    console.log('cart badge:', badge);
}

// Function to update the cart badge when the quantity changes
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartProducts')) || [];
    const total = cartItems.reduce((sum, it) => sum + (parseInt(it.quantity, 10) || 0), 0);
    const badgeEl = document.getElementById('cart-badge');

    if (badgeEl) {
        badgeEl.textContent = total > 99 ? '99+' : String(total);
        badgeEl.setAttribute('aria-label', `${total} items in cart`);
    } else if (total > 0) {
        // call the badge-creation function when there's no badge yet and there's at least 1 item
        badge();
    }
}
