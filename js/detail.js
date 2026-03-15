// Kevin Elanjickal — Detail Page Enhancements (No GSAP — CSS animations only)
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==================== READING PROGRESS BAR ====================
  var progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar) {
    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ==================== CUSTOM CURSOR ====================
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    // Touch device detection
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.add('has-custom-cursor');
      var mouseX = 0, mouseY = 0;
      var ringX = 0, ringY = 0;

      document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        dot.classList.add('visible');
        ring.classList.add('visible');
      });

      // Smooth ring follow
      var animateRing = function () {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
      };
      animateRing();

      // Hover state on interactive elements
      var hoverTargets = document.querySelectorAll('a, button, .detail-nav-back, .detail-nav-links a, .back-link, .nav-brand, .nav-toggle');
      hoverTargets.forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          dot.classList.add('hovering');
          ring.classList.add('hovering');
        });
        el.addEventListener('mouseleave', function () {
          dot.classList.remove('hovering');
          ring.classList.remove('hovering');
        });
      });

      // Click state
      document.addEventListener('mousedown', function () {
        dot.classList.add('clicking');
        ring.classList.add('clicking');
      });
      document.addEventListener('mouseup', function () {
        dot.classList.remove('clicking');
        ring.classList.remove('clicking');
      });
    }
  }

  // ==================== PAGE EXIT TRANSITION ====================
  // Fade out when clicking internal links
  var internalLinks = document.querySelectorAll('a[href]:not([href^="http"]):not([href^="mailto"]):not([href^="tel"]):not([href^="#"])');
  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(function () {
        window.location.href = href;
      }, 300);
    });
  });

  // ==================== CSS-BASED ENTRANCE ANIMATIONS ====================
  if (!prefersReducedMotion) {
    // Hero title and breadcrumb animate via CSS @keyframes (added in style.css)
    // For content elements, just make them visible immediately (short pages)
    // The page-enter animation on body.detail-page handles the overall entrance
  }

})();
