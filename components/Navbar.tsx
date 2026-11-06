"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Scramble from "@/components/fx/Scramble";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { useIntroDone } from "@/lib/intro";
import { easeCurtain, easeExpo } from "@/lib/animations";

const navLinks = [
  { href: "#about", label: "À propos" },
  { href: "#skills", label: "Stack" },
  { href: "#experience", label: "Expériences" },
  { href: "#projects", label: "Projets" },
  { href: "#education", label: "Formation" },
];

export default function Navbar() {
  const play = useIntroDone();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const last = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - last.current;
    last.current = y;
    setScrolled(y > 40);
    if (open) return;
    if (y < 120) setHidden(false);
    else if (diff > 4) setHidden(true);
    else if (diff < -4) setHidden(false);
  });

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      setTimeout(() => scrollToTarget(href), 450);
    } else {
      scrollToTarget(href);
    }
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 sm:px-5 sm:pt-4"
        initial={{ y: "-120%" }}
        animate={{ y: play && !hidden ? "0%" : "-120%" }}
        transition={{ duration: 0.8, ease: easeExpo, delay: play && !scrolled ? 0.4 : 0 }}
      >
        <nav
          className={`mx-auto flex max-w-[1600px] items-center justify-between rounded-full border px-3 py-2 transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled || open
              ? "border-border bg-bg/70 backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <a
            href="#hero"
            onClick={(e) => go(e, "#hero")}
            className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-3"
            aria-label="Retour en haut"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-text text-[13px] font-bold tracking-tight text-bg transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              ZA
            </span>
            <span className="hidden text-sm font-medium tracking-tight text-text sm:inline">
              <Scramble text="Zekeriya Akburak" />
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => go(e, href)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-300 ${
                    active === href ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {active === href && (
                    <motion.span
                      layoutId="nav-dot"
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Scramble text={label} />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              className="group relative hidden overflow-hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white sm:inline-flex"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-text transition-transform duration-500 ease-expo group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-bg">
                Contact
              </span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-border-hover lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <motion.span
                className="absolute h-px w-4 bg-text"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
                transition={{ duration: 0.4, ease: easeExpo }}
              />
              <motion.span
                className="absolute h-px w-4 bg-text"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
                transition={{ duration: 0.4, ease: easeExpo }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[65] flex flex-col justify-end bg-surface px-5 pb-10 pt-28 sm:px-8"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: easeCurtain }}
          >
            <ul className="space-y-1">
              {[...navLinks, { href: "#contact", label: "Contact" }].map(
                ({ href, label }, i) => (
                  <li key={href} className="overflow-hidden">
                    <motion.a
                      href={href}
                      onClick={(e) => go(e, href)}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.7, ease: easeExpo, delay: 0.15 + i * 0.05 }}
                      className="flex items-baseline gap-4 py-1 text-[clamp(2.5rem,11vw,4.5rem)] font-semibold leading-none tracking-[-0.045em] text-text"
                    >
                      <span className="font-mono text-xs font-normal tracking-normal text-accent-light">
                        0{i + 1}
                      </span>
                      {label}
                    </motion.a>
                  </li>
                )
              )}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex justify-between border-t border-border pt-5 font-mono text-xs text-muted"
            >
              <a href="mailto:zek.akburak@gmail.com">zek.akburak@gmail.com</a>
              <a href="https://github.com/Zeky69" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
