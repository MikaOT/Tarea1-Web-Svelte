// Estado global para las notificaciones
export const uiState = $state({
    mensaje: "",
    tipo: "success", // success o error
    visible: false
});

export function mostrarNotificacion(msg, tipo = "success") {
    uiState.mensaje = msg;
    uiState.tipo = tipo;
    uiState.visible = true;
    
    // Se oculta solo tras 3 segundos
    setTimeout(() => {
        uiState.visible = false;
    }, 3000);
}