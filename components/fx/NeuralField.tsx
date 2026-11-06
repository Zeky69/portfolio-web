"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { a: number; b: number; t: number; speed: number };

const LINK = 150;
const MOUSE_R = 230;

/**
 * Réseau de neurones vivant : des nœuds dérivent, se connectent quand ils sont proches,
 * des signaux voyagent le long des liens, et le curseur "active" la zone qu'il survole.
 */
export default function NeuralField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let running = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(130, Math.max(36, (w * h) / 12500)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.3 + 0.6,
      }));
      pulses = [];
      if (!running) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 320);
        g.addColorStop(0, "rgba(91,91,255,0.16)");
        g.addColorStop(1, "rgba(91,91,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Mouvement + légère répulsion autour du curseur
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 90 && d > 0.1) {
            const f = (1 - d / 90) * 1.4;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
      }

      // Liens
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const d = Math.sqrt(d2);
          let alpha = (1 - d / LINK) * 0.28;
          let color = "91,91,255";
          if (mouse.active) {
            const md = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y);
            if (md < MOUSE_R) {
              const k = 1 - md / MOUSE_R;
              alpha = Math.min(0.9, alpha + k * 0.55);
              color = k > 0.45 ? "158,240,255" : "154,154,255";
            }
          }
          ctx.strokeStyle = `rgba(${color},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Synapses vers le curseur
      if (mouse.active) {
        for (const n of nodes) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < MOUSE_R * 0.8) {
            ctx.strokeStyle = `rgba(158,240,255,${(1 - d / (MOUSE_R * 0.8)) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      // Signaux qui voyagent
      if (!reduce && pulses.length < 18 && Math.random() < 0.12) {
        const a = Math.floor(Math.random() * nodes.length);
        for (let tries = 0; tries < 12; tries++) {
          const b = Math.floor(Math.random() * nodes.length);
          if (b === a) continue;
          const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
          if (d < LINK) {
            pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.02 });
            break;
          }
        }
      }
      pulses = pulses.filter((p) => {
        p.t += p.speed;
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b || p.t >= 1) return false;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, "rgba(158,240,255,0.95)");
        g.addColorStop(1, "rgba(158,240,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // Nœuds
      for (const n of nodes) {
        let alpha = 0.55;
        let r = n.r;
        if (mouse.active) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < MOUSE_R) {
            const k = 1 - d / MOUSE_R;
            alpha += k * 0.45;
            r += k * 1.6;
          }
        }
        ctx.fillStyle = `rgba(238,240,245,${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active =
        e.pointerType === "mouse" &&
        mouse.x >= 0 &&
        mouse.y >= 0 &&
        mouse.x <= rect.width &&
        mouse.y <= rect.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    resize();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
