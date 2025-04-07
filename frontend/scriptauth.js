
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const signupForm = document.querySelector("#signup-form");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const email = document.querySelector("#login-email").value;
        const password = document.querySelector("#login-password").value;
  
        try {
          const response = await fetch("https://backend-service-387352143812.europe-west1.run.app/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert("Connexion réussie !");
            window.location.href = 'home.html';
          } else {
            alert(result.message || "Erreur de connexion.");
          }
        } catch (error) {
          console.error("Erreur lors de la connexion :", error);
          alert("Impossible de se connecter au serveur.");
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
          const response = await fetch("https://backend-service-387352143812.europe-west1.run.app/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert("Inscription réussie !");
          } else {
            alert(result.message || "Erreur d'inscription.");
          }
        } catch (error) {
          console.error("Erreur lors de l'inscription :", error);
          alert("Impossible de se connecter au serveur.");
        }
      });
    }
  });
  