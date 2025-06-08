// Formulario

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Previene que la web no se reinicie al enviar el formulario

    // Obtener los valores del formulario
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    // Validar que todos los campos están llenos
    if (name === "" || email === "" || message === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Console.log para verificar los datos enviados.
    console.log("Formulario Enviado Correctamente");
    console.log("Nombre:", name);
    console.log("Correo Electrónico:", email);
    console.log("Mensaje:", message);

    // Limpiar el texto introducido por el usuario
    document.getElementById("contactForm").reset();

    // === REPRODUCIR SONIDO DE ENVÍO EXITOSO ===
    if (typeof playSound === "function" && typeof audioFormSubmit !== "undefined") {
        playSound(audioFormSubmit);
    } else {
        // Esto es opcional, pero puede ayudar a depurar si playSound o audioFormSubmit no están disponibles
        console.warn("playSound o audioFormSubmit no están disponibles globalmente para form.js");
    }
    // === FIN DE LA SECCIÓN DE SONIDO ===

    // Creamos mensaje con los datos introducidos por el usuario (Opcional, para verificación visual)
    let outputMessage = `Gracias, ${name}. Hemos recibido tu mensaje y te contactaremos pronto.`;
    document.getElementById("formOutput").textContent = outputMessage;
    document.getElementById("formOutput").classList.remove("d-none"); // Muestra el mensaje

    // Opcional: Ocultar el mensaje después de unos segundos
    setTimeout(() => {
        document.getElementById("formOutput").classList.add("d-none");
    }, 5000); // 5 segundos
});

// Función para ajustar placeholders en pantallas pequeñas
function updatePlaceholders() {
    let nameInput = document.getElementById("name");
    let emailInput = document.getElementById("email");
    let messageTextarea = document.getElementById("message");

    if (window.innerWidth < 768) { // Ejemplo: para pantallas menores a 768px (bootstrap md breakpoint)
        // Cambiar placeholders para pantallas más pequeñas

        nameInput.placeholder = "Nombre";
        emailInput.placeholder = "Email";
        messageTextarea.placeholder = "Mensaje corto";
    } else {
        // Restaurar los placeholders para pantallas más grandes
        nameInput.placeholder = "Tu nombre completo";
        emailInput.placeholder = "Tu correo electrónico";
        messageTextarea.placeholder = "Escribe tu mensaje aquí";
    }
}


// jQuery Card Flip Nuestros Valores

if (typeof $ !== 'undefined') { // Verificar si jQuery está cargado
    $(document).ready(function() {
        $('.card').click(function() { 
            $(this).toggleClass('flipped');
            // Si quieres sonido al flipear las cards (opcional):
            // if (typeof playSound === "function" && typeof audioButtonClick !== "undefined") {
            //     playSound(audioButtonClick);
            // }
        });
    });
} else {
    document.querySelectorAll('.valores-container .card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            // Si quieres sonido al flipear las cards (opcional):
            // if (typeof playSound === "function" && typeof audioButtonClick !== "undefined") {
            //     playSound(audioButtonClick);
            // }
        });
    });
}

// Detecta cambios en el tamaño de la ventana y ejecuta la función
window.addEventListener("resize", updatePlaceholders);
updatePlaceholders();
