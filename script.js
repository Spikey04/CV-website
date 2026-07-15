const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav-principal');

const syncHeader = () => header.classList.toggle('scrolled', scrollY > 20);
syncHeader();
addEventListener('scroll', syncHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('click', ({ target }) => {
  if (target.matches('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const canvas = document.querySelector('#tech-background');
const context = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let particles = [];

function resizeBackground() {
  const ratio = Math.min(devicePixelRatio, 1.5);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(70, Math.max(28, Math.floor(innerWidth / 22)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .16,
    vy: (Math.random() - .5) * .16
  }));
}

function drawBackground() {
  context.clearRect(0, 0, innerWidth, innerHeight);

  for (const particle of particles) {
    particle.x = (particle.x + particle.vx + innerWidth) % innerWidth;
    particle.y = (particle.y + particle.vy + innerHeight) % innerHeight;
    context.fillStyle = 'rgba(102, 242, 163, .35)';
    context.fillRect(particle.x, particle.y, 1.4, 1.4);
  }

  // ponytail: O(n²) is fine for <=70 nodes; use spatial buckets only if that limit grows.
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.hypot(dx, dy);
      if (distance < 125) {
        context.strokeStyle = `rgba(102, 242, 163, ${.07 * (1 - distance / 125)})`;
        context.beginPath();
        context.moveTo(particles[i].x, particles[i].y);
        context.lineTo(particles[j].x, particles[j].y);
        context.stroke();
      }
    }
  }

  requestAnimationFrame(drawBackground);
}

if (!reducedMotion) {
  resizeBackground();
  addEventListener('resize', resizeBackground, { passive: true });
  drawBackground();
}
