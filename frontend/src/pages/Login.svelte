<script>
    import { fade } from 'svelte/transition';
    import { login } from "../services/auth.svelte.js";
    import { mostrarNotificacion } from "../services/ui.svelte.js";

    let username = $state("");
    let password = $state("");
    let cargando = $state(false);

    async function handleSubmit(e) {
        e.preventDefault();
        cargando = true;
        
        try {
            const éxito = await login(username, password);
            if (!éxito) {
                mostrarNotificacion("Credenciales de acceso no válidas", "error");
            }
        } catch (error) {
            mostrarNotificacion("Fallo crítico en el servidor", "error");
        } finally {
            cargando = false;
        }
    }
</script>

<div class="login-page" in:fade>
    <div class="terminal-card">
        <div class="terminal-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="title">MI_ARCHIVO_AUTH</span>
        </div>
        
        <header class="form-header">
            <h2>SISTEMA DE ACCESO</h2>
            <p>Introduce las credenciales para la sincronización</p>
        </header>

        <form onsubmit={handleSubmit} class="cyber-form">
            <div class="input-group">
                <label for="username">[USUARIO]</label>
                <input type="text" id="username" bind:value={username} required placeholder="nombre de usuario" />
            </div>

            <div class="input-group">
                <label for="password">[CONTRASEÑA]</label>
                <input type="password" id="password" bind:value={password} required placeholder="******" />
            </div>

            <button type="submit" class="btn-primary" disabled={cargando}>
                {cargando ? 'VALIDANDO...' : 'INICIAR SESIÓN'}
            </button>
        </form>
    </div>
</div>

<style>
    .login-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 80px); /* Ajustar según Navbar */
        padding: 2rem;
    }

    .terminal-card {
        background: #050505;
        border: 1px solid #111;
        width: 100%;
        max-width: 450px;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .terminal-header {
        background: #111;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid #222;
    }

    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }
    .terminal-header .title { margin-left: auto; color: #666; font-size: 0.8rem; font-weight: bold; }

    .form-header { text-align: center; padding: 2rem; }
    h2 { font-weight: 900; font-size: 2rem; letter-spacing: -1px; margin: 0; }
    p { color: #888; font-size: 0.9rem; }

    .cyber-form { padding: 0 3rem 3rem; display: flex; flex-direction: column; gap: 1.5rem; }

    .input-group label { display: block; color: #ff3e00; font-weight: bold; font-size: 0.85rem; letter-spacing: 1px; margin-bottom: 8px; }
    
    input {
        width: 100%;
        background: #000;
        border: 1px solid #222;
        color: #fff;
        padding: 12px;
        border-radius: 2px;
        transition: border 0.3s;
    }
    input:focus { border-color: #ff3e00; outline: none; }

    .btn-primary {
        background: #ff3e00;
        color: white;
        padding: 15px;
        border: none;
        border-radius: 2px;
        font-weight: 900;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 1rem;
    }
    .btn-primary:hover:not(:disabled) { filter: brightness(1.2); box-shadow: 0 0 15px rgba(255, 62, 0, 0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>