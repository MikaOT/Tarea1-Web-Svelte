<div class="spinner-container">
    <div class="spinner"></div>
    <p>Sincronizando con el servidor...</p>
</div>

<style>
    .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255, 62, 0, 0.1);
        border-top: 5px solid #ff3e00; /* Color Svelte */
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    p {
        color: #888;
        font-size: 0.9rem;
        letter-spacing: 1px;
    }
</style>