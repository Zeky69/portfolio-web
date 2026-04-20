"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, Github } from "lucide-react";
import { fadeUp, staggerContainer, staggerContainerSlow } from "@/lib/animations";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "zek.akburak@gmail.com",
    href: "mailto:zek.akburak@gmail.com",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "07 68 43 93 56",
    href: "tel:+33768439356",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Zeky69",
    href: "https://github.com/Zeky69",
    external: true,
  },
];

function ContactItem({
  item,
}: {
  item: (typeof contacts)[0];
}) {
  const { icon: Icon, label, value, href, external } = item;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      variants={fadeUp}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-4 group cursor-pointer"
      aria-label={`${label}: ${value}`}
    >
      <motion.div
        animate={{
          backgroundColor: hovered ? "#D35F3E" : "#26262A",
          scale: hovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      >
        <Icon size={16} className="text-white" aria-hidden="true" />
      </motion.div>
      <div>
        <p className="text-muted text-xs">{label}</p>
        <motion.p
          animate={{ color: hovered ? "#E5825F" : "#EDE4D3" }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium"
        >
          {value}
        </motion.p>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-surface/10 border-t border-border overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left – heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <p className="text-accent text-xs font-medium tracking-widest uppercase mb-4">
            Contact
          </p>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-text leading-tight mb-6">
            Travaillons
            <br />
            <span className="text-accent">ensemble.</span>
          </h2>
          <p
            className="text-muted leading-relaxed max-w-md"
            style={{ lineHeight: "1.8" }}
          >
            Disponible pour une alternance, un stage ou toute opportunité en
            développement applicatif ou IA. N&apos;hésitez pas à me contacter.
          </p>
        </motion.div>

        {/* Right – contacts */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-6"
        >
          {contacts.map((item) => (
            <ContactItem key={item.label} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
