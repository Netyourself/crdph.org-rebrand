'use client';

import { useEffect, useRef } from 'react';

const COLORS = { raw: '#f97316', pipe: '#22d3ee', out: '#a78bfa' }; // orange-500 · cyan-400 · violet-400
const LANES = 5;

type Particle = { x: number; y0: number; speed: number; seed: number; r: number };

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/**
 * Animated "raw data → CRDPH pipeline → AI output" visual. Particles drift left to
 * right: chaotic and orange, then funnelled into lanes (cyan), then orderly (violet).
 * Mobile-friendly: HiDPI-aware, resizes with its container, scales particle count to
 * area, pauses off-screen / in background tabs, and renders one still frame when the
 * user prefers reduced motion.
 */
export function PipelineCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let particles: Particle[] = [];

    const spawn = (x: number): Particle => ({
      x,
      y0: Math.random() * h,
      speed: 0.35 + Math.random() * 0.8,
      seed: Math.random() * Math.PI * 2,
      r: 1.6 + Math.random() * 1.6,
    });

    const position = (p: Particle, t: number) => {
      const progress = p.x / w;
      const order = smooth((progress - 0.2) / 0.5); // 0 = chaotic … 1 = aligned
      const laneH = h / LANES;
      const lane = Math.min(LANES - 1, Math.max(0, Math.floor(p.y0 / laneH)));
      const laneY = (lane + 0.5) * laneH;
      const wobble = Math.sin(t * 0.0025 + p.seed) * 20 * (1 - order);
      return { y: p.y0 * (1 - order) + laneY * order + wobble, progress };
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      for (const gx of [w / 3, (2 * w) / 3]) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      const pts = particles.map((p) => ({ p, ...position(p, t) }));

      // Links between nearby particles once they are inside the pipeline.
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          if (pts[i].progress < 0.33 || pts[j].progress < 0.33) continue;
          const dx = pts[i].p.x - pts[j].p.x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 70) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 * (1 - d / 70)})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].p.x, pts[i].y);
            ctx.lineTo(pts[j].p.x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const { p, y, progress } of pts) {
        ctx.fillStyle = progress < 1 / 3 ? COLORS.raw : progress < 2 / 3 ? COLORS.pipe : COLORS.out;
        ctx.beginPath();
        ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(16, Math.min(44, Math.round((w * h) / 6500)));
      particles = Array.from({ length: count }, () => spawn(Math.random() * w));
      if (reduced) draw(1500);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(48, now - (last || now));
      last = now;
      for (const p of particles) {
        p.x += p.speed * (dt / 16);
        if (p.x > w + 8) Object.assign(p, spawn(-8));
      }
      draw(now);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);
    if (!reduced) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="Animated diagram: raw data enters, is cleansed by the CRDPH pipeline, and leaves as AI-ready output"
      className="glass relative overflow-hidden rounded-2xl p-4 shadow-2xl animate-pulse-glow motion-reduce:animate-none sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
        <span className="font-mono text-[11px] text-gray-400 sm:text-xs">CRDPH_CORE_NODE_ENGINE.v2</span>
        <span className="font-mono text-[11px] text-cyan-400 sm:text-xs">LIVE STREAM</span>
      </div>

      <div className="h-[220px] overflow-hidden rounded-xl border border-gray-800 bg-slate-950/70 sm:h-[280px] lg:h-[320px]">
        <canvas ref={ref} aria-hidden="true" className="block h-full w-full" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center sm:gap-4">
        {[
          { dot: 'bg-orange-500', title: 'Raw Ingest', sub: 'Unstructured' },
          { dot: 'bg-cyan-400', title: 'CRDPH Pipeline', sub: 'Cleansing & Parsing' },
          { dot: 'bg-violet-400', title: 'AI Output', sub: 'Clean Insights' },
        ].map((item) => (
          <div key={item.title} className="rounded-lg bg-slate-950/60 p-2 sm:p-3">
            <span className={`mx-auto mb-1.5 block h-2 w-2 rounded-full ${item.dot}`} aria-hidden="true" />
            <p className="font-mono text-[10px] font-semibold uppercase text-gray-200 sm:text-xs">{item.title}</p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-[11px]">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
