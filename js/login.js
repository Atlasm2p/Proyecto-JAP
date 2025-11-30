const API_BASE = 'http://localhost:3000';

document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim(); // actualmente no se envía ni valida en backend
  const redirect = "index.html";

  if (usuario === "" || password === "") {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Intento de login/registro vía /auth/login
  // auth.js permite login con username OR email. Para asegurar creación si no existe, fabricamos email y nombre.
  const payload = {
    username: usuario,
    email: usuario + '@example.com',
    nombre: usuario
  };

  try {
    const res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Error de autenticación');
      return;
    }
    // Guardar datos del usuario
    const user = data.user;
    if (user && user.id) {
      sessionStorage.setItem('userId', String(user.id));
    }
    sessionStorage.setItem('usuario', user?.nombre || usuario);
    sessionStorage.setItem('loggedIn', 'true');
    window.location.replace(redirect);
  } catch (err) {
    console.error('Fallo en /auth/login:', err);
    alert('No se pudo conectar con el servidor de autenticación');
  }
});
