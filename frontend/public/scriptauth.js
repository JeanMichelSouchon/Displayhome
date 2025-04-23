const { default: api } = require("./api");

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const signupForm = document.querySelector("#signup-form");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const email = document.querySelector("#login-email").value;
        const password = document.querySelector("#login-password").value;
  
        try {
          const response = await api.post('/auth/signup',JSON.stringify({ username, email}));
  
          const result = await response.json();
  
          if (response.ok) {
            displayMessage('login-message',"Connexion réussie !",'success');
            localStorage.setItem('token', response.token);
            window.location.href = 'home.html';
          } else {
            displayMessage('login-message',result.message || "Erreur de connexion.",'error');
          }
        } catch (error) {
          console.error("Erreur lors de la connexion :", error);
          displayMessage('login-message',"Impossible de se connecter au serveur.",'error');
        }
      });
    }
  
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const username = document.querySelector("#signup-username").value;
        const email = document.querySelector("#signup-email").value;
        const password = document.querySelector("#signup-password").value;
  
        try {
          
          const response = await api.post('/auth/signup',JSON.stringify({ username, email, password }));
  
          const result = await response.json();
  
          if (response.ok) {
            displayMessage('signup-message',"Inscription réussie !", 'success');
          } else {
            displayMessage('signup-message',result.message || "Erreur d'inscription.",'error');
          }
        } catch (error) {
          console.error("Erreur lors de l'inscription :", error);
          displayMessage('signup-message',"Impossible de se connecter au serveur.",'error');
        }
      });
    }
  });

  function displayMessage(elementId, message, type = "success") {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.style.color = type === "error" ? "red" : "limegreen";
}
