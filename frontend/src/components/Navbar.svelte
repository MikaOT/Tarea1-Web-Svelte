<script>
  import { Link } from "svelte-routing";
  import { authState, logout } from "../services/auth.svelte.js";

  // SEO y UX: Nombre derivado para la cabecera
  let nombreUsuario = "Invitado";
  $: nombreUsuario = authState.user?.username || "Invitado";
</script>

<header class="cyber-navbar">
  <div class="nav-container">
    <div class="logo-section">
      <span class="cyber-icon">⚡</span>
      <span class="logo-text">MI_ARCHIVO <span class="version">v5</span></span>
    </div>

    <nav class="nav-links">
      {#if authState.token}
        <Link to="/productos" getProps={({ isCurrent }) => ({ class: isCurrent ? "active" : "" })}>
          PRODUCTOS
        </Link>
        <Link to="/perfil" getProps={({ isCurrent }) => ({ class: isCurrent ? "active" : "" })}>
          PERFIL
        </Link>
        
        {#if authState.user?.role === 'admin'}
          <Link to="/admin" getProps={({ isCurrent }) => ({ class: isCurrent ? "active" : "" })}>
            ADMIN
          </Link>
        {/if}
      {/if}
    </nav>

    <div class="user-section">
      {#if authState.token}
        <span class="user-info">ID: {nombreUsuario}</span>
        <button class="btn-logout" onclick={logout}>CERRAR_SESIÓN</button>
      {/if}
    </div>
  </div>
</header>

<style>
  .cyber-navbar {
    background-color: #000; border-bottom: 1px solid #1a1a1a;
    position: sticky; top: 0; z-index: 100;
  }

  .nav-container {
    max-width: 1200px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem;
  }

  .logo-section { display: flex; align-items: center; gap: 10px; }
  .cyber-icon { color: #ff3e00; font-size: 1.2rem; }
  .logo-text { font-weight: 900; color: #fff; letter-spacing: -1px; }
  .logo-text .version { color: #ff3e00; font-size: 0.8rem; vertical-align: super; }

  .nav-links { display: flex; gap: 1rem; }
  
  :global(.nav-links a) {
    color: #888; text-decoration: none; font-weight: bold;
    font-size: 0.9rem; letter-spacing: 1px; padding: 8px 12px;
    border-radius: 2px; transition: all 0.3s;
  }

  :global(.nav-links a:hover) { color: #fff; background: rgba(255, 255, 255, 0.03); }
  :global(.nav-links a.active) { color: #ff3e00; background: rgba(255, 62, 0, 0.05); border-bottom: 2px solid #ff3e00; }

  .user-section { display: flex; align-items: center; gap: 15px; }
  .user-info { color: #aaa; font-size: 0.85rem; font-weight: bold; }

  .btn-logout {
    background: transparent; border: 1px solid #ff3e00; color: #ff3e00;
    padding: 6px 12px; border-radius: 2px; font-weight: bold;
    cursor: pointer; font-size: 0.8rem; transition: all 0.3s;
  }

  .btn-logout:hover { background: #ff3e00; color: #000; box-shadow: 0 0 10px rgba(255, 62, 0, 0.3); }
</style>