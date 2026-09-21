(() => {
  const canvas = document.getElementById("bouquetCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let started = false;
  let finished = false;
  let progress = 0;
  let last = performance.now();
  let width = 0;
  let height = 0;
  let dpr = 1;

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function flower(cx, cy, scale, color, petalCount, alpha = 1) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalAlpha = alpha;

    const r = 13 * scale;
    for (let i = 0; i < petalCount; i++) {
      const a = (Math.PI * 2 * i) / petalCount;
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = color;
      ctx.fillRect(-2.6 * scale, -r * .95, 5.2 * scale, 11 * scale);
      ctx.restore();
    }
    ctx.fillStyle = "#8b5c16";
    ctx.fillRect(-3.5 * scale, -3.5 * scale, 7 * scale, 7 * scale);
    ctx.fillStyle = "#fff2a3";
    ctx.fillRect(-1.2 * scale, -1.2 * scale, 2.4 * scale, 2.4 * scale);
    ctx.restore();
  }

  function createParticles() {
    particles = [];
    const count = width < 500 ? 420 : 760;

    // Stem/body particles.
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const y = height * .82 - t * height * .58;
      const spread = 18 + t * 115;
      particles.push({
        x: width / 2 + rand(-spread, spread),
        y,
        delay: t * .75 + rand(0, .35),
        size: Math.random() < .75 ? 4 : 6,
        type: Math.random() < .84 ? "pixel" : "spark",
        color: Math.random() < .62 ? "#ffd21c" : (Math.random() < .5 ? "#f5b800" : "#fff07a")
      });
    }

    // Green stem particles.
    for (let i = 0; i < 230; i++) {
      const t = Math.random();
      particles.push({
        x: width / 2 + rand(-60, 60),
        y: height * .87 - t * height * .55,
        delay: .2 + t * .8,
        size: Math.random() < .7 ? 4 : 5,
        type: "leaf",
        color: Math.random() < .5 ? "#687d35" : "#8ca34c"
      });
    }

    // Floating sparks.
    for (let i = 0; i < 65; i++) {
      particles.push({
        x: rand(width * .15, width * .85),
        y: rand(height * .1, height * .8),
        delay: rand(.2, 1.15),
        size: Math.random() < .6 ? 2 : 3,
        type: "spark",
        color: "#ffe98b"
      });
    }
  }

  function draw(now) {
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;

    if (started && !finished) {
      progress += dt / 7.2;
      if (progress >= 1.15) {
        progress = 1.15;
        finished = true;
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Soft ground glow.
    const glow = ctx.createRadialGradient(width/2, height*.88, 5, width/2, height*.88, width*.42);
    glow.addColorStop(0, "rgba(255,210,45,.16)");
    glow.addColorStop(1, "rgba(255,210,45,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (const p of particles) {
      const local = clamp((progress - p.delay * .52) / .55, 0, 1);
      if (local <= 0) continue;

      // Particles rise into position from below.
      const lift = (1 - local) * height * .30;
      const ease = 1 - Math.pow(1 - local, 3);
      const x = p.x + Math.sin(now * .0015 + p.y) * 1.5 * ease;
      const y = p.y + lift * (1 - ease);

      ctx.save();
      ctx.globalAlpha = Math.min(1, local * 1.8);

      if (p.type === "leaf") {
        ctx.fillStyle = p.color;
        ctx.fillRect(x, y, p.size * 1.4, p.size * .7);
        ctx.fillRect(x - p.size*.7, y + p.size*.4, p.size, p.size*.6);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(x), Math.round(y), p.size, p.size);
      }
      ctx.restore();
    }

    // Once the pixel body is assembled, draw recognizable flowers.
    const f = clamp((progress - .58) / .42, 0, 1);
    if (f > 0) {
      const flowers = [
        [0.50, .19, 1.00, "#ffd21c", 9],
        [0.38, .31, .70, "#ffe05a", 8],
        [0.62, .31, .76, "#f7b900", 8],
        [0.28, .46, .58, "#ffd84a", 7],
        [0.50, .43, .70, "#fff07a", 9],
        [0.72, .46, .60, "#ffd21c", 8],
        [0.39, .56, .50, "#f5bd00", 8],
        [0.61, .56, .52, "#ffe15a", 8],
      ];

      for (const [rx, ry, s, c, petals] of flowers) {
        flower(width * rx, height * ry, s * f, c, petals, f);
      }

      // Little yellow/white pixel sparks around the finished bouquet.
      if (f > .8) {
        for (let i = 0; i < 18; i++) {
          const a = i * 2.399 + now * .0002;
          const r = 115 + 10 * Math.sin(now*.001 + i);
          const x = width/2 + Math.cos(a) * r;
          const y = height*.40 + Math.sin(a) * r*.55;
          ctx.fillStyle = i % 3 === 0 ? "#fff4a8" : "#ffd21c";
          ctx.globalAlpha = .45 + .3 * Math.sin(now*.002 + i);
          ctx.fillRect(x, y, 3, 3);
        }
        ctx.globalAlpha = 1;
      }
    }

    requestAnimationFrame(draw);
  }

  const observer = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      started = true;
      observer.disconnect();
    }
  }, { threshold: .25 });

  observer.observe(canvas);
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();
