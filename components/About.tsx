"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Mail, Globe, Car, Languages } from "lucide-react";
import {
  fadeUp,
  slideLeft,
  slideRight,
  staggerContainer,
} from "@/lib/animations";

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-accent text-xs font-medium tracking-widest uppercase mb-4">
      {label}
    </p>
  );
}

const details = [
  { icon: MapPin, label: "Localisation", value: "Audincourt (25)" },
  { icon: Mail, label: "Email", value: "zek.akburak@gmail.com", href: "mailto:zek.akburak@gmail.com" },
  { icon: Globe, label: "Mobilité", value: "France entière · Télétravail" },
  { icon: Car, label: "Permis", value: "Permis B – Véhiculé" },
  { icon: Languages, label: "Langues", value: "Français · Turc · Anglais B1" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-border overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-accent/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left – text */}
        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel label="À propos" />
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-text leading-tight mb-6">
            Profil polyvalent,
            <br />
            <span className="text-accent">toujours en mouvement.</span>
          </h2>
          <p
            className="text-muted leading-relaxed mb-5"
            style={{ lineHeight: "1.8" }}
          >
            Né en 2004, je code depuis mes années de lycée. Mon parcours mêle
            formation académique rigoureuse (BUT Informatique, École 42) et
            expériences professionnelles concrètes en entreprise et laboratoire
            de recherche.
          </p>
          <p className="text-muted leading-relaxed" style={{ lineHeight: "1.8" }}>
            Je suis à la recherche d&apos;une{" "}
            <span className="text-text font-medium">alternance</span> en
            développement applicatif ou IA. Mobile sur toute la France, ouvert
            au télétravail.
          </p>
        </motion.div>

        {/* Right – details list */}
        <motion.dl
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-1"
        >
          {details.map(({ icon: Icon, label, value, href }) => (
            <motion.div
              key={label}
              variants={slideRight}
              className="flex items-center justify-between py-4 border-b border-border group"
            >
              <dt className="flex items-center gap-3 text-muted text-sm">
                <Icon size={14} className="text-accent/60 shrink-0" />
                {label}
              </dt>
              <dd className="text-text text-sm font-medium">
                {href ? (
                  <a
                    href={href}
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
