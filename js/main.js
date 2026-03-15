// Kevin Elanjickal — Premium Portfolio JS (Phase 2: GSAP ScrollTrigger)
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

  // ==================== GSAP SCROLL ANIMATIONS ====================
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // --- Helper: check if mobile ---
    var isMobile = function () { return window.innerWidth <= 900; };

    // --- About section: photo from left, text from right ---
    var aboutPhoto = document.querySelector('.about-photo');
    var aboutBio = document.querySelector('.about-bio');
    var aboutGrid = document.querySelector('.about-grid');
    if (aboutGrid) {
      // Animate the parent .about-grid (which has .reveal) header first
      var aboutHeader = document.querySelector('#about .section-header');
      if (aboutHeader) {
        gsap.from(aboutHeader, {
          opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: aboutHeader, start: 'top 85%', once: true }
        });
      }
      if (aboutPhoto) {
        gsap.from(aboutPhoto, {
          opacity: 0, x: isMobile() ? 0 : -80, y: isMobile() ? 40 : 0,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: aboutGrid, start: 'top 80%', once: true }
        });
      }
      if (aboutBio) {
        gsap.from(aboutBio, {
          opacity: 0, x: isMobile() ? 0 : 80, y: isMobile() ? 40 : 0,
          duration: 1, delay: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: aboutGrid, start: 'top 80%', once: true }
        });
      }
      // Mark as handled so generic handler skips it
      aboutGrid.classList.add('gsap-handled');
      if (aboutHeader) aboutHeader.classList.add('gsap-handled');
    }

    // --- Stats strip ---
    var statsStrip = document.querySelector('.stats-strip');
    if (statsStrip) {
      gsap.from(statsStrip, {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: statsStrip, start: 'top 85%', once: true }
      });
      statsStrip.classList.add('gsap-handled');
    }

    // --- Leader cards: staggered cascade from bottom with rotation ---
    var leaderCards = document.querySelectorAll('.leader-card');
    if (leaderCards.length) {
      gsap.from(leaderCards, {
        opacity: 0, y: 60, rotation: isMobile() ? 0 : 3,
        duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: leaderCards[0].parentElement,
          start: 'top 80%',
          once: true
        }
      });
      var leaderParent = leaderCards[0].parentElement;
      if (leaderParent) leaderParent.classList.add('gsap-handled');
    }

    // --- Timeline items: alternating left/right ---
    var timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
      timelineItems.forEach(function (item, i) {
        var fromLeft = i % 2 === 0;
        gsap.from(item, {
          opacity: 0,
          x: isMobile() ? 0 : (fromLeft ? -50 : 50),
          y: isMobile() ? 30 : 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
          }
        });
      });
    }

    // --- Beyond Work: parallax background layer ---
    var beyondSection = document.getElementById('beyond');
    if (beyondSection) {
      // Insert parallax background div
      var parallaxBg = document.createElement('div');
      parallaxBg.className = 'beyond-parallax-bg';
      beyondSection.insertBefore(parallaxBg, beyondSection.firstChild);

      gsap.to(parallaxBg, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: beyondSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Beyond featured: fade in with scale
      var beyondFeatured = document.querySelector('.beyond-featured');
      if (beyondFeatured) {
        gsap.from(beyondFeatured, {
          opacity: 0, y: 50, scale: 0.97, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: beyondFeatured, start: 'top 82%', once: true }
        });
        beyondFeatured.classList.add('gsap-handled');
      }

      // Beyond cards: staggered with slight scale
      var beyondCards = document.querySelectorAll('.beyond-card');
      if (beyondCards.length) {
        gsap.from(beyondCards, {
          opacity: 0, y: 40, scale: 0.95,
          duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: {
            trigger: beyondCards[0].parentElement,
            start: 'top 82%',
            once: true
          }
        });
        var beyondParent = beyondCards[0].parentElement;
        if (beyondParent) beyondParent.classList.add('gsap-handled');
      }

      // Beyond card images: parallax zoom on scroll
      beyondCards.forEach(function (card) {
        var img = card.querySelector('.beyond-card-img');
        if (img) {
          gsap.to(img, {
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      });
    }

    // --- Education cards: 3D flip-in from perspective ---
    var eduCards = document.querySelectorAll('.edu-card');
    if (eduCards.length) {
      gsap.from(eduCards, {
        opacity: 0, rotateX: isMobile() ? 0 : -60, y: 40,
        duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: eduCards[0].parentElement,
          start: 'top 82%',
          once: true
        }
      });
      var eduParent = eduCards[0].parentElement;
      if (eduParent) eduParent.classList.add('gsap-handled');
    }

    // --- DBA callout ---
    var dbaCallout = document.querySelector('.dba-callout');
    if (dbaCallout) {
      gsap.from(dbaCallout, {
        opacity: 0, y: 40, scale: 0.97, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: dbaCallout, start: 'top 85%', once: true }
      });
      dbaCallout.classList.add('gsap-handled');
    }

    // --- Credential badges: stagger ---
    var credBadges = document.querySelector('.cred-badges');
    if (credBadges) {
      var badges = credBadges.querySelectorAll('.cred-badge');
      gsap.from(badges, {
        opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: credBadges, start: 'top 85%', once: true }
      });
      credBadges.classList.add('gsap-handled');
    }

    // --- Research cards: stagger ---
    var researchCards = document.querySelectorAll('.research-card');
    if (researchCards.length) {
      gsap.from(researchCards, {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: researchCards[0].parentElement,
          start: 'top 82%',
          once: true
        }
      });
      var researchParent = researchCards[0].parentElement;
      if (researchParent) researchParent.classList.add('gsap-handled');
    }

    // --- Horizontal scroll for tech cards (desktop only) ---
    var techScrollSection = document.querySelector('.tech-scroll-section');
    var techScrollTrack = document.querySelector('.tech-scroll-track');
    if (techScrollSection && techScrollTrack && !isMobile()) {
      // Calculate how far to scroll horizontally
      var setupHorizontalScroll = function () {
        // Kill previous ScrollTrigger if it exists
        ScrollTrigger.getAll().forEach(function (st) {
          if (st.vars && st.vars.id === 'techHScroll') st.kill();
        });

        var trackWidth = techScrollTrack.scrollWidth;
        var sectionWidth = techScrollSection.offsetWidth;
        var scrollDistance = trackWidth - sectionWidth;

        if (scrollDistance > 0) {
          gsap.to(techScrollTrack, {
            x: -scrollDistance,
            ease: 'none',
            scrollTrigger: {
              id: 'techHScroll',
              trigger: techScrollSection,
              start: 'top 60%',
              end: function () { return '+=' + scrollDistance; },
              pin: false,
              scrub: 1
            }
          });
        }
      };
      // Delay setup slightly so layout is settled
      setTimeout(setupHorizontalScroll, 100);
    } else if (techScrollSection && isMobile()) {
      // On mobile, just fade in the cards staggered
      var mobileCards = techScrollSection.querySelectorAll('.tech-card');
      if (mobileCards.length) {
        gsap.from(mobileCards, {
          opacity: 0, y: 30, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: techScrollSection,
            start: 'top 82%',
            once: true
          }
        });
      }
    }

    // Tech cards on desktop: also fade them in
    if (techScrollSection && !isMobile()) {
      var deskCards = techScrollSection.querySelectorAll('.tech-card');
      if (deskCards.length) {
        gsap.from(deskCards, {
          opacity: 0, y: 30, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: techScrollSection,
            start: 'top 82%',
            once: true
          }
        });
      }
    }

    // --- Section numbers: parallax (move slower than scroll) ---
    document.querySelectorAll('.section-number').forEach(function (num) {
      gsap.to(num, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: num.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // --- Generic fallback: any .reveal or .reveal-stagger not yet handled ---
    document.querySelectorAll('.reveal:not(.gsap-handled)').forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
    document.querySelectorAll('.reveal-stagger:not(.gsap-handled)').forEach(function (parent) {
      var children = parent.children;
      if (children.length) {
        gsap.from(children, {
          opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: parent, start: 'top 85%', once: true }
        });
      }
    });

    // --- Footer reveals ---
    var footerReveals = document.querySelectorAll('.footer .reveal');
    footerReveals.forEach(function (el) {
      // These may already be handled by generic fallback, but ensure they work
      el.classList.add('gsap-handled');
    });

  } else {
    // GSAP not available or reduced motion: make everything visible immediately
    document.querySelectorAll('.reveal, .reveal-stagger, .reveal-stagger > *').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
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

  // ==================== DETAIL PAGE NAV ====================
  if (document.querySelector('.detail-hero')) {
    if (nav) nav.classList.add('scrolled');
  }
})();
