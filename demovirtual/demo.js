
let currentModelPrice = 0;
let currentCryptoRate = {};
let selectedModelId = null;


function animateButtonFeedback(btn) {
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 600);
}

function showHUDMessage(msg, type = "info") {
    let hud = document.getElementById('demoHUD');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'demoHUD';
        hud.style.position = 'fixed';
        hud.style.top = '30px';
        hud.style.left = '50%';
        hud.style.transform = 'translateX(-50%)';
        hud.style.zIndex = '9999';
        hud.style.padding = '1.2em 2.5em';
        hud.style.borderRadius = '2em';
        hud.style.fontFamily = "'Inter',sans-serif";
        hud.style.fontWeight = '600';
        hud.style.fontSize = '1.15rem';
        hud.style.boxShadow = '0 4px 32px #d4af3740';
        hud.style.transition = 'opacity 0.4s';
        document.body.appendChild(hud);
    }
    hud.style.background = type === "success"
        ? "linear-gradient(90deg,#ffe9a7 0%,#d4af37 100%)"
        : "linear-gradient(90deg,#232323 0%,#bfa14a22 100%)";
    hud.style.color = type === "success" ? "#181818" : "#ffe9a7";
    hud.textContent = msg;
    hud.style.opacity = "1";
    setTimeout(() => { hud.style.opacity = "0"; }, 1800);
}

// --- CRIPTO: API Y ACTUALIZACIÓN ---
async function fetchCryptoPrices(cryptoId) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,bitcoin-cash,ripple&vs_currencies=usd`);
        const data = await response.json();
        currentCryptoRate = data;
        updatePaymentDetails();
    } catch (error) {
        console.error("Error fetching crypto prices for demo:", error);
        setCryptoError();
    }
}

function setCryptoError() {
    document.getElementById('exchangeRate').textContent = "Error fetching rate";
    document.getElementById('cryptoAmount').textContent = "N/A";
    document.getElementById('preciseAmount').textContent = "N/A";
    document.getElementById('cryptoAddress').textContent = "N/A";
}

// --- ACTUALIZACIÓN DE DETALLES DE PAGO ---
function updatePaymentDetails() {
    const selectedCrypto = document.getElementById('crypto').value;
    const rate = currentCryptoRate[selectedCrypto] ? currentCryptoRate[selectedCrypto].usd : 0;

    if (currentModelPrice > 0 && rate > 0) {
        const cryptoAmount = (currentModelPrice / rate).toFixed(8);
        document.getElementById('cryptoAmount').textContent = `${cryptoAmount} ${selectedCrypto.toUpperCase().replace('-', '')}`;
        document.getElementById('exchangeRate').textContent = `1 ${selectedCrypto.toUpperCase().replace('-', '')} = $${rate.toLocaleString()}`;
        document.getElementById('preciseAmount').textContent = `${cryptoAmount} ${selectedCrypto.toUpperCase().replace('-', '')}`;
        // QR Code
        const qrData = `bitcoin:${generateCryptoAddress(selectedCrypto)}?amount=${cryptoAmount}`;
        document.getElementById('qrCode').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
        document.getElementById('cryptoAddress').textContent = generateCryptoAddress(selectedCrypto);
    } else {
        document.getElementById('cryptoAmount').textContent = "0.0000 BTC";
        document.getElementById('exchangeRate').textContent = "1 BTC = $0.00";
        document.getElementById('preciseAmount').textContent = "0.0000 BTC";
        document.getElementById('qrCode').src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=no-amount";
        document.getElementById('cryptoAddress').textContent = "...";
    }
}

// --- GENERADOR DE DIRECCIONES (DEMO) ---
function generateCryptoAddress(crypto) {
    switch (crypto) {
        case 'bitcoin': return 'bc1qxyzdemo...';
        case 'ethereum': return '0xAbcDemo...';
        case 'litecoin': return 'Ltc1defDemo...';
        case 'bitcoin-cash': return 'bitcoincash:qpqrDemo...';
        case 'ripple': return 'rG123Demo...';
        default: return '...';
    }
}

// --- COPIAR AL PORTAPAPELES CON FEEDBACK ---
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showHUDMessage('Copiado al portapapeles: ' + text, "success");
    }).catch(err => {
        showHUDMessage('Error al copiar', "error");
        console.error('Error al copiar: ', err);
    });
}

// --- INTERACCIÓN DE MODELOS (VISUAL Y LÓGICA) ---
function selectModel(modelBtn) {
    currentModelPrice = parseFloat(modelBtn.dataset.price);
    document.querySelectorAll('[id^="model"]').forEach(btn => btn.classList.remove('border-amber-500', 'ring-2', 'selected-model'));
    modelBtn.classList.add('border-amber-500', 'ring-2', 'selected-model');
    animateButtonFeedback(modelBtn);
    updatePaymentDetails();
    showHUDMessage(`Modelo seleccionado: ${modelBtn.dataset.name || modelBtn.textContent}`, "info");
}


function enableObjectInteraction() {
    const demoObj = document.getElementById('demoObject');
    if (!demoObj) return;

    let dragging = false, offsetX = 0, offsetY = 0, startX = 0, startY = 0, scale = 1, rotation = 0;

    // Touch/Mouse down
    demoObj.addEventListener('mousedown', startDrag);
    demoObj.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        dragging = true;
        demoObj.style.transition = "box-shadow 0.2s, transform 0.2s";
        demoObj.style.boxShadow = "0 8px 32px #d4af37cc";
        startX = (e.touches ? e.touches[0].clientX : e.clientX) - demoObj.offsetLeft;
        startY = (e.touches ? e.touches[0].clientY : e.clientY) - demoObj.offsetTop;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }

    function onDrag(e) {
        if (!dragging) return;
        e.preventDefault && e.preventDefault();
        let x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
        let y = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
        demoObj.style.transform = `translate(${x}px,${y}px) scale(${scale}) rotate(${rotation}deg)`;
    }

    function endDrag() {
        dragging = false;
        demoObj.style.boxShadow = "";
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    }

    
    demoObj.addEventListener('wheel', e => {
        e.preventDefault();
        scale += e.deltaY < 0 ? 0.05 : -0.05;
        scale = Math.max(0.5, Math.min(2, scale));
        demoObj.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        showHUDMessage(`Escala: ${(scale * 100).toFixed(0)}%`);
    });

    
    demoObj.addEventListener('dblclick', () => {
        rotation = (rotation + 45) % 360;
        demoObj.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        showHUDMessage(`Rotación: ${rotation}°`);
    });
}

// --- INICIALIZACIÓN Y EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    // Modelos
    document.getElementById('model1').addEventListener('click', function () { selectModel(this); });
    document.getElementById('model2').addEventListener('click', function () { selectModel(this); });

    // Criptomoneda
    document.getElementById('crypto').addEventListener('change', updatePaymentDetails);

 
    fetchCryptoPrices('bitcoin');


    document.getElementById('payButton').addEventListener('click', () => {
        showHUDMessage('Pago simulado iniciado. Por favor, envía el monto a la dirección.', "success");
    });


    document.getElementById('model1').click();

    
    enableObjectInteraction();
});

