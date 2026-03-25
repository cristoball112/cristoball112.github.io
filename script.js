const boton = document.getElementById('btnMicrofono');

// COMPLEMENTO YOUTUBE (Configuración externa)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';

recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;
    window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(texto)}`;
};

// TU FUNCIÓN ORIGINAL (INTACTA)
boton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Si acepta el permiso
        alert("Escuchando..."); 
        
        // ACTIVACIÓN DE BÚSQUEDA (Solo se dispara si el try tiene éxito)
        recognition.start();

        // Es buena práctica detener el micro si solo estás probando el permiso
        stream.getTracks().forEach(track => track.stop());

    } catch (err) {
        // Al dejar esto vacío (o solo con un console.log), 
        // si el usuario cierra con la "X", no saldrá ningún mensaje feo.
        // ¡Y al volver a hacer clic, el navegador preguntará de nuevo!
        console.log("El usuario cerró el permiso sin decidir.");
    }
});
