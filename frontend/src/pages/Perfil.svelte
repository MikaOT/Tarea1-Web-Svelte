<script>
    import { fade } from 'svelte/transition';
    import { authState, logout } from "../services/auth.svelte.js";

    let mensajeBienvenida = "OPERADOR ESTÁNDAR 👤";
    $: mensajeBienvenida = authState.user?.role === 'admin' ? "ADMINISTRADOR DEL SISTEMA 🔐" : "OPERADOR ESTÁNDAR 👤";

    let inicial = "?";
    $: inicial = authState.user?.username?.charAt(0).toUpperCase() || "?";
</script>

<div class="perfil-container" in:fade>
    <div class="cyber-profile-card">
        <header class="page-header">
            <h1>EXPEDIENTE <span>PERSONAL</span></h1>
            <p>{mensajeBienvenida}</p>
        </header>

        <div class="profile-layout">
            <div class="avatar-section">
                <div class="avatar-frame">
                    <div class="initial">{inicial}</div>
                    <div class="corner t-l"></div>
                    <div class="corner t-r"></div>
                    <div class="corner b-l"></div>
                    <div class="corner b-r"></div>
                </div>
            </div>

            <div class="info-section">
                <div class="info-grid">
                    <div class="data-item">
                        <span class="label">IDENTIFICADOR (USERNAME)</span>
                        <span class="value">{authState.user?.username || '---'}</span>
                    </div>
                    <div class="data-item">
                        <span class="label">NIVEL DE AUTORIZACIÓN (ROL)</span>
                        <span class="value {authState.user?.role}">{authState.user?.role?.toUpperCase() || '---'}</span>
                    </div>
                    <div class="data-item">
                        <span class="label">ESTADO DE SESIÓN (TOKEN)</span>
                        <span class="value status-ok">ACTIVO / SINCRO ✅</span>
                    </div>
                </div>

                <button class="btn-logout" onclick={logout}>
                    TERMINAR SESIÓN Y DESCONECTAR
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .perfil-container { padding-top: 3rem; }
    
    .cyber-profile-card {
        max-width: 800px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        padding: 3rem;
    }

    .page-header { text-align: center; margin-bottom: 3rem; }
    .page-header h1 { font-size: 3rem; font-weight: 900; margin: 0; letter-spacing: -1px; }
    .page-header span { color: #ff3e00; }
    .page-header p { color: #888; letter-spacing: 2px; text-transform: uppercase; font-size: 0.9rem; }

    .profile-layout { display: flex; gap: 3rem; flex-wrap: wrap; }
    
    .avatar-section { flex: 0 0 200px; display: flex; justify-content: center; }
    
    .avatar-frame {
        width: 150px; height: 150px; background: #000; border: 1px solid #222;
        display: flex; align-items: center; justify-content: center;
        position: relative;
    }
    .initial { font-size: 5rem; font-weight: 900; color: #333; }
    
    .corner { position: absolute; width: 10px; height: 10px; border: 2px solid #ff3e00; }
    .t-l { top: -2px; left: -2px; border-right: none; border-bottom: none; }
    .t-r { top: -2px; right: -2px; border-left: none; border-bottom: none; }
    .b-l { bottom: -2px; left: -2px; border-right: none; border-top: none; }
    .b-r { bottom: -2px; right: -2px; border-left: none; border-top: none; }

    .info-section { flex: 1; min-width: 300px; display: flex; flex-direction: column; justify-content: space-between; }
    
    .info-grid { display: grid; gap: 1.5rem; margin-bottom: 2rem; }
    .data-item { border-bottom: 1px solid #1a1a1a; padding-bottom: 8px; }
    .label { display: block; color: #666; font-size: 0.8rem; font-weight: bold; letter-spacing: 1px; }
    .value { display: block; color: #fff; font-size: 1.2rem; font-weight: bold; margin-top: 4px; }
    .value.admin { color: #ff3e00; }
    .status-ok { color: #28a745; font-size: 1rem; }

    .btn-logout {
        background: transparent;
        border: 1px solid #dc3545;
        color: #dc3545;
        width: 100%;
        padding: 12px;
        border-radius: 2px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    }
    .btn-logout:hover { background: #dc3545; color: white; box-shadow: 0 0 15px rgba(220, 53, 69, 0.3); }
</style>