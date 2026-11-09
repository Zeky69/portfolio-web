"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { setIntroDone } from "@/lib/intro";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { burst } from "@/lib/stage";

type Phase = "idle" | "out" | "in";
type Ctx = { navigate: (href: string, label?: string) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

/**
 * Changement de page : le contenu s'efface, les particules explosent,
 * la nouvelle page arrive et les particules s'y réassemblent.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const pending = useRef<string | null>(null);
  const prevPath = useRef(pathname);

  const navigate = useCallback(
    (href: string, nextLabel?: string) => {
      if (phase !== "idle") return;
      const url = new URL(href, window.location.href);
      setIntroDone();

      if (norm(url.pathname) === norm(window.location.pathname)) {
        if (url.hash) scrollToTarget(url.hash);
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      pending.current = href;
      setLabel(nextLabel ?? "");
      router.prefetch(href);
      getLenis()?.stop();
      burst();
      setPhase("out");
    },
    [phase, router]
  );

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    const hash = window.location.hash;
    requestAnimationFrame(() => {
      getLenis()?.start();
      if (hash && document.querySelector(hash)) {
        scrollToTarget(hash, { immediate: true });
      } else {
        window.scrollTo(0, 0);
        getLenis()?.scrollTo(0, { immediate: true, force: true });
      }
      setPhase((p) => (p === "out" ? "in" : p));
    });
  }, [pathname]);

  const onDone = () => {
    if (phase === "out" && pending.current) {
      const href = pending.current;
      pending.current = null;
      router.push(href, { scroll: false });
    } else if (phase === "in") {
      setPhase("idle");
    }
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[105] flex items-end bg-bg/90 px-5 pb-10 backdrop-blur-sm sm:px-8 lg:px-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "out" ? 1 : 0 }}
        transition={{ duration: phase === "out" ? 0.55 : 0.8, ease: [0.76, 0, 0.24, 1], delay: phase === "in" ? 0.25 : 0 }}
        onAnimationComplete={onDone}
      >
        <motion.span
          className="font-display text-[clamp(2.5rem,9vw,8rem)] font-bold leading-[0.9] tracking-[-0.02em] text-text"
          animate={{ y: phase === "out" ? 0 : 40, opacity: phase === "out" ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {label}
        </motion.span>
      </motion.div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
  label?: string;
};

export function TransitionLink({ href, label, onClick, children, ...rest }: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href, label);
      }}
    >
      {children}
    </Link>
  );
}
