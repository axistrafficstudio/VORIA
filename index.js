AOS.init();

// Mapeo para el toggle del tema (para el Navbar)
const themeMap = {
  'bg-dark': 'navbar-dark',
  'bg-light': 'navbar-light'
};

document.getElementById('themeToggle').addEventListener('click', () => {
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  body.classList.toggle('bg-light');
  body.classList.toggle('bg-dark');
  if (body.classList.contains('bg-light')) {
    navbar.classList.remove('navbar-dark');
    navbar.classList.add('navbar-light');
  } else {
    navbar.classList.remove('navbar-light');
    navbar.classList.add('navbar-dark');
  }
});

async function getCryptoPrices() {
  const eurPriceInput = document.getElementById('basePriceInput');
  const eurPrice = parseFloat(eurPriceInput.value);

  if (isNaN(eurPrice) || eurPrice <= 0) {
    document.getElementById('cryptoPrices').innerHTML = "<span class='text-danger'>Por favor, introduce un precio base válido.</span>";
    return;
  }

  document.getElementById('cryptoPrices').innerHTML = "Cargando..."; // Mensaje de carga

  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=eur");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const btc = data.bitcoin.eur;
    const eth = data.ethereum.eur;

    const btcValue = (eurPrice / btc).toFixed(5);
    const ethValue = (eurPrice / eth).toFixed(5);

    document.getElementById('cryptoPrices').innerHTML =
      `€${eurPrice.toLocaleString('es-ES')} ≈ <i class="fab fa-bitcoin text-warning me-2"></i><strong>${btcValue} BTC</strong> | <i class="fab fa-ethereum text-muted me-2"></i><strong>${ethValue} ETH</strong>`;
  } catch (error) {
    console.error("Error al obtener precios de criptomonedas:", error);
    document.getElementById('cryptoPrices').innerHTML =
      "<span class='text-danger'>Error al cargar los precios. Inténtalo de nuevo más tarde.</span>";
  }
}

// Cargar precios de criptomonedas al inicio
document.addEventListener('DOMContentLoaded', getCryptoPrices);

function toggleAudio() {
  const audio = document.getElementById('bg-music');
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

// --- Crypto API Mejorada y Responsive ---
async function getCryptoPricesDesktop() {
  const basePrice = parseFloat(document.getElementById('basePriceInputDesktop').value) || 0;
  const pricesDiv = document.getElementById('cryptoPricesDesktop');
  pricesDiv.innerHTML = 'Cargando...';

  try {
    // CoinGecko API para BTC, ETH, USDT
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=eur');
    if (!res.ok) throw new Error('No se pudo obtener datos de CoinGecko');
    const data = await res.json();

    const btc = data.bitcoin.eur;
    const eth = data.ethereum.eur;
    const usdt = data.tether.eur;

    const btcValue = (basePrice / btc).toFixed(6);
    const ethValue = (basePrice / eth).toFixed(6);
    const usdtValue = (basePrice / usdt).toFixed(2);

    pricesDiv.innerHTML = `
      <div class="d-flex flex-column gap-2 align-items-center">
        <span><img src="assets/bitcoin.png" alt="BTC" style="height:32px;"> <b>${btcValue} BTC</b></span>
        <span><img src="assets/ethereum.png" alt="ETH" style="height:32px;"> <b>${ethValue} ETH</b></span>
        <span><img src="assets/tether.png" alt="USDT" style="height:32px;"> <b>${usdtValue} USDT</b></span>
      </div>
    `;
  } catch (err) {
    pricesDiv.innerHTML = `<span class="text-danger">Error al obtener precios cripto. Intenta de nuevo.</span>`;
  }
}

