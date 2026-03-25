const boton = document.getElementById('btnMicrofono');

// Configuramos el motor de reconocimiento fuera para que esté listo
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.lang = 'es-ES';
    
    // Aquí es donde sucede la magia de YouTube
    recognition.onresult = (event) => {
        const textoEscuchado = event.results[0][0].transcript;
        window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(textoEscuchado)}`;
    };
}

boton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Primero activamos la escucha de YouTube
        if (recognition) {
            recognition.start();
        }

        // Luego mostramos el alert (Ten en cuenta que mientras el alert esté, no buscará)
        alert("Escuchando... Di el nombre de la canción y luego pulsa Aceptar"); 

        // IMPORTANTE: No detenemos el stream aquí para que el micro siga encendido
        // stream.getTracks().forEach(track => track.stop()); // Esta línea causaba el fallo

    } catch (err) {
        console.log("El usuario cerró el permiso sin decidir.");
    }
});