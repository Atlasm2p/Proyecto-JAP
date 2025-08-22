document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "index.html";
  
    if (usuario === "" || password === "") {
      alert("Por favor, complete todos los campos.");
      return;
    }
    else {
      window.location.replace(redirect);
      sessionStorage.setItem("loggedIn", "true");
    }
}); 