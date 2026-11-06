"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { setIntroDone } from "@/lib/intro";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { easeCurtain } from "@/lib/animations";

type Phase = "idle" | "cover" | "reveal";
type Ctx = { navigate: (href: string, label?: string) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

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

      // Même page → simple scroll fluide vers l'ancre
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
      setPhase("cover");
    },
    [phase, router]
  );

  // Nouvelle route montée sous le rideau → on se place puis on lève le rideau
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
      if (phase === "cover") setPhase("reveal");
    });
  }, [pathname, phase]);

  const onPanelDone = () => {
    if (phase === "cover" && pending.current) {
      const href = pending.current;
      pending.current = null;
      router.push(href, { scroll: false });
    } else if (phase === "reveal") {
      setPhase("idle");
    }
  };

  const target = phase === "cover" ? "0%" : phase === "reveal" ? "-100%" : "100%";
  const instant = phase === "idle";

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        aria-hidden
        className={`fixed inset-0 z-[105] ${phase === "idle" ? "pointer-events-none" : ""}`}
      >
        <motion.div
          className="absolute inset-0 bg-accent"
          initial={{ y: "100%" }}
          animate={{ y: target }}
          transition={
            instant ? { duration: 0 } : { duration: 0.65, ease: easeCurtain }
          }
        />
        <motion.div
          className="absolute inset-0 flex items-end bg-surface px-5 pb-8 sm:px-8 lg:px-12"
          initial={{ y: "100%" }}
          animate={{ y: target }}
          transition={
            instant
              ? { duration: 0 }
              : { duration: 0.65, ease: easeCurtain, delay: 0.09 }
          }
          onAnimationComplete={onPanelDone}
        >
          <div className="flex w-full items-end justify-between gap-6">
            <span className="text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-text">
              {label}
            </span>
            <span className="font-mono text-xs text-muted">ZA — 2026</span>
          </div>
        </motion.div>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
  label?: string;
};

export function TransitionLink({
  href,
  label,
  onClick,
  children,
  ...rest
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        navigate(href, label);
      }}
    >
      {children}
    </Link>
  );
}
