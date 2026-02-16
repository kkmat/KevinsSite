// Kevin Elanjickal — vanilla JS
(function () {
  'use strict';

  // Navbar scroll behaviour
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
    // Trigger on load for detail pages
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }

  // Mobile menu toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  // Scroll reveal (Intersection Observer)
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Typing effect
  var typedEl = document.querySelector('.hero-typed');
  if (typedEl) {
    var strings = ['Entrepreneur', 'Strategic Leadership', 'Digital Transformation'];
    var idx = 0;
    var charIdx = 0;
    var deleting = false;
    var speed = 80;

    function type() {
      var current = strings[idx];
      if (deleting) {
        charIdx--;
        speed = 30;
      } else {
        charIdx++;
        speed = 80;
      }

      typedEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor"></span>';

      if (!deleting && charIdx === current.length) {
        speed = 1500;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % strings.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }
    type();
  }

  // Smooth scroll for anchor links
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

  // Accordion
  document.querySelectorAll('.accordion-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.toggle('open');
      var content = btn.nextElementSibling;
      if (btn.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // Detail pages: force scrolled nav on load
  if (document.querySelector('.detail-hero')) {
    if (nav) nav.classList.add('scrolled');
  }
})();
