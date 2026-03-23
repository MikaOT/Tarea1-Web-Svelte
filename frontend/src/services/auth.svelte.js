// src/services/auth.svelte.js
import { jwtDecode } from 'jwt-decode'; // Necesitarás instalar esto: npm install jwt-decode

export const authState = $state({
    user: null,
    token: localStorage.getItem('token') || null,
    error: null
});

// Esta función se ejecuta al cargar para recuperar al usuario si hay un token
if (authState.token) {
    try {
        authState.user = jwtDecode(authState.token);
    } catch (e) {
        localStorage.removeItem('token');
        authState.token = null;
    }
}

export async function login(username, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authState.token = data.token;
            // Como el backend no manda el usuario, lo decodificamos del token
            authState.user = jwtDecode(data.token); 
            authState.error = null;
            localStorage.setItem('token', data.token);
        } else {
            // El backend manda { "error": "..." } según authController.js
            authState.error = data.error || 'Credenciales inválidas';
        }
    } catch (e) {
        authState.error = 'No se pudo conectar con el servidor';
    }
}

export function logout() {
    authState.token = null;
    authState.user = null;
    localStorage.removeItem('token');
}