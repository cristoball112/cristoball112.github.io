const boton = document.getElementById('btnMicrofono');

// --- COMPLEMENTO YOUTUBE ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';

recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(texto)}`;
};
// ----------------------------

boton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // 1. Iniciamos el buscador de YouTube
        recognition.start();

        // 2. Tu alerta (mientras esté abierta, el navegador sigue escuchando)
        alert("Escuchando... Di el nombre de la canción y pulsa Aceptar"); 

        // 3. CAMBIO CLAVE: Quitamos el "stop()" inmediato. 
        // Si apagas el micro aquí, el reconocimiento se corta y no busca.
        // El navegador lo cerrará solo al cambiar de página a YouTube.

    } catch (err) {
        console.log("El usuario cerró el permiso sin decidir.");
    }
});
