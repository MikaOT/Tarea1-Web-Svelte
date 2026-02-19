import { API_URL } from './config.js';
import { getAuthHeaders } from './utils.js';

export async function loadUsers() {
  const headers = getAuthHeaders();
  if(!headers.Authorization) return;

  const res = await fetch(`${API_URL}/users`, { headers });

  if (!res.ok) return;

  const users = await res.json();
  const list = document.getElementById("usersList");
  if(list) list.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    
    li.innerHTML = `<span>${u.username} (${u.role})</span>`;

    const actionsDiv = document.createElement("div");
    actionsDiv.style.display = "flex";
    actionsDiv.style.gap = "0.5rem";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.className = "btn-edit";
    editBtn.onclick = () => editUser(u);
    actionsDiv.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Borrar";
    delBtn.className = "btn-delete";
    delBtn.onclick = () => deleteUser(u._id);
    actionsDiv.appendChild(delBtn);

    li.appendChild(actionsDiv);
    if(list) list.appendChild(li);
  });
}

export async function editUser(user) {
  const newUsername = prompt("Nuevo nombre de usuario:", user.username);
  const newRole = prompt("Nuevo rol (user/admin):", user.role);
  const newPassword = prompt("Nueva contraseña (dejar en blanco para no cambiar):");
  const headers = getAuthHeaders();

  if (newUsername && newRole) {
    const body = { username: newUsername, role: newRole };
    if (newPassword) body.password = newPassword;

    const res = await fetch(`${API_URL}/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers
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

export async function deleteUser(id) {
  if (!confirm("¿Seguro que quieres borrar este usuario?")) return;
  const headers = getAuthHeaders();
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers
  });

  if (res.ok) {
    loadUsers();
  } else {
    alert("Error al borrar usuario");
  }
}

export function initUsers() {
    const createBtn = document.getElementById("createUserBtn");
    if(createBtn) {
        createBtn.addEventListener("click", async () => {
          const username = document.getElementById("newUsername").value;
          const password = document.getElementById("newPassword").value;
          const role = document.getElementById("newRole").value;
          const headers = getAuthHeaders();

          const res = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...headers
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
    }
}
