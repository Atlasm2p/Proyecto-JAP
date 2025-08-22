document.addEventListener("DOMContentLoaded", function() {
  if (sessionStorage.getItem("loggedIn") === "true") {
    document.getElementById("login-button").style.display = "none";
  }
  else {
    window.location.href = "login.html"
  }
}); // Redirecciona al usuario a url/login.html?redirect=(y la pagina en la que esten), para poder redireccionarse propiamente