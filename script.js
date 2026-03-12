const boton = document.getElementById('btnMicrofono');

boton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        alert("Escuchando...");
    } catch (err) {
        alert("Para identificar permita acceso al microfono");
    }
});