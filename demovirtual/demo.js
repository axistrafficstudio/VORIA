// Variable para almacenar el precio actual del modelo seleccionado
let currentModelPrice = 0; 
let currentCryptoRate = {}; // Para almacenar las tasas de criptomonedas

// Función para obtener precios de criptomonedas para la DEMO
async function fetchCryptoPrices(cryptoId) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,bitcoin-cash,ripple&vs_currencies=usd`);
        const data = await response.json();
        currentCryptoRate = data; // Almacena todas las tasas
        updatePaymentDetails();
        // updateChart(); // Eliminado: Ya no se necesita actualizar la gráfica
    } catch (error) {
        console.error("Error fetching crypto prices for demo:", error);
        document.getElementById('exchangeRate').textContent = "Error fetching rate";
        document.getElementById('cryptoAmount').textContent = "N/A";
        document.getElementById('preciseAmount').textContent = "N/A";
        document.getElementById('cryptoAddress').textContent = "N/A";
    }
}

// Función para actualizar los detalles de pago de la DEMO
function updatePaymentDetails() {
    const selectedCrypto = document.getElementById('crypto').value;
    const rate = currentCryptoRate[selectedCrypto] ? currentCryptoRate[selectedCrypto].usd : 0;

    if (currentModelPrice > 0 && rate > 0) {
        const cryptoAmount = (currentModelPrice / rate).toFixed(8); // Aumentar decimales para cripto
        document.getElementById('cryptoAmount').textContent = `${cryptoAmount} ${selectedCrypto.toUpperCase().replace('-', '')}`;
        document.getElementById('exchangeRate').textContent = `1 ${selectedCrypto.toUpperCase().replace('-', '')} = $${rate.toLocaleString()}`;
        document.getElementById('preciseAmount').textContent = `${cryptoAmount} ${selectedCrypto.toUpperCase().replace('-', '')}`;

        // Generar QR Code
        const qrData = `bitcoin:${generateCryptoAddress(selectedCrypto)}?amount=${cryptoAmount}`; // Ejemplo
        document.getElementById('qrCode').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
        document.getElementById('cryptoAddress').textContent = generateCryptoAddress(selectedCrypto); // Generar dirección
    } else {
        document.getElementById('cryptoAmount').textContent = "0.0000 BTC";
        document.getElementById('exchangeRate').textContent = "1 BTC = $0.00";
        document.getElementById('preciseAmount').textContent = "0.0000 BTC";
        document.getElementById('qrCode').src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=no-amount";
        document.getElementById('cryptoAddress').textContent = "...";
    }
}

// Función de ejemplo para generar direcciones (en un entorno real, esto sería gestionado por un backend)
function generateCryptoAddress(crypto) {
    switch(crypto) {
        case 'bitcoin': return 'bc1qxyzdemo...'; // Dummy address
        case 'ethereum': return '0xAbcDemo...'; // Dummy address
        case 'litecoin': return 'Ltc1defDemo...'; // Dummy address
        case 'bitcoin-cash': return 'bitcoincash:qpqrDemo...'; // Dummy address
        case 'ripple': return 'rG123Demo...'; // Dummy address
        default: return '...';
    }
}

// Función para copiar al portapapeles
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copiado al portapapeles: ' + text);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// Inicialización del gráfico (simulado) - Se queda comentado porque al hacer carga todo el rato en tiempo real la página web hace una especia de guiños
// let cryptoChart;
// function updateChart() {
//     const ctx = document.getElementById('cryptoChart').getContext('2d');
//     if (cryptoChart) {
//         cryptoChart.destroy();
//     }
//     const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
//     const dataPoints = labels.map(() => Math.random() * (50000 - 40000) + 40000);
//     cryptoChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'BTC Price (USD)',
//                 data: dataPoints,
//                 borderColor: 'rgb(245, 158, 11)',
//                 tension: 0.1,
//                 fill: false
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: false
//                 }
//             }
//         }
//     });
// }

// Event Listeners de la DEMO
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar clics en los botones de modelo
    document.getElementById('model1').addEventListener('click', function() {
        currentModelPrice = parseFloat(this.dataset.price);
        // Quitar la clase de 'selected' de todos los botones y añadirla al actual
        document.querySelectorAll('[id^="model"]').forEach(btn => btn.classList.remove('border-amber-500', 'ring-2'));
        this.classList.add('border-amber-500', 'ring-2');
        updatePaymentDetails();
    });

    document.getElementById('model2').addEventListener('click', function() {
        currentModelPrice = parseFloat(this.dataset.price);
        document.querySelectorAll('[id^="model"]').forEach(btn => btn.classList.remove('border-amber-500', 'ring-2'));
        this.classList.add('border-amber-500', 'ring-2');
        updatePaymentDetails();
    });

    // Escuchar cambios en la selección de criptomoneda
    document.getElementById('crypto').addEventListener('change', updatePaymentDetails);

    // Cargar precios iniciales al cargar la página
    fetchCryptoPrices('bitcoin'); // Carga inicial para Bitcoin

    // Inicializar el gráfico al cargar la página - ELIMINADO
    // updateChart();

    // Evento del botón de pagar (simulado)
    document.getElementById('payButton').addEventListener('click', () => {
        alert('Pago simulado iniciado. Por favor, envía el monto a la dirección.');
        // Aquí iría la lógica para monitorear la transacción real
    });

    // Seleccionar el modelo 1 por defecto al cargar la página
    document.getElementById('model1').click(); 
});