"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroDone } from "@/lib/intro";
import { scrollToTarget } from "@/lib/lenis";
import { easeExpo } from "@/lib/animations";

const links = [
  { href: "#projets", label: "Projets", n: "01" },
  { href: "#profil", label: "Profil", n: "02" },
  { href: "#parcours", label: "Parcours", n: "03" },
  { href: "#contact", label: "Contact", n: "04" },
];

export default function Navbar() {
  const intro = useIntroDone();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current: string | null = null;
      for (const l of links) {
        const el = document.querySelector(l.href);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) current = l.href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={intro ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: easeExpo, delay: 0.5 }}
        className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          className={`mx-auto flex max-w-[1600px] items-center justify-between rounded-full px-2 py-2 transition-all duration-700 ease-expo ${
            scrolled || open ? "glass" : "border border-transparent"
          }`}
        >
          <button
            onClick={() => go("#top")}
            className="group flex items-center gap-3 rounded-full py-1 pl-1 pr-3"
            aria-label="Retour en haut"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-dark text-[13px] font-extrabold tracking-tight text-text">
              ZA
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:inline">
              Zekeriya Akburak
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => go(l.href)}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                    active === l.href ? "text-text" : "text-muted-light hover:text-text"
                  }`}
                >
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="mailto:zek.akburak@gmail.com"
              data-cursor="Écrire"
              className="textured hidden overflow-hidden rounded-full bg-text px-5 py-2.5 text-sm font-semibold text-bg transition-colors duration-300 hover:bg-accent-dark hover:text-text sm:inline-flex"
            >
              Me contacter
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border-hover lg:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-px w-4 bg-text transition-transform duration-500 ease-expo ${
                    open ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-4 bg-text transition-transform duration-500 ease-expo ${
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="paint !fixed inset-0 z-[75] flex flex-col justify-end px-6 pb-12 pt-28"
          >
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: easeExpo, delay: 0.2 + i * 0.06 }}
                  className="border-b border-text/15"
                >
                  <button
                    onClick={() => go(l.href)}
                    className="flex w-full items-baseline justify-between py-4 text-left text-[13vw] font-extrabold leading-none tracking-[-0.05em]"
                  >
                    {l.label}
                    <span className="font-mono text-xs font-normal tracking-normal">{l.n}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <a href="mailto:zek.akburak@gmail.com" className="mt-8 font-mono text-sm text-text/80">
              zek.akburak@gmail.com
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
