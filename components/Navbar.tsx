"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { href: "#about", label: "À propos" },
  { href: "#skills", label: "Compétences" },
  { href: "#experience", label: "Expérience" },
  { href: "#projects", label: "Projets" },
  { href: "#education", label: "Formation" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="fixed top-4 left-4 right-4 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav
        className={`max-w-6xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-xl border-border shadow-lg shadow-black/30"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="font-heading font-bold text-sm text-text hover:text-accent transition-colors duration-200 cursor-pointer tracking-tight"
          aria-label="Retour en haut"
        >
          <span className="text-accent">Z</span>A
        </a>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`relative text-xs px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                  activeSection === href
                    ? "text-text"
                    : "text-muted hover:text-text"
                }`}
              >
                {activeSection === href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-surface rounded-lg border border-border"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                  />
                )}
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className="text-xs font-medium px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-light transition-colors duration-200 cursor-pointer"
        >
          Contact
        </a>
      </nav>
    </motion.header>
  );
}
