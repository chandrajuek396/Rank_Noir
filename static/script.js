/* ══════════════════════════════════════
   RANKNOIR — script.js
   TensorStax-style interactions
   ══════════════════════════════════════ */

// ── Canvas Background ──
(function() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function mkP() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      size: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      op: Math.random() * 0.5 + 0.1,
      color: ['#5a4fcf','#3b7dd8','#e8532a','rgba(90,79,207,0.8)'][Math.floor(Math.random() * 4)]
    };
  }

  function init() { particles = Array.from({length: 50}, mkP); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.op; ctx.fill(); ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    // Subtle connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(90,79,207,0.06)'; ctx.globalAlpha = (1 - d/110) * 0.25; ctx.lineWidth = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize(); init(); draw();
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
})();

// ── Navbar ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  const s = hamburger.querySelectorAll('span');
  s[0].style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
  s[1].style.opacity = open ? '0' : '';
  s[2].style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

// ── Blob parallax ──
const blobs = document.querySelectorAll('.blob');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  blobs.forEach((b, i) => {
    const spd = 0.05 + i * 0.015;
    const dir = i % 2 === 0 ? 1 : -1;
    b.style.transform = `translateY(${y * spd * dir}px)`;
  });
}, { passive: true });

// ── Scroll Reveal ──
function setupReveal() {
  const sels = [
    '.step-block', '.feat-card', '.gs-card', '.sec-badge',
    '.faq-item', '.section-title', '.section-sub',
    '.step-h2', '.step-p', '.ui-card',
    '.feat-os-card', '.security-wrap', '.cta-h2',
    '.logo-badge', '.trust-label', '.trust-sub'
  ];
  document.querySelectorAll(sels.join(',')).forEach(el => {
    if (el.closest('.hero')) return;
    el.classList.add('reveal');
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Stagger cards
  ['feat-card', 'gs-card', 'sec-badge'].forEach(cls => {
    document.querySelectorAll('.' + cls).forEach((el, i) => { el.style.transitionDelay = `${i * 80}ms`; });
  });
  document.querySelectorAll('.step-block').forEach((el, i) => { el.style.transitionDelay = `${i * 60}ms`; });
}
setupReveal();

// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-q').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.classList.remove('open'); });
    if (!isOpen) { btn.setAttribute('aria-expanded', 'true'); btn.nextElementSibling.classList.add('open'); }
  });
});

// ── Form ──
function handleSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('.email-input');
  const btn = e.target.querySelector('button[type="submit"]');
  if (!input.value.trim()) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ You\'re on the list!';
  btn.style.background = '#2d8a4e';
  btn.style.animation = 'none';
  input.disabled = btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = orig; btn.style.background = btn.style.animation = '';
    input.disabled = btn.disabled = false; input.value = '';
  }, 4000);
}

// ── Score counter ──
function animCount(el, from, to, dur = 1400) {
  const start = performance.now();
  (function tick(t) {
    const p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const after = document.querySelector('.vsn.gold'), before = document.querySelector('.vscore.before .vsn');
let counted = false;
if (after && before) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !counted) { counted = true; animCount(before, 0, 42, 1000); animCount(after, 0, 92, 1600); }
  }, { threshold: 0.5 }).observe(after);
}

// ── Progress bar animate ──
const progressBar = document.querySelector('.uic-progress-bar');
if (progressBar) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { progressBar.style.width = '72%'; }
  }, { threshold: 0.4 }).observe(progressBar);
}

// ── Active nav ──
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-item');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navItems.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--white)' : '';
      });
    }
  });
}, { threshold: 0.4 }).observe(document.querySelector('section[id]') || document.body);

// ── Cursor glow ──
const glow = document.createElement('div');
Object.assign(glow.style, {
  position:'fixed',width:'250px',height:'250px',borderRadius:'50%',pointerEvents:'none',
  zIndex:'9999',background:'radial-gradient(circle,rgba(90,79,207,0.06) 0%,transparent 70%)',
  transform:'translate(-50%,-50%)',transition:'opacity 0.3s',opacity:'0'
});
document.body.appendChild(glow);
let mx=0, my=0, gx=0, gy=0, glowActive=false;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; if(!glowActive){glowActive=true;glow.style.opacity='1';loop();} });
document.addEventListener('mouseleave', () => { glow.style.opacity='0'; glowActive=false; });
function loop() {
  if(!glowActive) return;
  gx+=(mx-gx)*0.09; gy+=(my-gy)*0.09;
  glow.style.left=gx+'px'; glow.style.top=gy+'px';
  requestAnimationFrame(loop);
}

async function pollStream() {
  console.log("🔄 pollStream started");

  const interval = setInterval(async () => {
    try {
      const res = await fetch("/stream");
      const data = await res.json();
      console.log("📡 /stream response:", data);

      if (data.url) {
        clearInterval(interval);

        const frame = document.getElementById("agentFrame");
        if (!frame) return;

        frame.src = data.url;  // set once, iframe handles it natively
        document.getElementById("agentLoader")?.remove();
        console.log("🎥 Stream live!");
      }

    } catch (e) {
      console.error("❌ Polling error:", e);
    }

  }, 2000);
}

