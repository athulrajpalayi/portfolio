"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  baseAlpha: number;
  colorIndex: number;
};

const PALETTE = [
  [40, 240, 211],   // teal
  [40, 240, 211],
  [59, 130, 246],   // blue
  [59, 130, 246],
  [139, 92, 246],   // violet
  [180, 160, 255],  // soft violet
];

const CONNECT_DIST   = 148;
const MOUSE_RADIUS   = 200;
const MOUSE_FORCE    = 0.11;   // attraction strength
const MAX_SPEED      = 2.6;
const BASE_SPEED     = 0.32;
const DAMPING        = 0.984;
const BOUNCE_DECAY   = 0.68;   // velocity retained on wall bounce
const NOISE          = 0.006;  // per-frame random nudge to keep particles alive

function particleCount(w: number, h: number) {
  return Math.min(160, Math.floor((w * h) / 8200));
}

export function ParticleNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999, active: false });
  const rafRef    = useRef(0);
  const stateRef  = useRef<{ particles: Particle[]; w: number; h: number }>({
    particles: [],
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function resize() {
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width  = width  * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      stateRef.current.w = width;
      stateRef.current.h = height;
      init();
    }

    function init() {
      const { w, h } = stateRef.current;
      const count = particleCount(w, h);
      stateRef.current.particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const spd   = BASE_SPEED + Math.random() * 0.45;
        const r     = 0.9 + Math.random() * 2.3;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: r,
          mass: r * 0.75 + 0.25,
          baseAlpha: 0.38 + Math.random() * 0.52,
          colorIndex: Math.floor(Math.random() * PALETTE.length),
        };
      });
    }

    function draw() {
      const { particles, w, h } = stateRef.current;
      if (!ctx || !w || !h) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, w, h);

      const { x: mx, y: my, active } = mouseRef.current;

      // ── Physics ──────────────────────────────────────────
      for (const p of particles) {
        // Tiny random nudge — keeps particles alive when far from cursor
        p.vx += (Math.random() - 0.5) * NOISE;
        p.vy += (Math.random() - 0.5) * NOISE;

        // Gravity-well attraction toward mouse
        if (active) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_RADIUS * MOUSE_RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            // Stronger pull as distance decreases (inverse-square feel)
            const f = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) * (MOUSE_FORCE / p.mass);
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        // Speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED; }

        // Friction
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls — gives the "trapped energy" / antigravity-in-a-box feel
        const m = p.radius + 4;
        if (p.x < m)     { p.x = m;     p.vx =  Math.abs(p.vx) * BOUNCE_DECAY; }
        else if (p.x > w - m) { p.x = w - m; p.vx = -Math.abs(p.vx) * BOUNCE_DECAY; }
        if (p.y < m)     { p.y = m;     p.vy =  Math.abs(p.vy) * BOUNCE_DECAY; }
        else if (p.y > h - m) { p.y = h - m; p.vy = -Math.abs(p.vy) * BOUNCE_DECAY; }
      }

      // ── Connections ──────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b  = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d >= CONNECT_DIST) continue;

          const t = 1 - d / CONNECT_DIST;
          const [ra, ga, ba] = PALETTE[a.colorIndex];
          const [rb, gb, bb] = PALETTE[b.colorIndex];
          const rm = (ra + rb) >> 1;
          const gm = (ga + gb) >> 1;
          const bm = (ba + bb) >> 1;

          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0,   `rgba(${ra},${ga},${ba},${t * a.baseAlpha * 0.6})`);
          grad.addColorStop(0.5, `rgba(${rm},${gm},${bm},${t * 0.45})`);
          grad.addColorStop(1,   `rgba(${rb},${gb},${bb},${t * b.baseAlpha * 0.6})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 0.5 + t * 0.5;
          ctx.stroke();
        }
      }

      // ── Particles ────────────────────────────────────────
      for (const p of particles) {
        const [r, g, b] = PALETTE[p.colorIndex];

        // Glow halo
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4.5);
        halo.addColorStop(0,    `rgba(${r},${g},${b},${p.baseAlpha * 0.72})`);
        halo.addColorStop(0.4,  `rgba(${r},${g},${b},${p.baseAlpha * 0.3})`);
        halo.addColorStop(1,    `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Solid core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.78, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, p.baseAlpha * 1.65)})`;
        ctx.fill();

        // White spark centre
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,248,255,${p.baseAlpha * 0.92})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    // Track globally so mouse still works when hovering content above canvas
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
