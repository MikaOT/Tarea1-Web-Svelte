export function initUI() {
    // Toggle Login/Register forms
    const showRegisterLink = document.getElementById("showRegisterLink");
    const showLoginLink = document.getElementById("showLoginLink");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if(showRegisterLink) {
        showRegisterLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginForm.style.display = "none";
            registerForm.style.display = "block";
        });
    }

    if(showLoginLink) {
        showLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            registerForm.style.display = "none";
            loginForm.style.display = "block";
        });
    }

    // File Input
    const fileInput = document.getElementById('prodImagen');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const fileName = e.target.files[0] ? e.target.files[0].name : "Ningún archivo seleccionado";
        document.getElementById('fileName').textContent = fileName;
      });
    }
}
