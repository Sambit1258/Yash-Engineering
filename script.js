/* ═══════════════════════════════════════
   NAVBAR — Sticky scroll + mobile menu
═══════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

function openMenu() {
  hamburger.classList.add('open');
  navMenu.classList.add('open');
  navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ═══════════════════════════════════════
   HERO SLIDER
═══════════════════════════════════════ */
(function () {
  const slides      = document.querySelectorAll('.hero__slide');
  const dots        = document.querySelectorAll('.hero__dot');
  const progressBar = document.getElementById('heroProgress');
  const prevBtn     = document.getElementById('heroPrev');
  const nextBtn     = document.getElementById('heroNext');

  const SLIDE_DURATION = 5000; // ms per slide

  let current   = 0;
  let timer     = null;
  let progTimer = null;

  function goTo(index) {
    // Remove active from current
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');

    restartProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, SLIDE_DURATION);
  }

  function restartProgress() {
    clearTimeout(progTimer);
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      // Force reflow
      progressBar.offsetWidth;
      progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  // Arrow controls
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

  // Dot controls
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Pause on hover
  const sliderEl = document.getElementById('heroSlider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
    sliderEl.addEventListener('mouseleave', () => startAuto());
  }

  // Touch / swipe support
  let touchStartX = 0;
  document.querySelector('.hero').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  document.querySelector('.hero').addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      startAuto();
    }
  }, { passive: true });

  // Init
  startAuto();
  restartProgress();
})();

/* ═══════════════════════════════════════
   PRODUCTS — mobile view more
═══════════════════════════════════════ */
function toggleProducts() {
  const hidden = document.querySelectorAll('.prod-card--hidden-mobile');
  const btn    = document.getElementById('viewMoreBtn');
  const expanded = btn.classList.toggle('expanded');
  hidden.forEach(c => c.classList.toggle('visible-mobile', expanded));
  btn.innerHTML = expanded
    ? 'Show Less <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>'
    : 'View More Products <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
}
