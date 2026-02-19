import { API_URL } from './config.js';
import { setUserRole } from './state.js';
import { showView } from './navigation.js';

export function initAuth() {
    // Login
    const loginBtn = document.getElementById("loginBtn");
    if(loginBtn) {
        loginBtn.addEventListener("click", async () => {
          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;

          const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
         
          if (!res.ok) {
            alert("Login incorrecto");
            return;
          }
         
          const data = await res.json();
          localStorage.setItem('token', data.token); // Guardamos el token
         
          // Decodificar el token para obtener el rol
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          const userRole = payload.role;
          setUserRole(userRole);
         
          alert(`Bienvenido ${payload.username} (${payload.role})`);
         
          initSessionUI(userRole);
          showView('products');
        });
    }

    // Register
    const regBtn = document.getElementById("registerBtn");
    if(regBtn) {
        regBtn.addEventListener("click", async () => {
          const username = document.getElementById("regUsername").value;
          const password = document.getElementById("regPassword").value;

          const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
         
          if (!res.ok) {
            const error = await res.json();
            alert("Error en registro: " + error.message);
            return;
          }

          alert("Usuario registrado con éxito. Ahora puedes hacer login.");
          document.getElementById("registerForm").style.display = "none";
          document.getElementById("loginForm").style.display = "block";
        });
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem('token');
          setUserRole(null);
          location.reload(); 
        });
    }
}

export function checkSession() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;
      setUserRole(userRole);
      
      initSessionUI(userRole);
      showView('products'); 
    } catch (e) {
      console.error("Invalid token", e);
      localStorage.removeItem('token');
    }
  }
}

function initSessionUI(userRole) {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("mainNav").style.display = "flex"; 

    if (userRole === 'admin') {
        document.getElementById("navUsers").style.display = "block";
    } else {
        document.getElementById("navUsers").style.display = "none";
    }
}
