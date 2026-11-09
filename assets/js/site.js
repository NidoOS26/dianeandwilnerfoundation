(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-site-nav]');
  const main = document.getElementById('main-content');

  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('nav-open', open);
    if (restoreFocus) menuButton.focus();
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      setMenu(false);
      if (main) main.focus();
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
  }

  const video = document.getElementById('foundation-video');
  const videoToggle = document.querySelector('[data-video-toggle]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setVideoState(shouldPlay) {
    if (!video || !videoToggle) return;
    if (shouldPlay) {
      video.play().catch(() => {});
      videoToggle.textContent = 'Pause background video';
      videoToggle.setAttribute('aria-pressed', 'false');
    } else {
      video.pause();
      videoToggle.textContent = 'Play background video';
      videoToggle.setAttribute('aria-pressed', 'true');
    }
  }

  if (video && videoToggle) {
    if (reducedMotion.matches) setVideoState(false);
    videoToggle.addEventListener('click', () => setVideoState(video.paused));
    reducedMotion.addEventListener('change', (event) => setVideoState(!event.matches));
  }

  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('[data-slide]')];
    const stage = carousel.closest('.carousel-stage');
    const dots = [...stage.querySelectorAll('[data-carousel-dot]')];
    const toggle = stage.querySelector('[data-carousel-toggle]');
    let current = 0;
    let timer;
    let manuallyPaused = false;

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        const active = position === current;
        slide.hidden = !active;
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, position) => dot.setAttribute('aria-pressed', String(position === current)));
    }

    function stopCarousel() {
      window.clearInterval(timer);
    }

    function startCarousel() {
      stopCarousel();
      if (!reducedMotion.matches && !manuallyPaused) timer = window.setInterval(() => setSlide(current + 1), 6000);
    }

    function setCarouselPaused(paused) {
      manuallyPaused = paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Play carousel' : 'Pause carousel');
      toggle.textContent = paused ? '▶' : 'Ⅱ';
      if (paused) stopCarousel(); else startCarousel();
    }

    dots.forEach((dot, position) => dot.addEventListener('click', () => {
      setSlide(position);
      startCarousel();
    }));
    toggle.addEventListener('click', () => setCarouselPaused(!manuallyPaused));
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') setSlide(current - 1);
      if (event.key === 'ArrowRight') setSlide(current + 1);
    });
    stage.addEventListener('mouseenter', stopCarousel);
    stage.addEventListener('mouseleave', startCarousel);
    stage.addEventListener('focusin', stopCarousel);
    stage.addEventListener('focusout', (event) => {
      if (!stage.contains(event.relatedTarget)) startCarousel();
    });
    reducedMotion.addEventListener('change', startCarousel);
    setSlide(0);
    startCarousel();
  }

})();
