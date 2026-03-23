<script>
    import { fade, fly, scale } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { authState } from "../services/auth.svelte.js";
    import { mostrarNotificacion } from "../services/ui.svelte.js";
    import ProductCard from "../components/ProductCard.svelte";
    import LoadingSpinner from "../components/LoadingSpinner.svelte";

    let productos = $state([]); 
    let cargando = $state(true);
    let enviando = $state(false);
    let busqueda = $state(""); 

    let idEditando = $state(null); 
    let nombreForm = $state('');
    let precioForm = $state(0);

    let productosFiltrados = $derived(
        productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    );

    $effect(() => { obtenerProductos(); });

    async function obtenerProductos() {
        try {
            const response = await fetch("http://localhost:3000/api/productos", {
                headers: { "Authorization": `Bearer ${authState.token}` }
            });
            if (response.ok) productos = await response.json();
        } catch (e) {
            mostrarNotificacion("Fallo de conexión", "error");
        } finally { cargando = false; }
    }

    async function manejarEnvio(e) {
        e.preventDefault();
        enviando = true;
        const url = idEditando ? `http://localhost:3000/api/productos/${idEditando}` : "http://localhost:3000/api/productos";
        const metodo = idEditando ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authState.token}` },
                body: JSON.stringify({ nombre: nombreForm, precio: precioForm })
            });
            if (response.ok) {
                mostrarNotificacion(idEditando ? "Actualizado correctamente" : "Producto registrado");
                cancelarEdicion();
                obtenerProductos(); 
            }
        } catch (err) {
            mostrarNotificacion("Error en el servidor", "error");
        } finally { enviando = false; }
    }

    function prepararEdicion(producto) {
        idEditando = producto._id;
        nombreForm = producto.nombre;
        precioForm = producto.precio;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelarEdicion() {
        idEditando = null;
        nombreForm = '';
        precioForm = 0;
    }

    async function eliminarProducto(id) {
        if (!confirm("¿Deseas eliminar este registro?")) return;
        try {
            const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${authState.token}` }
            });
            if (response.ok) {
                productos = productos.filter(p => p._id !== id);
                mostrarNotificacion("Eliminado con éxito");
            }
        } catch (e) { mostrarNotificacion("Error al eliminar", "error"); }
    }
</script>

<div class="main-container" in:fade>
    <header class="hero-section">
        <h1 class="glitch-text">CATÁLOGO <span>EXCLUSIVO</span></h1>
        <p class="subtitle">Gestión de activos de alto rendimiento</p>
    </header>

    {#if authState.user?.role === 'admin'}
        <section class="admin-section" in:fly={{ y: 50, duration: 800 }}>
            <div class="premium-card">
                <div class="card-glow"></div>
                <h3>{idEditando ? 'EDITAR ACTIVO' : 'NUEVO REGISTRO'}</h3>
                <form onsubmit={manejarEnvio} class="cyber-form">
                    <div class="input-wrapper">
                        <input type="text" bind:value={nombreForm} placeholder="NOMBRE" required />
                    </div>
                    <div class="input-wrapper">
                        <input type="number" bind:value={precioForm} placeholder="PRECIO" required />
                    </div>
                    <div class="button-group">
                        <button type="submit" class="btn-gold" disabled={enviando}>
                            {enviando ? 'PROCESANDO...' : 'CONFIRMAR'}
                        </button>
                        {#if idEditando}
                            <button type="button" class="btn-outline" onclick={cancelarEdicion}>CANCELAR</button>
                        {/if}
                    </div>
                </form>
            </div>
        </section>
    {/if}

    <section class="filter-section">
        <div class="search-box">
            <span class="icon">🔍</span>
            <input type="text" bind:value={busqueda} placeholder="BUSCAR EN EL ARCHIVO..." />
        </div>
    </section>

    <hr class="separator" />

    {#if cargando}
        <LoadingSpinner />
    {:else}
        <div class="grid">
            {#each productosFiltrados as producto (producto._id)}
                <div animate:flip={{ duration: 400 }} in:scale={{ duration: 300 }}>
                    <ProductCard {producto} onEdit={prepararEdicion} onDelete={eliminarProducto} />
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* Estética Inspirada en La Velada / Cyber-Premium */
    .main-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 4rem 2rem;
    }

    .hero-section {
        text-align: center;
        margin-bottom: 4rem;
    }

    .hero-section h1 {
        font-size: 4rem;
        font-weight: 900;
        letter-spacing: -2px;
        margin: 0;
        color: #fff;
    }

    .hero-section span {
        color: #ff3e00; /* Acento neón */
        display: block;
        font-size: 1.5rem;
        letter-spacing: 10px;
        margin-top: -10px;
    }

    .subtitle {
        color: #666;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 2px;
        margin-top: 1rem;
    }

    /* Tarjeta Premium con Efecto Cristal */
    .premium-card {
        position: relative;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 3rem;
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 4rem;
    }

    .card-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 62, 0, 0.05) 0%, transparent 70%);
        pointer-events: none;
    }

    .cyber-form {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .input-wrapper {
        flex: 1;
        min-width: 200px;
    }

    input {
        width: 100%;
        background: #000;
        border: 1px solid #222;
        color: #fff;
        padding: 1.2rem;
        font-family: inherit;
        font-weight: bold;
        transition: all 0.3s;
    }

    input:focus {
        border-color: #ff3e00;
        outline: none;
        box-shadow: 0 0 20px rgba(255, 62, 0, 0.1);
    }

    .btn-gold {
        background: #fff;
        color: #000;
        padding: 1.2rem 2.5rem;
        font-weight: 900;
        border: none;
        cursor: pointer;
        transition: 0.3s;
    }

    .btn-gold:hover:not(:disabled) {
        background: #ff3e00;
        color: #fff;
        transform: translateY(-2px);
    }

    .search-box {
        background: #000;
        border: 1px solid #222;
        display: flex;
        align-items: center;
        padding: 0 1.5rem;
        max-width: 500px;
        margin: 0 auto 3rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
    }

    .separator {
        border: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, #222, transparent);
        margin: 4rem 0;
    }
</style>