"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      autoRaf: true,
    });
    setLenis(lenis);

    // Le preloader tourne encore : on gèle le scroll jusqu'à sa fin.
    if (document.documentElement.classList.contains("is-loading")) {
      lenis.stop();
    }

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
