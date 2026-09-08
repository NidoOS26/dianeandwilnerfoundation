(function () {
  'use strict';

  /* Theme toggle */
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function setToggleIcon() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML =
      theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  setToggleIcon();
  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      setToggleIcon();
    });
  }

  /* Mobile nav */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Header hide on scroll down */
  var header = document.querySelector('[data-site-header]');
  var lastY = window.scrollY;
  window.addEventListener(
    'scroll',
    function () {
      var y = window.scrollY;
      if (header) {
        if (y > lastY && y > 140) {
          header.classList.add('site-header--hidden');
        } else {
          header.classList.remove('site-header--hidden');
        }
        header.classList.toggle('site-header--scrolled', y > 10);
      }
      lastY = y;
    },
    { passive: true }
  );

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* Video-frame click-to-play */
  document.querySelectorAll('[data-video-frame]').forEach(function (frame) {
    var video = frame.querySelector('video');
    frame.addEventListener('click', function () {
      if (!video) return;
      if (video.paused) {
        video.muted = false;
        video.play();
        frame.classList.add('is-playing');
      } else {
        video.pause();
        frame.classList.remove('is-playing');
      }
    });
    if (video) {
      video.addEventListener('ended', function () {
        frame.classList.remove('is-playing');
      });
    }
  });

  /* Giving frequency toggle (visual only) */
  var freqToggle = document.querySelector('[data-giving-toggle]');
  if (freqToggle) {
    var buttons = freqToggle.querySelectorAll('button');
    var monthlyNotes = document.querySelectorAll('[data-freq-note]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        var mode = btn.getAttribute('data-freq');
        monthlyNotes.forEach(function (note) {
          note.textContent = mode === 'monthly' ? note.getAttribute('data-monthly') : note.getAttribute('data-once');
        });
      });
    });
  }

  /* Contact form — friendly demo submit (no backend configured yet) */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('[data-form-status]');
      if (status) {
        status.textContent = 'Thank you — your message has been noted. We will reach out soon.';
        status.hidden = false;
      }
      form.reset();
    });
  }

  /* FAQ: only one open at a time on desktop-ish niceness (optional) */
})();
