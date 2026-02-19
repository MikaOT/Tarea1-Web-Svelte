import { loadProductos } from './products.js';
import { loadCart } from './cart.js';
import { loadUsers } from './users.js';

export function showView(viewName) {
  // Hide all views
  const productsView = document.getElementById("productsView");
  const usersSection = document.getElementById("usersSection");
  if(productsView) productsView.style.display = "none";
  if(usersSection) usersSection.style.display = "none";
  
  // Reset nav active states
  const navProducts = document.getElementById("navProducts");
  const navUsers = document.getElementById("navUsers");
  if(navProducts) navProducts.classList.remove("active");
  if(navUsers) navUsers.classList.remove("active");

  // Show selected view
  if (viewName === 'products') {
    if(productsView) productsView.style.display = "flex"; 
    if(navProducts) navProducts.classList.add("active");
    loadProductos();
    loadCart();
  } else if (viewName === 'users') {
    if(usersSection) usersSection.style.display = "block";
    if(navUsers) navUsers.classList.add("active");
    loadUsers();
  }
}

export function initNavigation() {
    const navProducts = document.getElementById("navProducts");
    const navUsers = document.getElementById("navUsers");
    
    if(navProducts) navProducts.addEventListener("click", () => showView('products'));
    if(navUsers) navUsers.addEventListener("click", () => showView('users'));
}
