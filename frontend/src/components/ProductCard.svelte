<script>
    import { authState } from "../services/auth.svelte.js"; // IMPORTANTE: Importar el estado de autenticación

    // 1. Recibimos las propiedades usando la runa $props
    let { producto, onDelete, onEdit } = $props();

    // 2. Usamos $derived para mostrar el estado de forma amigable (Lo mantenemos aunque no haya cantidad)
    let etiquetaEstado = $derived(producto.activo ? "Disponible ✅" : "Agotado ❌");
</script>

<div class="card">
    <div class="card-header">
        <h3>{producto.nombre}</h3>
        <span class="status-badge">{etiquetaEstado}</span>
    </div>
    
    <p class="price">{producto.precio}€</p>

    {#if authState.user?.role === 'admin'}
        <div class="actions" transition:fade>
            <button class="btn-edit" onclick={() => onEdit(producto)}>
                Editar 📝
            </button>
            <button class="btn-delete" onclick={() => onDelete(producto._id)}>
                Borrar 🗑️
            </button>
        </div>
    {/if}
</div>

<style>
    .card {
        background: #222;
        border: 1px solid #444;
        padding: 1.5rem;
        border-radius: 12px;
        transition: transform 0.2s, border-color 0.2s;
        display: flex;
        flex-direction: column;
    }
    .card:hover { transform: translateY(-5px); border-color: #ff3e00; }
    
    .card-header { display: flex; justify-content: space-between; align-items: start; gap: 10px; }
    .card-header h3 { margin: 0; font-size: 1.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    
    .status-badge { font-size: 0.7rem; background: #333; padding: 4px 8px; border-radius: 4px; white-space: nowrap; }
    
    .price { font-size: 1.8rem; font-weight: bold; color: #ff3e00; margin: 1rem 0; flex-grow: 1; }
    
    .actions { display: flex; gap: 10px; margin-top: auto; padding-top: 1rem; border-top: 1px solid #333; }
    
    button { flex: 1; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
    .btn-edit { background: #007bff; color: white; }
    .btn-edit:hover { background: #0056b3; }
    .btn-delete { background: #dc3545; color: white; }
    .btn-delete:hover { background: #a71d2a; }
</style>