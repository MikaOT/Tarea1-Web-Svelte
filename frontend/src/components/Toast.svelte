<script>
    import { uiState } from "../services/ui.svelte.js";
</script>

{#if uiState.visible}
    <div class="toast {uiState.tipo}">
        {uiState.mensaje}
    </div>
{/if}

<style>
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .success { background: #28a745; }
    .error { background: #dc3545; }
</style>