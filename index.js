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


// Juego VORIA: arrastra muebles a zonas objetivo
let game, ctx, dragging = null, offsetX = 0, offsetY = 0, score = 0, targets = [];

function randomPos(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setupLevel() {
  // Genera posiciones aleatorias para muebles y targets, evitando solapamientos básicos
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
      let pos = getFreePos(40, 180, 40, 320, 40);
      return {
        x: pos.x, y: pos.y, w: 70, h: 40, color: '#bfa14a', dragging: false, placed: false
      }
    }),
    targets: Array.from({length: 3}, () => {
      let pos = getFreePos(400, 540, 60, 340, 35);
      return {
        x: pos.x, y: pos.y, r: 35, filled: false
      }
    })
  };
  targets = game.targets;
  drawGame();
}

$(document).ready(function() {
  $('.navbar-nav a.nav-link').on('click', function(e) {
    const target = $(this).attr('href');
    if (target.startsWith('#') && $(target).length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(target).offset().top - 80 // Ajusta el offset según tu navbar
      }, 700);
    }
  });
});

$(document).ready(function() {
  $('.navbar-nav a.nav-link').on('click', function(e) {
    const target = $(this).attr('href');
    if (target.startsWith('#') && $(target).length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(target).offset().top - 80 // Ajusta el offset según tu navbar
      }, 700);
    }
  });
});

$('[data-tooltip]').hover(function(e) {
  const tip = $('<div class="custom-tooltip"></div>').text($(this).data('tooltip')).appendTo('body');
  $(this).on('mousemove', function(e) {
    tip.css({ left: e.pageX + 10, top: e.pageY + 10 });
  });
}, function() {
  $('.custom-tooltip').remove();
});

$('.pricing-card').hover(
  function() { $(this).addClass('shadow-lg').css('transform', 'scale(1.03)'); },
  function() { $(this).removeClass('shadow-lg').css('transform', 'scale(1)'); }
);

$(window).on('scroll', function() {
  $('.fade-section').each(function() {
    if ($(this).offset().top < $(window).scrollTop() + $(window).height() - 100) {
      $(this).addClass('visible');
    }
  });
});



$('.faq-question').on('click', function() {
  $(this).next('.faq-answer').slideToggle();
  $(this).toggleClass('open');
});

// Modifica startVoriaGame para usar setupLevel
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

// Responsive canvas para el juego VORIA
function resizeGameCanvas() {
  const canvas = document.getElementById('voriaGameCanvas');
  if (!canvas) return;
  const parent = canvas.parentElement;
  let width = parent.offsetWidth;
  let height = width * 0.6667; // 16:9 ratio (600x400)
  if (width > 600) { width = 600; height = 400; }
  canvas.width = width;
  canvas.height = height;
  if (typeof drawGame === 'function') drawGame();
}
window.addEventListener('resize', resizeGameCanvas);
document.addEventListener('DOMContentLoaded', resizeGameCanvas);

// Asegúrate de que drawGame use canvas.width y canvas.height dinámicamente
function drawGame() {
  const canvas = document.getElementById('voriaGameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calcula escalas respecto al tamaño original (600x400)
  const scaleX = canvas.width / 600;
  const scaleY = canvas.height / 400;

  // Dibuja zonas objetivo
  for (const t of game.targets) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(t.x * scaleX, t.y * scaleY, t.r * scaleX, 0, 2 * Math.PI);
    ctx.fillStyle = t.filled ? '#bfa14a' : '#444';
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 4 * scaleX;
    ctx.strokeStyle = '#bfa14a';
    ctx.stroke();
    ctx.restore();
  }
  // Dibuja muebles
  for (const m of game.muebles) {
    ctx.save();
    ctx.fillStyle = m.color;
    ctx.shadowColor = '#bfa14a';
    ctx.shadowBlur = 12 * scaleX;
    ctx.fillRect(m.x * scaleX, m.y * scaleY, m.w * scaleX, m.h * scaleY);
    ctx.restore();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2 * scaleX;
    ctx.strokeRect(m.x * scaleX, m.y * scaleY, m.w * scaleX, m.h * scaleY);
    ctx.font = `${Math.round(1.1 * scaleY * 16)}px 'Playfair Display', serif`;
    ctx.fillStyle = "#fff";
    ctx.fillText("VORIA", (m.x + 10) * scaleX, (m.y + m.h / 2 + 6) * scaleY);
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
  // ¿Está sobre una zona objetivo?
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
  // ¿Juego terminado?
  if (game.muebles.every(m => m.placed)) {
    setTimeout(() => {
      // En vez de alert, sube de nivel y cambia posiciones
      if (typeof window.level === 'undefined') window.level = 2;
      else window.level++;
      if (document.getElementById('level')) {
        document.getElementById('level').textContent = 'Nivel: ' + window.level;
      }
      setupLevel();
    }, 600);
  }
}

// Iniciar juego al cargar la sección
document.addEventListener('DOMContentLoaded', () => {
  startVoriaGame();
});


document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById('musicToggleBtn');
  const player = document.getElementById('spotify-player-container');
  let visible = false;

  btn.addEventListener('click', function () {
    visible = !visible;
    player.style.display = visible ? 'block' : 'none';
    btn.classList.toggle('active', visible);
    btn.innerHTML = visible
      ? '<i class="fas fa-pause"></i> Música'
      : '<i class="fas fa-music"></i> Música';
  });
});