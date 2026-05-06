const boton = document.getElementById('btnMicrofono');
const apiToken = '06cb209d0b2954be3b390d3157a9be01'; 

// Elementos del DOM para el Login
const loginOverlay = document.getElementById('login-overlay');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const userInput = document.getElementById('userInput');

let usuarioActual = "";

// --- LÓGICA DE LOGIN ---
btnLogin.addEventListener('click', () => {
    const nombre = userInput.value.trim();
    if (nombre) {
        usuarioActual = nombre;
        localStorage.setItem("sesion_activa", usuarioActual);
        iniciarApp();
    } else {
        alert("Introduce un nombre");
    }
});

btnLogout.addEventListener('click', () => {
    localStorage.removeItem("sesion_activa");
    location.reload(); // Recarga para resetear todo
});

function iniciarApp() {
    loginOverlay.style.display = 'none';
    btnLogout.style.display = 'block';
    document.getElementById('nombreUsuarioHistorial').textContent = usuarioActual;
    document.getElementById('bienvenida').innerHTML = `¡Hola, ${usuarioActual}!<br>Toca para escuchar`;
    mostrarHistorial();
}

// --- LÓGICA DEL MICRÓFONO (Tu código original con ajuste de guardado) ---
boton.addEventListener('click', async () => {
    if (!usuarioActual) return alert("Inicia sesión primero");
    
    console.log("Escuchando...");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', audioBlob);
            formData.append('api_token', apiToken);

            const response = await fetch('https://api.audd.io/', { method: 'POST', body: formData });
            const data = await response.json();

            if (data.status === "success" && data.result) {
                const { title, artist } = data.result;
                alert(`Canción encontrada: ${title} - ${artist}`);
                guardarEnHistorial(title, artist);
            } else {
                alert("No pudimos identificar la canción.");
            }
        };

        mediaRecorder.start();
        setTimeout(() => {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
        }, 5000);
    } catch (err) {
        alert("Permite el micrófono.");
    }
});

// --- HISTORIAL PERSONALIZADO ---
function guardarEnHistorial(titulo, artista) {
    // Llave única por usuario
    const llaveHistorial = `historial_${usuarioActual}`;
    let historial = JSON.parse(localStorage.getItem(llaveHistorial)) || [];

    historial.push({ titulo, artista, fecha: new Date().toLocaleTimeString() });

    if (historial.length > 10) historial.shift();

    localStorage.setItem(llaveHistorial, JSON.stringify(historial));
    mostrarHistorial();
}

function mostrarHistorial() {
    const lista = document.getElementById("listaHistorial");
    const llaveHistorial = `historial_${usuarioActual}`;
    
    lista.innerHTML = "";
    let historial = JSON.parse(localStorage.getItem(llaveHistorial)) || [];

    historial.slice().reverse().forEach(c => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${c.titulo}</strong><br><small>${c.artista}</small>`;
        lista.appendChild(li);
    });
}

// Verificar sesión al cargar
document.addEventListener("DOMContentLoaded", () => {
    const sesionGuardada = localStorage.getItem("sesion_activa");
    if (sesionGuardada) {
        usuarioActual = sesionGuardada;
        iniciarApp();
    }
});
