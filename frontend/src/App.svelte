<script>
  import { Router, Route } from "svelte-routing";
  import { authState } from "./services/auth.svelte.js";
  import { navigate } from "svelte-routing";

  // Componentes Globales
  import Navbar from "./components/Navbar.svelte";
  import Toast from "./components/Toast.svelte"; // REQUISITO: UX Feedback

  // Páginas
  import Login from "./pages/Login.svelte";
  import Productos from "./pages/Productos.svelte";
  import Perfil from "./pages/Perfil.svelte";
  import AdminUsuarios from "./pages/AdminUsuarios.svelte";

  // Svelte 5 corrección: Uso de $props() en lugar de export let
  let { url = "" } = $props();

  // 🛡️ Guardia de seguridad: Reacciona a cambios en el token
  $effect(() => {
    if (!authState.token) {
      navigate("/", { replace: true });
    }
  });
</script>

<Router {url}>
  <Navbar />
  
  <Toast />

  <main>
    <Route path="/">
      {#if !authState.token}
        <Login />
      {:else}
        <div class="welcome-container">
          <h2>🌟 BIENVENIDO AL ARCHIVO CENTRAL</h2>
          <p>Sincronizado como: <span class="highlight">{authState.user?.username}</span></p>
          <p class="role-badge {authState.user?.role}">Nivel de Acceso: {authState.user?.role.toUpperCase()}</p>
        </div>
      {/if}
    </Route>

    <Route path="/productos"><Productos /></Route>
    <Route path="/perfil"><Perfil /></Route>
    <Route path="/admin"><AdminUsuarios /></Route>
  </main>
</Router>

<style>
  /* --- ESTILOS GLOBALES DE TEMÁTICA CYBER-PREMIUM --- */
  :global(body) {
    margin: 0;
    background-color: #000000; /* Negro Absoluto */
    color: #e0e0e0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  :global(*) { box-sizing: border-box; }

  /* Scrollbars sutiles */
  :global(::-webkit-scrollbar) { width: 8px; }
  :global(::-webkit-scrollbar-track) { background: #000; }
  :global(::-webkit-scrollbar-thumb) { background: #222; border-radius: 4px; }
  :global(::-webkit-scrollbar-thumb:hover) { background: #ff3e00; }

  main { max-width: 1200px; margin: 0 auto; padding: 2rem; }

  .welcome-container {
    text-align: center; margin-top: 5rem; padding: 3rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 4px;
  }

  h2 { font-weight: 900; letter-spacing: -1px; font-size: 2.5rem; margin-bottom: 1rem; }
  .highlight { color: #ff3e00; font-weight: bold; }
  
  .role-badge { 
    display: inline-block; padding: 5px 15px; border-radius: 2px; 
    font-size: 0.8rem; font-weight: bold; letter-spacing: 1px; margin-top: 1rem;
  }
  .role-badge.admin { background: rgba(255, 62, 0, 0.1); color: #ff3e00; border: 1px solid rgba(255, 62, 0, 0.3); }
  .role-badge.user { background: rgba(255, 255, 255, 0.05); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.1); }
</style>