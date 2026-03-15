// Kevin Elanjickal — 3D Hero Particle Network (Three.js)
// Gold particles connected by thin lines, reacting to mouse movement.
// Premium executive feel — subtle, not flashy.
(function () {
  'use strict';

  // Bail if Three.js not loaded or reduced motion preferred
  if (typeof THREE === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  // ---- Config ----
  var isMobile = window.innerWidth < 768;
  var PARTICLE_COUNT = isMobile ? 40 : 120;
  var CONNECTION_DISTANCE = isMobile ? 100 : 150;
  var MOUSE_INFLUENCE = 80; // how far mouse pushes particles
  var PARTICLE_SIZE = isMobile ? 1.5 : 2;
  var DRIFT_SPEED = 0.15; // base drift speed
  var GOLD = new THREE.Color(0xc9a96e);
  var GOLD_DIM = new THREE.Color(0x8a7044);

  // ---- Scene setup ----
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 300;

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: !isMobile,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // ---- Mouse tracking ----
  var mouse = { x: 0, y: 0, active: false };
  var mouseWorld = new THREE.Vector3(0, 0, 0);

  function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.active = true;

    // Project to world coords at z=0
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    mouseWorld = camera.position.clone().add(dir.multiplyScalar(distance));
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      var touch = e.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      mouse.active = true;

      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      var dir = vector.sub(camera.position).normalize();
      var distance = -camera.position.z / dir.z;
      mouseWorld = camera.position.clone().add(dir.multiplyScalar(distance));
    }
  }

  function onMouseLeave() {
    mouse.active = false;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  canvas.addEventListener('mouseleave', onMouseLeave);

  // ---- Create particles ----
  var spread = isMobile ? 200 : 350;
  var particlePositions = [];
  var particleVelocities = [];
  var particleGeometry = new THREE.BufferGeometry();
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var colors = new Float32Array(PARTICLE_COUNT * 3);

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var x = (Math.random() - 0.5) * spread * 2;
    var y = (Math.random() - 0.5) * spread * 1.2;
    var z = (Math.random() - 0.5) * 100;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    particlePositions.push({ x: x, y: y, z: z });
    particleVelocities.push({
      x: (Math.random() - 0.5) * DRIFT_SPEED,
      y: (Math.random() - 0.5) * DRIFT_SPEED,
      z: (Math.random() - 0.5) * DRIFT_SPEED * 0.3
    });

    // Vary gold tones slightly for depth
    var blend = Math.random() * 0.5;
    var c = GOLD.clone().lerp(GOLD_DIM, blend);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var particleMaterial = new THREE.PointsMaterial({
    size: PARTICLE_SIZE,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ---- Connection lines ----
  var MAX_LINES = isMobile ? 60 : 300;
  var linePositions = new Float32Array(MAX_LINES * 6);
  var lineColors = new Float32Array(MAX_LINES * 6);
  var lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  lineGeometry.setDrawRange(0, 0);

  var lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // ---- Animation loop ----
  var animationId;
  var isVisible = true;
  var clock = new THREE.Clock();

  function animate() {
    animationId = requestAnimationFrame(animate);
    if (!isVisible) return;

    var delta = clock.getDelta();
    // Cap delta to prevent jumps after tab switch
    if (delta > 0.1) delta = 0.016;

    var posArr = particleGeometry.attributes.position.array;

    // Update particle positions
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var p = particlePositions[i];
      var v = particleVelocities[i];

      // Base drift
      p.x += v.x;
      p.y += v.y;
      p.z += v.z;

      // Mouse repulsion (subtle push)
      if (mouse.active) {
        var dx = p.x - mouseWorld.x;
        var dy = p.y - mouseWorld.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_INFLUENCE && dist > 0) {
          var force = (1 - dist / MOUSE_INFLUENCE) * 0.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Soft boundary — wrap around
      if (p.x > spread) p.x = -spread;
      if (p.x < -spread) p.x = spread;
      if (p.y > spread * 0.7) p.y = -spread * 0.7;
      if (p.y < -spread * 0.7) p.y = spread * 0.7;
      if (p.z > 50) p.z = -50;
      if (p.z < -50) p.z = 50;

      posArr[i * 3] = p.x;
      posArr[i * 3 + 1] = p.y;
      posArr[i * 3 + 2] = p.z;
    }

    particleGeometry.attributes.position.needsUpdate = true;

    // Update connection lines
    var lineIdx = 0;
    var lp = lineGeometry.attributes.position.array;
    var lc = lineGeometry.attributes.color.array;

    for (var i = 0; i < PARTICLE_COUNT && lineIdx < MAX_LINES; i++) {
      for (var j = i + 1; j < PARTICLE_COUNT && lineIdx < MAX_LINES; j++) {
        var pi = particlePositions[i];
        var pj = particlePositions[j];
        var dx = pi.x - pj.x;
        var dy = pi.y - pj.y;
        var dz = pi.z - pj.z;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          var alpha = 1 - dist / CONNECTION_DISTANCE;
          // Gold color with distance-based fade
          var r = GOLD.r * alpha * 0.5;
          var g = GOLD.g * alpha * 0.5;
          var b = GOLD.b * alpha * 0.5;

          var base = lineIdx * 6;
          lp[base] = pi.x;
          lp[base + 1] = pi.y;
          lp[base + 2] = pi.z;
          lp[base + 3] = pj.x;
          lp[base + 4] = pj.y;
          lp[base + 5] = pj.z;

          lc[base] = r;
          lc[base + 1] = g;
          lc[base + 2] = b;
          lc[base + 3] = r;
          lc[base + 4] = g;
          lc[base + 5] = b;

          lineIdx++;
        }
      }
    }

    lineGeometry.setDrawRange(0, lineIdx * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    // Gentle camera sway based on mouse for parallax depth
    if (mouse.active) {
      camera.position.x += (mouse.x * 15 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 10 - camera.position.y) * 0.02;
    } else {
      camera.position.x += (0 - camera.position.x) * 0.01;
      camera.position.y += (0 - camera.position.y) * 0.01;
    }
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // ---- Pause when not visible ----
  document.addEventListener('visibilitychange', function () {
    isVisible = !document.hidden;
    if (isVisible) clock.getDelta(); // reset delta
  });

  // Also pause when hero is scrolled out of view
  if ('IntersectionObserver' in window) {
    var heroSection = document.getElementById('hero');
    if (heroSection) {
      var heroObserver = new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting && !document.hidden;
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
    }
  }

  // ---- Resize ----
  window.addEventListener('resize', function () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
