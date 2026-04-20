"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Brain, Globe, Database, Terminal, Smartphone } from "lucide-react";
import { fadeUp, staggerContainer, staggerContainerSlow } from "@/lib/animations";

const skillGroups = [
  {
    icon: Code2,
    title: "Langages",
    tags: ["C", "Python", "JavaScript", "TypeScript", "Java"],
  },
  {
    icon: Brain,
    title: "IA & Data",
    tags: ["PyTorch", "TensorFlow", "LangChain", "Scikit-Learn", "Ollama"],
  },
  {
    icon: Globe,
    title: "Web & API",
    tags: ["Vue.js", "React", "FastAPI", "Express", "Fastify", "Flask"],
  },
  {
    icon: Database,
    title: "Bases de données",
    tags: ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
  },
  {
    icon: Terminal,
    title: "DevOps & Outils",
    tags: ["Docker", "Git", "Home Assistant", "Socket.IO"],
  },
  {
    icon: Smartphone,
    title: "Mobile",
    tags: ["React Native", "iOS / Android"],
  },
];

// 3D tilt + spotlight card
function SkillCard({
  icon: Icon,
  title,
  tags,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  tags: string[];
  delay: number;
}) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -10, y: x * 10 });
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      style={{ transformStyle: "preserve-3d", perspective: "800px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-surface border border-border rounded-2xl p-6 h-full overflow-hidden cursor-default group"
      >
        {/* Spotlight gradient */}
        {hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(250px circle at ${spotlight.x}px ${spotlight.y}px, rgba(211,95,62,0.14), transparent 70%)`,
            }}
          />
        )}

        {/* Hover glow border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-accent/0 pointer-events-none"
          animate={{ borderColor: hovered ? "rgba(211,95,62,0.4)" : "rgba(211,95,62,0)" }}
          transition={{ duration: 0.2 }}
        />

        {/* Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-200">
            <Icon size={16} className="text-accent" aria-hidden="true" />
          </div>
          <h3 className="font-heading font-semibold text-sm text-text">{title}</h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="text-xs px-3 py-1.5 rounded-full bg-bg border border-border text-muted-light cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="skills"
      ref={ref}
      className="py-28 px-4 sm:px-6 lg:px-8 bg-surface/30 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-14"
        >
          <p className="text-accent text-xs font-medium tracking-widest uppercase mb-4">
            Compétences
          </p>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-text">
            Stack technique
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {skillGroups.map((group, i) => (
            <SkillCard key={group.title} {...group} delay={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
