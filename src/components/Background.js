import { useEffect, useRef } from 'react';

// Animated background — aurora mesh + particle network + floating orbs
// Adapts colours automatically for dark/light theme via CSS vars

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W = 0, H = 0;

    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    // Colour palettes
    const DARK  = { p: ['#00e5ff', '#9b59ff', '#e040fb', '#00ffa3'], bg: '#03060f', line: 'rgba(0,229,255,0.06)', orb1: 'rgba(0,229,255,0.07)', orb2: 'rgba(155,89,255,0.07)', orb3: 'rgba(224,64,251,0.05)' };
    const LIGHT = { p: ['#005fdf', '#5c2ee8', '#b015d0', '#007a4a'], bg: '#e4eaff', line: 'rgba(0,95,223,0.08)',  orb1: 'rgba(0,95,223,0.08)',    orb2: 'rgba(92,46,232,0.07)',  orb3: 'rgba(176,21,208,0.05)' };
    const C = () => isDark() ? DARK : LIGHT;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles
    const PARTICLE_COUNT = 80;
    const pts = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.4,
      ci: Math.floor(Math.random() * 4),
      op: Math.random() * 0.5 + 0.1,
    }));

    // Floating orbs — large slow blobs
    const orbs = [
      { x: W * 0.15, y: H * 0.2,  r: Math.min(W,H) * 0.45, dx: 0.18, dy: 0.10, t: 0,    key: 'orb1' },
      { x: W * 0.75, y: H * 0.55, r: Math.min(W,H) * 0.38, dx: -0.12, dy: 0.15, t: 2.1, key: 'orb2' },
      { x: W * 0.45, y: H * 0.8,  r: Math.min(W,H) * 0.32, dx: 0.08,  dy: -0.18, t: 4.3, key: 'orb3' },
    ];

    let frame = 0;

    const draw = () => {
      const cl = C();
      ctx.clearRect(0, 0, W, H);

      // ── Animated aurora orbs ────────────────────────────────────────
      orbs.forEach((orb, i) => {
        orb.t += 0.003;
        const ox = orb.x + Math.sin(orb.t * orb.dx * 10) * W * 0.12;
        const oy = orb.y + Math.cos(orb.t * orb.dy * 10) * H * 0.10;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        const color = i === 0 ? cl.orb1 : i === 1 ? cl.orb2 : cl.orb3;
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Subtle grid ─────────────────────────────────────────────────
      const gridSize = 80;
      ctx.strokeStyle = cl.line;
      ctx.lineWidth = 0.5;
      // Animate grid offset slowly
      const gOffX = (frame * 0.08) % gridSize;
      const gOffY = (frame * 0.05) % gridSize;
      ctx.beginPath();
      for (let x = -gridSize + gOffX; x < W + gridSize; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
      }
      for (let y = -gridSize + gOffY; y < H + gridSize; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();

      // ── Particle network ────────────────────────────────────────────
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // Connect nearby particles
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = cl.p[p.ci];
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = cl.p[p.ci];
        ctx.globalAlpha = p.op;
        ctx.shadowColor = cl.p[p.ci];
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Move
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }
      }

      // ── Diagonal light streak (top right corner) ────────────────────
      if (frame % 240 === 0 || frame === 1) {
        // Trigger a streak occasionally
      }
      const streakProgress = (frame % 300) / 300;
      if (streakProgress < 0.4) {
        const sp = streakProgress / 0.4;
        const sx = W * 0.6 + sp * W * 0.6;
        const sy = H * 0.05 + sp * H * 0.3;
        const streakGrad = ctx.createLinearGradient(sx - 200, sy - 100, sx, sy);
        streakGrad.addColorStop(0, 'transparent');
        streakGrad.addColorStop(0.5, isDark() ? 'rgba(0,229,255,0.06)' : 'rgba(0,95,223,0.05)');
        streakGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, 0, W, H);
      }

      frame++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
}
