/* =============================================
   BETA SCIENTIFIC — SCRIPT
   ============================================= */

// ---- Google Apps Script endpoint ----
// Paste your deployed web app URL here after following google-apps-script.js setup steps.
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbuPQDCzlc383npaBHGi9oJ5FlHouqlhBrpz5qR1SodYt7Yo9pupEIhYXbwuPSDuBk/exec';

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
  parallax();
}, { passive: true });

// ---- Active nav ----
function updateActiveNav() {
  const ids = ['hero','services','about','process','contact'];
  const sy  = window.scrollY + 130;
  ids.forEach(id => {
    const sec  = document.getElementById(id);
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!sec || !link) return;
    const active = sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', active);
  });
}

// ---- Hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
  });
});

// ---- Parallax ----
function parallax() {
  const sy = window.scrollY;
  const heroImg = document.querySelector('.hero-img-frame img');
  if (heroImg) heroImg.style.transform = `scale(1.04) translateY(${sy * 0.06}px)`;

  const aboutImg = document.querySelector('.about-img-frame img');
  if (aboutImg) {
    const about = document.getElementById('about');
    if (about) {
      const rel = sy - about.offsetTop + window.innerHeight;
      aboutImg.style.transform = `scale(1.04) translateY(${rel * 0.04}px)`;
    }
  }
}

// ---- Scroll reveal ----
const revealConfig = [
  { sel: '.eyebrow',        cls: 's-up',    delay: 0   },
  { sel: '.sec-title',      cls: 's-up',    delay: 80  },
  { sel: '.sec-desc',       cls: 's-up',    delay: 160 },
  { sel: '.sec-desc-c',     cls: 's-up',    delay: 160 },
  { sel: '.bento-card',     cls: 's-up',    delay: 0   },
  { sel: '.stat-block',     cls: 's-scale', delay: 0   },
  { sel: '.process-card',   cls: 's-up',    delay: 0   },
  { sel: '.about-left',     cls: 's-left',  delay: 0   },
  { sel: '.about-right',    cls: 's-right', delay: 100 },
  { sel: '.contact-card',   cls: 's-up',    delay: 0   },
  { sel: '.cta-text',       cls: 's-left',  delay: 0   },
  { sel: '.cta-right',      cls: 's-right', delay: 100 },
];

revealConfig.forEach(({ sel, cls }) => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('s-hidden', cls));
});

// Sequential stagger for grouped items
const staggerGroups = ['.bento-card', '.stat-block', '.process-card', '.contact-card'];
staggerGroups.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => { el.dataset.delay = i * 80; });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('s-visible'), delay);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.s-hidden').forEach(el => observer.observe(el));

// ---- Counter animation ----
function counter(el, target, duration = 1400) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Hero stats
const heroStatObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.hstat-num').forEach(el => {
      counter(el, parseInt(el.dataset.target));
    });
    heroStatObserver.disconnect();
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats-row');
if (heroStats) heroStatObserver.observe(heroStats);

// Section stats
const sectionStatObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.stat-big').forEach(el => {
      counter(el, parseInt(el.dataset.target), 1600);
    });
    sectionStatObserver.disconnect();
  });
}, { threshold: 0.3 });
const statsSection = document.getElementById('stats');
if (statsSection) sectionStatObserver.observe(statsSection);

// ---- Bento card 3D tilt ----
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition = 'transform 0.08s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
  });
});

// ---- Magnetic CTA buttons ----
document.querySelectorAll('.btn-primary, .btn-dark, .btn-quote').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.14;
    const y = (e.clientY - r.top  - r.height / 2) * 0.2;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ---- Modal ----
const modal     = document.getElementById('quoteModal');
const modalClose= document.getElementById('modalClose');

function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const s = document.getElementById('formSuccess');
  const b = document.querySelector('#contactForm .btn-submit');
  const f = document.getElementById('contactForm');
  if (s) s.classList.remove('show');
  if (b) { b.style.display = ''; b.disabled = false; b.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>'; }
  if (f) f.reset();
  setTimeout(() => document.getElementById('name')?.focus(), 400);
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-modal').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openModal(); }));
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---- Form submit ----
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('.btn-submit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  // POST to Google Apps Script (fire-and-forget; no-cors means we can't read the response)
  if (SCRIPT_URL && SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        name:    document.getElementById('name')?.value    || '',
        phone:   document.getElementById('phone')?.value   || '',
        email:   document.getElementById('email')?.value   || '',
        company: document.getElementById('company')?.value || '',
        service: document.getElementById('service')?.value || '',
        message: document.getElementById('message')?.value || '',
        source:  'index'
      })
    }).catch(() => {});
  }

  setTimeout(() => {
    btn.style.display = 'none';
    success.classList.add('show');
    form.reset();
  }, 1200);
});
