// Kevin Elanjickal — Premium Portfolio JS (Vanilla IntersectionObserver)
(function () {
  'use strict';

  // ==================== REDUCED MOTION CHECK ====================
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // ==================== SCROLL REVEAL (IntersectionObserver) ====================
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var isMobile = window.innerWidth <= 900;

    // Strategy: only hide top-level .reveal elements and direct children of .reveal-stagger.
    // Do NOT double-hide children inside already-hidden parents.

    // 1. Hide all .reveal elements (these are containers like section-header, about-grid, timeline, etc.)
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('reveal-hidden');
    });

    // 2. Hide children of .reveal-stagger with stagger delay
    //    (.reveal-stagger itself is NOT hidden — only its children animate in)
    document.querySelectorAll('.reveal-stagger').forEach(function (parent) {
      var children = parent.children;
      for (var i = 0; i < children.length; i++) {
        children[i].classList.add('reveal-hidden');
        children[i].style.transitionDelay = (i * 0.1) + 's';
      }
    });

    // 3. About section: directional slide for photo/bio (desktop only)
    //    about-grid has .reveal so it's already hidden. We add direction classes
    //    so when it reveals, the transform is from-left/from-right instead of translateY.
    if (!isMobile) {
      var aboutGrid = document.querySelector('.about-grid.reveal-hidden');
      if (aboutGrid) {
        // Don't hide aboutGrid itself — instead hide photo and bio separately for direction
        aboutGrid.classList.remove('reveal-hidden');
        var aboutPhoto = aboutGrid.querySelector('.about-photo');
        var aboutBio = aboutGrid.querySelector('.about-bio');
        if (aboutPhoto) {
          aboutPhoto.classList.add('reveal-hidden', 'from-left');
        }
        if (aboutBio) {
          aboutBio.classList.add('reveal-hidden', 'from-right');
          aboutBio.style.transitionDelay = '0.15s';
        }
      }
    }

    // Create the observer
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    // Observe all hidden elements
    document.querySelectorAll('.reveal-hidden').forEach(function (el) {
      revealObserver.observe(el);
    });

  } else {
    // Reduced motion or no IntersectionObserver: everything stays visible (default)
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

  // ==================== PHASE 5: SHIMMER ON SECTION HEADERS ====================
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Add shimmer-text class to all section header h2 elements
    document.querySelectorAll('.section-header h2').forEach(function (h2) {
      h2.classList.add('shimmer-text');
    });

    var shimmerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Small delay so reveal animation plays first
          setTimeout(function () {
            entry.target.classList.add('shimmer-active');
          }, 600);
          shimmerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.shimmer-text').forEach(function (el) {
      shimmerObserver.observe(el);
    });
  }

  // ==================== COUNTER ANIMATION ====================
  var counters = document.querySelectorAll('.stat-num');
  if (counters.length && 'IntersectionObserver' in window) {
    // Store original target values before any animation changes them
    counters.forEach(function (el) {
      el.setAttribute('data-target', el.textContent.trim());
    });
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
    }, { threshold: 0.1 });
    counters.forEach(function (el) { counterObserver.observe(el); });

    // Fallback: after 3 seconds, force counters to their target values
    setTimeout(function () {
      counters.forEach(function (el) {
        var target = el.getAttribute('data-target');
        if (target) {
          el.textContent = target;
        }
      });
    }, 3000);
  }

  // ==================== PHASE 3: INTERACTIVE CARDS ====================

  // --- Touch device detection ---
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // --- 3D Tilt on Leader Cards (desktop only) ---
  if (!isTouchDevice && !prefersReducedMotion) {
    document.querySelectorAll('.leader-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.classList.add('tilt-active');
      });
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -8;
        var rotateY = (x - centerX) / centerX * 8;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('tilt-active');
        card.style.transform = '';
      });
    });
  }

  // --- Timeline: click-to-expand ---
  document.querySelectorAll('.timeline-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      // Don't toggle if clicking a link inside the timeline item
      if (e.target.closest('a')) return;
      item.classList.toggle('expanded');
    });
  });

  // --- Education cards: floating animation (activate when in viewport) ---
  var eduCards = document.querySelectorAll('.edu-card');
  if (eduCards.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var floatObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('floating');
        } else {
          entry.target.classList.remove('floating');
        }
      });
    }, { threshold: 0.2 });
    eduCards.forEach(function (card) { floatObserver.observe(card); });
  }

  // ==================== HERO PARALLAX (handled by hero.js WebGL) ====================

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

  // ==================== PHASE 4: CUSTOM CURSOR ====================
  var cursorDot = document.getElementById('cursorDot');
  var cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && !isTouchDevice && !prefersReducedMotion) {
    document.body.classList.add('has-custom-cursor');

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var cursorVisible = false;

    // Track mouse position
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Position dot immediately (no lag)
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';

      if (!cursorVisible) {
        cursorVisible = true;
        cursorDot.classList.add('visible');
        cursorRing.classList.add('visible');
        ringX = mouseX;
        ringY = mouseY;
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      cursorDot.classList.remove('visible');
      cursorRing.classList.remove('visible');
      cursorVisible = false;
    });
    document.addEventListener('mouseenter', function () {
      cursorDot.classList.add('visible');
      cursorRing.classList.add('visible');
      cursorVisible = true;
    });

    // Click feedback
    document.addEventListener('mousedown', function () {
      cursorDot.classList.add('clicking');
      cursorRing.classList.add('clicking');
    });
    document.addEventListener('mouseup', function () {
      cursorDot.classList.remove('clicking');
      cursorRing.classList.remove('clicking');
    });

    // Hover detection for interactive elements
    var hoverTargets = 'a, button, .leader-card, .timeline-item, .beyond-card, .edu-card, .tech-card, .research-card, .pill, .cred-badge, .social-link, .btn, .nav-toggle, .scroll-top, input, textarea, .scroll-indicator';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverTargets)) {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverTargets)) {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      }
    });

    // Ring follows with lerp (lag effect) via requestAnimationFrame
    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

  } else if (cursorDot && cursorRing) {
    // Touch device or reduced motion — hide cursors, add touch class
    document.body.classList.add('touch-device');
  }

  // ==================== PHASE 4: NAV INDICATOR & ACTIVE SECTION ====================
  var navLinksContainer = document.querySelector('.nav-links');
  var navIndicator = document.querySelector('.nav-indicator');
  var navAnchors = navLinksContainer ? navLinksContainer.querySelectorAll('a[href^="#"]') : [];
  var sections = ['about', 'experience', 'beyond', 'education', 'contact'];

  function moveIndicator(link) {
    if (!navIndicator || !link || !navLinksContainer) return;
    var linkRect = link.getBoundingClientRect();
    var containerRect = navLinksContainer.getBoundingClientRect();
    navIndicator.style.left = (linkRect.left - containerRect.left) + 'px';
    navIndicator.style.width = linkRect.width + 'px';
    navIndicator.classList.add('active');
  }

  function clearIndicator() {
    if (!navIndicator) return;
    navIndicator.classList.remove('active');
    navAnchors.forEach(function (a) { a.classList.remove('active'); });
  }

  function updateActiveSection() {
    if (window.innerWidth <= 768) return; // no indicator on mobile

    var scrollY = window.scrollY;
    var navH = nav ? nav.offsetHeight : 0;
    var activeId = null;

    // If at the top (hero), clear indicator
    if (scrollY < 300) {
      clearIndicator();
      return;
    }

    // Find which section is in view
    for (var i = sections.length - 1; i >= 0; i--) {
      var sec = document.getElementById(sections[i]);
      if (sec) {
        var top = sec.offsetTop - navH - 100;
        if (scrollY >= top) {
          activeId = sections[i];
          break;
        }
      }
    }

    if (activeId) {
      navAnchors.forEach(function (a) {
        var href = a.getAttribute('href');
        if (href === '#' + activeId) {
          a.classList.add('active');
          moveIndicator(a);
        } else {
          a.classList.remove('active');
        }
      });
    } else {
      clearIndicator();
    }
  }

  // Listen to scroll for active section updates
  window.addEventListener('scroll', updateActiveSection, { passive: true });

  // Update indicator on nav link click
  navAnchors.forEach(function (a) {
    a.addEventListener('click', function () {
      var self = a;
      // Delay to let scroll happen
      setTimeout(function () { moveIndicator(self); }, 100);
    });
  });

  // Recalculate on resize
  window.addEventListener('resize', function () {
    var activeLink = navLinksContainer ? navLinksContainer.querySelector('a.active') : null;
    if (activeLink) {
      moveIndicator(activeLink);
    }
  });

  // Initial check
  updateActiveSection();

  // ==================== DETAIL PAGE NAV ====================
  if (document.querySelector('.detail-hero')) {
    if (nav) nav.classList.add('scrolled');
  }
})();
