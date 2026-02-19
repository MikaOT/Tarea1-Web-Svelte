import { API_URL } from './config.js';
import { getAuthHeaders } from './utils.js';
import { getUserRole } from './state.js';
import { addToCart } from './cart.js';

export async function loadProductos(searchTerm = "") {
  const headers = getAuthHeaders();
  if (!headers.Authorization) {
    // Optionally redirect or handle no token
    return;
  }
 
  let url = `${API_URL}/productos`;
  if (searchTerm) {
    url += `?name=${encodeURIComponent(searchTerm)}`;
  }

  const res = await fetch(url, { headers });
 
  if (!res.ok) {
    alert("No autorizado");
    return; 
  }
 
  const productos = await res.json();
  const list = document.getElementById("productosList");
  if(list) list.innerHTML = "";
  
  const userRole = getUserRole();

  productos.forEach(p => {
    const li = document.createElement("li");
    
    // Info container
    const infoDiv = document.createElement("div");
    infoDiv.className = "product-info";
    
    let imgHtml = "";
    if (p.imagen) {
      imgHtml = `<img src="http://localhost:3000/uploads/${p.imagen}" alt="${p.nombre}" class="product-img">`;
    }
    
    infoDiv.innerHTML = `${imgHtml} <span class="product-details">${p.nombre} - ${p.precio}€</span>`;
    li.appendChild(infoDiv);

    // Actions container
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "product-actions";

    // Add to cart button
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
      // Edit button
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
              ...headers
            },
            body: JSON.stringify({ nombre: nuevoNombre, precio: nuevoPrecio })
          }).then(() => loadProductos(document.getElementById("searchName").value));
        }
      };
      actionsDiv.appendChild(editBtn);

      // Delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "Borrar";
      delBtn.className = "btn-delete";
      delBtn.onclick = async () => {
        if(!confirm("¿Borrar producto?")) return;
        await fetch(`${API_URL}/productos/${p._id}`, {
          method: "DELETE",
          headers
        });
        loadProductos(document.getElementById("searchName").value);
      };
      actionsDiv.appendChild(delBtn);
    }
    
    li.appendChild(actionsDiv);
    if(list) list.appendChild(li);
  });
 
  if (userRole === "admin") {
    const adminActions = document.getElementById("adminActions");
    if(adminActions) adminActions.style.display = "block";
  }
}

export function initProducts() {
    const addBtn = document.getElementById("addProductoBtn");
    if(addBtn) {
        addBtn.addEventListener("click", async () => {
          const nombre = document.getElementById("prodNombre").value;
          const precio = document.getElementById("prodPrecio").value;
          const imagenInput = document.getElementById("prodImagen");
          const headers = getAuthHeaders(); // Only Authorization
          
          if(!headers.Authorization) return;
         
          const formData = new FormData();
          formData.append("nombre", nombre);
          formData.append("precio", precio);
          if (imagenInput.files[0]) {
            formData.append("imagen", imagenInput.files[0]);
          }

          const res = await fetch(`${API_URL}/productos`, {
            method: "POST",
            headers: {
              "Authorization": headers.Authorization 
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
          document.getElementById("fileName").textContent = "Ningún archivo seleccionado";
          loadProductos(document.getElementById("searchName").value);
        });
    }

    const searchInput = document.getElementById("searchName");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          loadProductos(e.target.value);
        });
    }
}
