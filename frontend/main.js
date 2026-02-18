const API_URL = "http://localhost:3000/api";
let userRole = null; // Para saber si es admin o no


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(() => console.log('Service Worker registrado con éxito'))
      .catch(err => console.error('Error al registrar Service Worker:', err));
  });
}

// ----------------- NAVIGATION -----------------
function showView(viewName) {
  // Hide all views
  document.getElementById("productsView").style.display = "none";
  document.getElementById("usersSection").style.display = "none";
  
  // Reset nav active states
  document.getElementById("navProducts").classList.remove("active");
  document.getElementById("navUsers").classList.remove("active");

  // Show selected view
  if (viewName === 'products') {
    document.getElementById("productsView").style.display = "flex"; // Flex for layout
    document.getElementById("navProducts").classList.add("active");
    loadProductos();
    loadCart();
  } else if (viewName === 'users') {
    document.getElementById("usersSection").style.display = "block";
    document.getElementById("navUsers").classList.add("active");
    loadUsers();
  }
}

document.getElementById("navProducts").addEventListener("click", () => showView('products'));
document.getElementById("navUsers").addEventListener("click", () => showView('users'));

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem('token');
  userRole = null;
  location.reload(); // Simple way to reset state
});

// Check for existing session on load
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
      
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("mainNav").style.display = "flex"; // Show navbar

      if (userRole === 'admin') {
        document.getElementById("navUsers").style.display = "block";
      } else {
        document.getElementById("navUsers").style.display = "none";
      }
      
      showView('products'); // Default view
    } catch (e) {
      console.error("Invalid token", e);
      localStorage.removeItem('token');
    }
  }
});
 
// ----------------- LOGIN -----------------
document.getElementById("loginBtn").addEventListener("click", async () => {
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
 
  // Decodificar el token para obtener el rol y el nombre de usuario
  const payload = JSON.parse(atob(data.token.split('.')[1]));
  userRole = payload.role;
 
  alert(`Bienvenido ${payload.username} (${payload.role})`);
 
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("mainNav").style.display = "flex";

  if (userRole === 'admin') {
    document.getElementById("navUsers").style.display = "block";
  } else {
    document.getElementById("navUsers").style.display = "none";
  }

  showView('products');
});
 
// ----------------- REGISTRO -----------------
document.getElementById("registerBtn").addEventListener("click", async () => {
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
 
// ----------------- PRODUCTOS -----------------
document.getElementById("addProductoBtn").addEventListener("click", async () => {
  const nombre = document.getElementById("prodNombre").value;
  const precio = document.getElementById("prodPrecio").value;
  const imagenInput = document.getElementById("prodImagen");
  const token = localStorage.getItem('token');
 
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("precio", precio);
  if (imagenInput.files[0]) {
    formData.append("imagen", imagenInput.files[0]);
  }

  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });
 
  if (!res.ok) {
    alert("Error al añadir producto");
    return;
  }
 
  document.getElementById("prodNombre").value = "";
  document.getElementById("prodPrecio").value = "";
  document.getElementById("prodImagen").value = "";
  loadProductos(document.getElementById("searchName").value);
});

async function addToCart(productId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId })
  });

  if (!res.ok) {
    alert('Error al añadir al carrito');
    return;
  }

  loadCart(); // Recargamos el carrito para ver los cambios
}

async function loadCart() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) return;

  const cartItems = await res.json();
  const cartList = document.getElementById('cartList');
  const cartTotalEl = document.getElementById('cartTotal');
  cartList.innerHTML = '';
  let total = 0;

  cartItems.forEach(item => {
    if (!item.productId) return; // Evita errores si un producto fue eliminado
    const li = document.createElement('li');
    const itemTotal = item.quantity * item.productId.precio;
    li.textContent = `${item.productId.nombre} - Cantidad: ${item.quantity} - Subtotal: ${itemTotal.toFixed(2)}€ `;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = "X";
    removeBtn.className = "btn-delete";
    removeBtn.style.padding = "0.25rem 0.5rem";
    removeBtn.style.marginLeft = "1rem";
    removeBtn.onclick = () => removeFromCart(item.productId._id);
    
    li.appendChild(removeBtn);
    cartList.appendChild(li);
    total += itemTotal;
  });

  cartTotalEl.textContent = total.toFixed(2);
}

async function removeFromCart(productId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    alert('Error al eliminar del carrito');
    return;
  }

  loadCart();
}
 
// ----------------- BUSCADOR -----------------
document.getElementById("searchName").addEventListener("input", (e) => {
  loadProductos(e.target.value);
});

async function loadProductos(searchTerm = "") {
  const token = localStorage.getItem('token');
  if (!token) {
    // Opcional: redirigir a login si no hay token
    return;
  }
 
  let url = `${API_URL}/productos`;
  if (searchTerm) {
    url += `?name=${encodeURIComponent(searchTerm)}`;
  }

  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
 
  if (!res.ok) {
    alert("No autorizado");
    return;
  }
 
  const productos = await res.json();
  const list = document.getElementById("productosList");
  list.innerHTML = "";
  productos.forEach(p => {
    const li = document.createElement("li");
    
    // Contenedor de información (Imagen + Texto)
    const infoDiv = document.createElement("div");
    infoDiv.className = "product-info";
    
    let imgHtml = "";
    if (p.imagen) {
      imgHtml = `<img src="http://localhost:3000/uploads/${p.imagen}" alt="${p.nombre}" class="product-img">`;
    }
    
    infoDiv.innerHTML = `${imgHtml} <span class="product-details">${p.nombre} - ${p.precio}€</span>`;
    li.appendChild(infoDiv);

    // Contenedor de acciones (Botones)
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "product-actions";

    // Botón añadir al carrito (para todos los usuarios logueados)
    const addCartBtn = document.createElement("button");
    addCartBtn.className = "btn-add-cart";
    addCartBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      Añadir al carrito
    `;
    addCartBtn.onclick = () => addToCart(p._id);
    actionsDiv.appendChild(addCartBtn);

    if (userRole === "admin") {
      // Botón editar
      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.className = "btn-edit";
      editBtn.onclick = () => {
        const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
        const nuevoPrecio = prompt("Nuevo precio:", p.precio);
        if (nuevoNombre && nuevoPrecio) {
          fetch(`${API_URL}/productos/${p._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre: nuevoNombre, precio: nuevoPrecio })
          }).then(() => loadProductos(document.getElementById("searchName").value));
        }
      };
      actionsDiv.appendChild(editBtn);

      // Botón borrar
      const delBtn = document.createElement("button");
      delBtn.textContent = "Borrar";
      delBtn.className = "btn-delete";
      delBtn.onclick = async () => {
        await fetch(`${API_URL}/productos/${p._id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        loadProductos(document.getElementById("searchName").value);
      };
      actionsDiv.appendChild(delBtn);
    }
    
    li.appendChild(actionsDiv);
    list.appendChild(li);
  });
 
  // Mostrar acciones admin
  if (userRole === "admin") {
    document.getElementById("adminActions").style.display = "block";
  }
}
 
// ----------------- CAMBIO DE FORMULARIOS -----------------
document.getElementById("showRegisterLink").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
});

document.getElementById("showLoginLink").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

// ----------------- FILE INPUT -----------------
const fileInput = document.getElementById('prodImagen');
if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const fileName = e.target.files[0] ? e.target.files[0].name : "Ningún archivo seleccionado";
    document.getElementById('fileName').textContent = fileName;
  });
}

// ----------------- GESTIÓN DE USUARIOS (ADMIN) -----------------
async function loadUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) return;

  const users = await res.json();
  const list = document.getElementById("usersList");
  list.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    
    li.innerHTML = `<span>${u.username} (${u.role})</span>`;

    const actionsDiv = document.createElement("div");
    actionsDiv.style.display = "flex";
    actionsDiv.style.gap = "0.5rem";

    // Botón Editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.className = "btn-edit";
    editBtn.onclick = () => editUser(u);
    actionsDiv.appendChild(editBtn);

    // Botón Borrar
    const delBtn = document.createElement("button");
    delBtn.textContent = "Borrar";
    delBtn.className = "btn-delete";
    delBtn.onclick = () => deleteUser(u._id);
    actionsDiv.appendChild(delBtn);

    li.appendChild(actionsDiv);
    list.appendChild(li);
  });
}

document.getElementById("createUserBtn").addEventListener("click", async () => {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  const role = document.getElementById("newRole").value;
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ username, password, role })
  });

  if (res.ok) {
    alert("Usuario creado");
    document.getElementById("newUsername").value = "";
    document.getElementById("newPassword").value = "";
    loadUsers();
  } else {
    const err = await res.json();
    alert("Error: " + err.message);
  }
});

async function editUser(user) {
  const newUsername = prompt("Nuevo nombre de usuario:", user.username);
  const newRole = prompt("Nuevo rol (user/admin):", user.role);
  const newPassword = prompt("Nueva contraseña (dejar en blanco para no cambiar):");
  const token = localStorage.getItem('token');

  if (newUsername && newRole) {
    const body = { username: newUsername, role: newRole };
    if (newPassword) body.password = newPassword;

    const res = await fetch(`${API_URL}/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      loadUsers();
    } else {
      alert("Error al editar usuario");
    }
  }
}

async function deleteUser(id) {
  if (!confirm("¿Seguro que quieres borrar este usuario?")) return;
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (res.ok) {
    loadUsers();
  } else {
    alert("Error al borrar usuario");
  }
}
