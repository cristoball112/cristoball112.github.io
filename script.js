const boton = document.getElementById('btnMicrofono');

// --- COMPLEMENTO YOUTUBE (Configuración externa) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';

recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    // Redireccionamos a YouTube con el texto reconocido
    window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(texto)}`;
};
// ----------------------------------------------------

boton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // ACTIVACIÓN DE YOUTUBE: Lo encendemos ANTES de la alerta y de apagar el micro
        recognition.start();

        // Tu alerta original
        alert("Escuchando..."); 
        
        // Tu código original para detener el flujo de prueba
        stream.getTracks().forEach(track => track.stop());

    } catch (err) {
        // Tu catch original para la "X"
        console.log("El usuario cerró el permiso sin decidir.");
    }
});
