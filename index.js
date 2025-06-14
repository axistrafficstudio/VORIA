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


document.addEventListener('DOMContentLoaded', function () {
  // Mostrar pop-up de cookies si no está aceptado
  if (!localStorage.getItem('voriaCookiesAccepted')) {
    document.getElementById('cookieConsent').style.display = 'block';
  }
  document.getElementById('acceptCookies').onclick = function () {
    localStorage.setItem('voriaCookiesAccepted', 'yes');
    document.getElementById('cookieConsent').style.display = 'none';
  };
  document.getElementById('moreInfoCookies').onclick = function () {
    const modal = new bootstrap.Modal(document.getElementById('legalModal'));
    modal.show();
  };

  // CTA pulse animación
  document.querySelectorAll('.pulse').forEach(btn => {
    btn.animate([
      { boxShadow: '0 0 24px #bfa14a55' },
      { boxShadow: '0 0 48px #bfa14a99' },
      { boxShadow: '0 0 24px #bfa14a55' }
    ], {
      duration: 1800,
      iterations: Infinity
    });
  });
});


// Juego VORIA: arrastra muebles a zonas objetivo adaptado a canvas responsive

let game, ctx, dragging = null, offsetX = 0, offsetY = 0, score = 0, targets = [];

// Proporciones relativas al tamaño del canvas
const MUEBLE_W = 0.12, MUEBLE_H = 0.07, TARGET_R = 0.06;

function randomPos(min, max) {
  return Math.random() * (max - min) + min;
}

function getCanvasSize() {
  const canvas = document.getElementById('voriaGameCanvas');
  return { w: canvas.width, h: canvas.height };
}

function setupLevel() {
  const { w, h } = getCanvasSize();
  const used = [];
  function getFreePos(xmin, xmax, ymin, ymax, r) {
    let tries = 0;
    while (tries < 50) {
      let x = randomPos(xmin, xmax), y = randomPos(ymin, ymax);
      let overlap = used.some(u => Math.abs(u.x - x) < r*2 && Math.abs(u.y - y) < r*2);
      if (!overlap) {
        used.push({x, y});
        return {x, y};
      }
      tries++;
    }
    return {x: randomPos(xmin, xmax), y: randomPos(ymin, ymax)};
  }
  game = {
    muebles: Array.from({length: 3}, () => {
      let pos = getFreePos(0.07*w, 0.3*w, 0.07*h, 0.8*h, TARGET_R*w);
      return {
        x: pos.x, y: pos.y,
        w: MUEBLE_W * w,
        h: MUEBLE_H * h,
        color: '#bfa14a', dragging: false, placed: false
      }
    }),
    targets: Array.from({length: 3}, () => {
      let pos = getFreePos(0.7*w, 0.9*w, 0.15*h, 0.85*h, TARGET_R*w);
      return {
        x: pos.x, y: pos.y,
        r: TARGET_R * w,
        filled: false
      }
    })
  };
  targets = game.targets;
  drawGame();
}

function startVoriaGame() {
  const canvas = document.getElementById('voriaGameCanvas');
  ctx = canvas.getContext('2d');
  score = 0;
  if (document.getElementById('level')) {
    document.getElementById('level').textContent = 'Nivel: 1';
  }
  document.getElementById('score').textContent = 'Puntuación: 0';
  setupLevel();

  // Eventos de drag
  canvas.onmousedown = onMouseDown;
  canvas.onmousemove = onMouseMove;
  canvas.onmouseup = onMouseUp;
  canvas.onmouseleave = onMouseUp;
}

function drawGame() {
  const { w, h } = getCanvasSize();
  ctx.clearRect(0, 0, w, h);
  // Zonas objetivo
  for (const t of game.targets) {
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, 2 * Math.PI);
    ctx.fillStyle = t.filled ? '#bfa14a' : '#444';
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#bfa14a';
    ctx.stroke();
  }
  // Muebles
  for (const m of game.muebles) {
    ctx.save();
    ctx.fillStyle = m.color;
    ctx.shadowColor = '#bfa14a';
    ctx.shadowBlur = 12;
    ctx.fillRect(m.x, m.y, m.w, m.h);
    ctx.restore();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(m.x, m.y, m.w, m.h);
    ctx.font = `${Math.round(m.h/2)}px 'Playfair Display', serif`;
    ctx.fillStyle = "#fff";
    ctx.fillText("VORIA", m.x + 10, m.y + m.h/2 + 6);
  }
}

function onMouseDown(e) {
  const rect = e.target.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  for (const m of game.muebles) {
    if (!m.placed && mx > m.x && mx < m.x + m.w && my > m.y && my < m.y + m.h) {
      dragging = m;
      offsetX = mx - m.x;
      offsetY = my - m.y;
      break;
    }
  }
}

function onMouseMove(e) {
  if (!dragging) return;
  const rect = e.target.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  dragging.x = mx - offsetX;
  dragging.y = my - offsetY;
  drawGame();
}

function onMouseUp(e) {
  if (!dragging) return;
  for (const t of game.targets) {
    if (!t.filled && Math.abs((dragging.x + dragging.w/2) - t.x) < t.r && Math.abs((dragging.y + dragging.h/2) - t.y) < t.r) {
      dragging.x = t.x - dragging.w/2;
      dragging.y = t.y - dragging.h/2;
      dragging.placed = true;
      t.filled = true;
      score += 100;
      document.getElementById('score').textContent = 'Puntuación: ' + score;
      break;
    }
  }
  dragging = null;
  drawGame();
  if (game.muebles.every(m => m.placed)) {
    setTimeout(() => {
      if (typeof window.level === 'undefined') window.level = 2;
      else window.level++;
      if (document.getElementById('level')) {
        document.getElementById('level').textContent = 'Nivel: ' + window.level;
      }
      setupLevel();
    }, 600);
  }
}

// --- Canvas responsive ---
function resizeCanvas() {
  const canvas = document.getElementById('voriaGameCanvas');
  const container = document.getElementById('game-container');
  // Ajusta el tamaño real del canvas al tamaño visible
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  if (ctx) setupLevel();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  startVoriaGame();
});

// --- Música Spotify ---
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById('musicToggleBtn');
  const player = document.getElementById('spotify-player-container');
  let visible = false;

  if (btn && player) {
    btn.addEventListener('click', function () {
      visible = !visible;
      player.style.display = visible ? 'block' : 'none';
      btn.classList.toggle('active', visible);
      btn.innerHTML = visible
        ? '<i class="fas fa-pause"></i> Música'
        : '<i class="fas fa-music"></i> Música';
    });
  }
});