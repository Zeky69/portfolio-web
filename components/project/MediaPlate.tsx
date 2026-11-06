"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { Media } from "@/lib/projects";

/** Vidéo qui ne joue que lorsqu'elle est visible. */
function LazyVideo({ media }: { media: Extract<Media, { type: "video" }> }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={media.alt}
      width={media.w}
      height={media.h}
      className="block h-auto w-full"
    />
  );
}

export function MediaView({ media }: { media: Media }) {
  if (media.type === "video") return <LazyVideo media={media} />;
  return (
    <img
      src={media.src}
      alt={media.alt}
      width={media.w}
      height={media.h}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full"
    />
  );
}

/**
 * Plaque colorée texturée (dégradé + grain + trame) qui porte un visuel,
 * avec inclinaison 3D qui suit le curseur.
 */
export default function MediaPlate({
  colors,
  children,
  className = "",
  pad = "p-4 sm:p-6",
  tilt = true,
}: {
  colors: [string, string];
  children: React.ReactNode;
  className?: string;
  pad?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(500px circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 45%)`;

  return (
    <div style={{ perspective: 1400 }} className={className}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (!tilt || e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * 10);
          rx.set(-(py - 0.5) * 8);
          gx.set(px * 100);
          gy.set(py * 100);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        className={`textured group relative overflow-hidden rounded-[22px] sm:rounded-[28px] ${pad}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(120% 90% at 0% 0%, ${colors[0]} 0%, transparent 60%), radial-gradient(120% 100% at 100% 100%, ${colors[1]} 0%, transparent 65%), linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          }}
        />
        <div
          style={{ transform: "translateZ(40px)" }}
          className="relative overflow-hidden rounded-[14px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)] ring-1 ring-black/20"
        >
          {children}
        </div>
        <motion.div
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
}
