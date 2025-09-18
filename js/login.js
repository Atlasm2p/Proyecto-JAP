document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const redirect = "index.html";
  
    if (usuario === "" || password === "") {
      alert("Por favor, complete todos los campos.");
      return;
    }
    else {
      window.location.replace(redirect);
      sessionStorage.setItem("usuario", usuario);
      sessionStorage.setItem("loggedIn", "true");
      
    }
}); 
