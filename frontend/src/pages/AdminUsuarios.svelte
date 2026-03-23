<script>
    import { fade, scale } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { authState } from "../services/auth.svelte.js";
    import { mostrarNotificacion } from "../services/ui.svelte.js";

    let usuarios = $state([]);
    let cargando = $state(true);

    let totalAdmins = $derived(usuarios.filter(u => u.role === 'admin').length);

    $effect(() => { obtenerUsuarios(); });

    async function obtenerUsuarios() {
        try {
            const response = await fetch("http://localhost:3000/api/users", {
                headers: { "Authorization": `Bearer ${authState.token}` }
            });
            if (response.ok) usuarios = await response.json();
        } catch (e) { mostrarNotificacion("Error al cargar la red", "error"); }
        finally { cargando = false; }
    }

    async function cambiarRol(usuario) {
        if (usuario._id === authState.user._id) {
            mostrarNotificacion("No puedes degradar tu propia autoridad", "error");
            return;
        }

        const nuevoRol = usuario.role === 'admin' ? 'user' : 'admin';
        try {
            const response = await fetch(`http://localhost:3000/api/users/${usuario._id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authState.token}` },
                body: JSON.stringify({ role: nuevoRol })
            });
            if (response.ok) obtenerUsuarios();
        } catch (e) { mostrarNotificacion("Error al cambiar rol", "error"); }
    }
</script>

<div class="admin-page" in:fade>
    <header class="page-header hero-section">
        <h1 class="glitch-text">CONSOLA <span>AUTORIDAD</span></h1>
        <p class="subtitle">Gestión de la red de usuarios</p>
    </header>

    <div class="premium-card stats-card">
        <p>Sincronizaciones Totales: {usuarios.length}</p>
        <p>Autoridades Centrales: <strong class="highlight">{totalAdmins}</strong></p>
    </div>

    {#if cargando}
        <p class="loading-text">Sincronizando la red...</p>
    {:else}
        <div class="console-grid">
            {#each usuarios as usuario (usuario._id)}
                <div animate:flip={{ duration: 300 }} in:scale={{ duration: 200 }} class="user-card">
                    <div class="user-info">
                        <span class="user-icon">👤</span>
                        <p class="username">{usuario.username}</p>
                        <span class="role-badge {usuario.role}">{usuario.role.toUpperCase()}</span>
                    </div>
                    
                    {#if usuario._id !== authState.user._id}
                        <button class="btn-console" onclick={() => cambiarRol(usuario)}>
                            {usuario.role === 'admin' ? 'HACER USUARIO' : 'HACER ADMIN'}
                        </button>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* Usamos los mismos estilos base para coherencia total */
    .admin-page { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }
    .premium-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 2px; margin-bottom: 3rem; display: flex; gap: 30px; justify-content: center;}
    .stats-card p { margin: 0; color: #888; text-transform: uppercase; font-size: 0.9rem;}
    .highlight { color: #ff3e00; font-size: 1.2rem; margin-left: 10px;}

    .console-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .user-card { background: #050505; border: 1px solid #111; padding: 1.5rem; display: flex; flex-direction: column; gap: 15px; border-radius: 2px; transition: border-color 0.3s;}
    .user-card:hover { border-color: #222;}

    .user-info { display: flex; flex-direction: column; align-items: center; gap: 8px;}
    .user-icon { font-size: 2rem; color: #333;}
    .username { color: #fff; font-weight: bold; font-size: 1.1rem; margin: 0;}
    
    .role-badge { display: inline-block; padding: 3px 10px; border-radius: 2px; font-size: 0.75rem; font-weight: bold;}
    .role-badge.admin { background: rgba(255, 62, 0, 0.1); color: #ff3e00; border: 1px solid rgba(255, 62, 0, 0.3);}
    .role-badge.user { background: #111; color: #aaa;}

    .btn-console { background: #111; color: #fff; border: 1px solid #222; padding: 10px; font-weight: bold; cursor: pointer; transition: 0.3s; width: 100%; border-radius: 2px;}
    .btn-console:hover { background: #ff3e00; color: #fff; border-color: #ff3e00; }
</style>