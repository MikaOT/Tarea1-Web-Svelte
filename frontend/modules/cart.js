import { API_URL } from './config.js';
import { getAuthHeaders } from './utils.js';

export async function loadCart() {
  const headers = getAuthHeaders();
  if (!headers.Authorization) return;
  const res = await fetch(`${API_URL}/cart`, { headers });

  if (!res.ok) return;

  const cartItems = await res.json();
  const cartList = document.getElementById('cartList');
  const cartTotalEl = document.getElementById('cartTotal');
  if(cartList) cartList.innerHTML = '';
  let total = 0;

  cartItems.forEach(item => {
    if (!item.productId) return; 
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
    if(cartList) cartList.appendChild(li);
    total += itemTotal;
  });

  if(cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
}

export async function addToCart(productId) {
  const headers = getAuthHeaders();
  if (!headers.Authorization) return;
  const res = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({ productId })
  });
  if (!res.ok) {
    alert('Error al añadir al carrito');
    return;
  }
  loadCart();
}

export async function removeFromCart(productId) {
  const headers = getAuthHeaders();
  if (!headers.Authorization) {
      alert("No autorizado");
      return;
  }
  const res = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok) {
    alert('Error al eliminar del carrito');
    return;
  }
  loadCart();
}
