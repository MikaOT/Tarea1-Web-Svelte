import { initAuth, checkSession } from './modules/auth.js';
import { initNavigation } from './modules/navigation.js';
import { initProducts } from './modules/products.js';
import { initUsers } from './modules/users.js';
import { initUI } from './modules/ui.js';

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(() => console.log('Service Worker registrado con éxito'))
      .catch(err => console.error('Error al registrar Service Worker:', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation(); 
    initProducts();
    initUsers();
    initUI();
    checkSession();
});
