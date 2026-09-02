/* ============================================
   MULTIVERSO IA — main.js
   ============================================ */

/* ---------- Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Header scroll ---------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Hero canvas: node network ---------- */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, nodes, animFrame;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function createNodes() {
    const count = Math.floor((width * height) / 18000);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.6,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Connections
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 0.6;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function update() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }
  }

  function loop() {
    if (!prefersReducedMotion) update();
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  function init() {
    cancelAnimationFrame(animFrame);
    resize();
    createNodes();
    loop();
  }

  init();
  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });
})();
