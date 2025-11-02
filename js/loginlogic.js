document.addEventListener("DOMContentLoaded", function() {
    
    const USER_EMAIL_KEY = 'userEmail';
    const PROFILE_DATA_KEY = 'userProfileData';
    
    
    if (sessionStorage.getItem("loggedIn") === "true") {
        document.getElementById("login-button").style.display = "none";
        
        
        const userEmail = sessionStorage.getItem("usuario"); 

        
        localStorage.setItem(USER_EMAIL_KEY, userEmail);

        
        const profileData = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY));

        let nameForWelcome = userEmail.split('@')[0]; 

        if (profileData && profileData.name) {
            
            nameForWelcome = profileData.name;
        } 
        

        
        document.querySelector(".nav-icons").insertAdjacentHTML("afterBegin", 
            `<span id="welcome-user-name">Bienvenido, ${nameForWelcome}</span>`
        );

    } else {
        
        window.location.href = "login.html"
    }
}); 

