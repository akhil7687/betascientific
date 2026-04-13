/* =============================================
   BETA SCIENTIFIC — REACH-US LANDING PAGE SCRIPT
   Stripped-down: no navbar/hamburger/modal logic.
   ============================================= */

// ---- Google Apps Script endpoint ----
// Paste your deployed web app URL here after following google-apps-script.js setup steps.
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbuPQDCzlc383npaBHGi9oJ5FlHouqlhBrpz5qR1SodYt7Yo9pupEIhYXbwuPSDuBk/exec';

// ---- Counter animation ----
function counter(el, target, duration) {
  duration = duration || 1400;
  var start = 0;
  var step = target / (duration / 16);
  function tick() {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---- Hero stats counter (.lp-stats-row) ----
var heroStatObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.hstat-num').forEach(function(el) {
      counter(el, parseInt(el.dataset.target));
    });
    heroStatObserver.disconnect();
  });
}, { threshold: 0.5 });

var heroStats = document.querySelector('.lp-stats-row');
if (heroStats) heroStatObserver.observe(heroStats);

// ---- Section stats counter (#lp-stats) ----
var sectionStatObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    document.querySelectorAll('#lp-stats .stat-big').forEach(function(el) {
      counter(el, parseInt(el.dataset.target), 1600);
    });
    sectionStatObserver.disconnect();
  });
}, { threshold: 0.3 });

var statsSection = document.getElementById('lp-stats');
if (statsSection) sectionStatObserver.observe(statsSection);

// ---- Scroll reveal ----
var revealConfig = [
  { sel: '.eyebrow',              cls: 's-up'    },
  { sel: '.sec-title',            cls: 's-up'    },
  { sel: '.sec-desc',             cls: 's-up'    },
  { sel: '.sec-desc-c',           cls: 's-up'    },
  { sel: '.lp-why-card',          cls: 's-up'    },
  { sel: '.bento-card',           cls: 's-up'    },
  { sel: '.lp-testimonial-card',  cls: 's-scale' },
  { sel: '.cta-text',             cls: 's-left'  },
  { sel: '.cta-right',            cls: 's-right' },
];

revealConfig.forEach(function(cfg) {
  document.querySelectorAll(cfg.sel).forEach(function(el) {
    el.classList.add('s-hidden', cfg.cls);
  });
});

// Stagger for grouped elements
['.lp-why-card', '.bento-card'].forEach(function(sel) {
  document.querySelectorAll(sel).forEach(function(el, i) {
    el.dataset.delay = i * 80;
  });
});

var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (!entry.isIntersecting) return;
    var delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(function() {
      entry.target.classList.add('s-visible');
    }, delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.s-hidden').forEach(function(el) {
  revealObserver.observe(el);
});

// ---- Bento card 3D tilt ----
document.querySelectorAll('.bento-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width  - 0.5;
    var y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = 'translateY(-5px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)';
    card.style.transition = 'transform 0.08s ease';
  });
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
  });
});

// ---- Magnetic buttons ----
document.querySelectorAll('.btn-primary, .btn-dark, .lp-phone-cta').forEach(function(btn) {
  btn.addEventListener('mousemove', function(e) {
    var r = btn.getBoundingClientRect();
    var x = (e.clientX - r.left - r.width  / 2) * 0.14;
    var y = (e.clientY - r.top  - r.height / 2) * 0.2;
    btn.style.transform = 'translate(' + x + 'px, ' + y + 'px) translateY(-2px)';
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = '';
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

// ---- Inline form submit ----
var lpForm    = document.getElementById('lpForm');
var lpSuccess = document.getElementById('lpFormSuccess');

if (lpForm) {
  lpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate required fields
    var requiredIds = ['lp-name', 'lp-phone', 'lp-email'];
    var valid = true;
    requiredIds.forEach(function(id) {
      var input = document.getElementById(id);
      if (!input) return;
      if (!input.value.trim()) {
        input.classList.add('lp-error');
        valid = false;
      } else {
        input.classList.remove('lp-error');
      }
    });
    if (!valid) return;

    var btn = lpForm.querySelector('.btn-submit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending\u2026';

    // POST to Google Apps Script (fire-and-forget; no-cors means we can't read the response)
    if (SCRIPT_URL && SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          name:    document.getElementById('lp-name').value,
          phone:   document.getElementById('lp-phone').value,
          email:   document.getElementById('lp-email').value,
          service: document.getElementById('lp-service').value,
          message: document.getElementById('lp-message').value,
          source:  'reach-us'
        })
      }).catch(function() {});
    }

    setTimeout(function() {
      btn.style.display = 'none';
      if (lpSuccess) lpSuccess.classList.add('show');
      lpForm.reset();
    }, 1200);
  });

  // Clear error on input
  lpForm.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('input', function() {
      input.classList.remove('lp-error');
    });
  });
}

// ---- Mobile sticky bar: hide when form panel is visible ----
var mobileBar   = document.getElementById('lp-mobile-bar');
var lpFormPanel = document.querySelector('.lp-form-panel');

if (mobileBar && lpFormPanel) {
  var barObserver = new IntersectionObserver(function(entries) {
    mobileBar.style.display = entries[0].isIntersecting ? 'none' : '';
  }, { threshold: 0.3 });
  barObserver.observe(lpFormPanel);
}
