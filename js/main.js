// Kevin Elanjickal — Premium Portfolio JS
(function () {
  'use strict';

  // ==================== NAV SCROLL ====================
  var nav = document.querySelector('.nav');
  if (nav) {
    var handleScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ==================== MOBILE MENU OVERLAY ====================
  var toggle = document.querySelector('.nav-toggle');
  var overlay = document.querySelector('.nav-overlay');
  if (toggle && overlay) {
    toggle.addEventListener('click', function () {
      var isActive = toggle.classList.toggle('active');
      overlay.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ==================== SCROLL REVEAL ====================
  var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reveals.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ==================== TYPING EFFECT ====================
  var typedEl = document.querySelector('.hero-typed');
  if (typedEl) {
    var strings = ['Entrepreneur', 'Strategic Leadership', 'Digital Transformation'];
    var idx = 0;
    var charIdx = 0;
    var deleting = false;
    var speed = 80;

    var typeTimer = null;

    function type() {
      var current = strings[idx];
      if (deleting) {
        charIdx--;
        speed = 35;
      } else {
        charIdx++;
        speed = 80;
      }

      typedEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor"></span>';

      if (!deleting && charIdx === current.length) {
        speed = 2000;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % strings.length;
        speed = 500;
      }

      typeTimer = setTimeout(type, speed);
    }
    type();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(typeTimer);
      } else {
        typeTimer = setTimeout(type, speed);
      }
    });
  }

  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navH = nav ? nav.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ==================== COUNTER ANIMATION ====================
  var counters = document.querySelectorAll('.stat-num');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var text = el.textContent.trim();
          var match = text.match(/^(\d+)(.*)$/);
          if (!match) return;
          var target = parseInt(match[1], 10);
          var suffix = match[2];
          var duration = 1500;
          var start = 0;
          var startTime = null;

          function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = target + suffix;
            }
          }
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  // ==================== HERO PARALLAX ====================
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px) scale(1.1)';
      }
    }, { passive: true });
  }

  // ==================== SCROLL TO TOP ====================
  var scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', function () {
    scrollBtn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==================== DETAIL PAGE NAV ====================
  if (document.querySelector('.detail-hero')) {
    if (nav) nav.classList.add('scrolled');
  }
})();
