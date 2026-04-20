"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { fadeUp, staggerContainer, staggerContainerSlow } from "@/lib/animations";
import { featuredProjects, miniProjects, type Project } from "@/lib/projects";

function ProjectCard({ project }: { project: Project }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -8, y: x * 8 });
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div variants={fadeUp} style={{ perspective: "800px" }}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setRotate({ x: 0, y: 0 });
          setHovered(false);
        }}
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-surface border border-border rounded-2xl p-7 h-full overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(280px circle at ${spotlight.x}px ${spotlight.y}px, rgba(211,95,62,0.12), transparent 70%)`,
            }}
          />
        )}

        <motion.div
          className="absolute inset-0 rounded-2xl border pointer-events-none"
          animate={{
            borderColor: hovered ? "rgba(211,95,62,0.4)" : "rgba(42,35,29,0)",
          }}
          transition={{ duration: 0.2 }}
        />

        <Link
          href={`/projects/${project.slug}`}
          className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`Ouvrir la page du projet ${project.title}`}
        />

        <div className="relative z-[1] pointer-events-none">
          <div className="flex items-start justify-between mb-4">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                project.badgeColor === "accent"
                  ? "text-accent bg-accent/10"
                  : "text-muted bg-surface-hover border border-border"
              }`}
            >
              {project.badge}
            </span>
            <span className="text-xs text-muted">{project.category}</span>
          </div>

          <h3 className="font-heading font-semibold text-text text-xl mb-3 transition-colors duration-200">
            {project.title}
            {project.href && <ExternalLink size={14} className="inline ml-2 text-muted" />}
          </h3>

          <p className="text-muted text-sm leading-relaxed mb-5" style={{ lineHeight: "1.75" }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-bg border border-border text-muted-light"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="projects"
      ref={ref}
      className="py-28 px-4 sm:px-6 lg:px-8 bg-surface/20 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-14"
        >
          <p className="text-accent text-xs font-medium tracking-widest uppercase mb-4">
            Realisations
          </p>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-text">Projets</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-5 mb-5"
        >
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {miniProjects.map((project) => (
            <motion.article
              key={project.slug}
              variants={fadeUp}
              whileHover={{ y: -3, borderColor: "rgba(211,95,62,0.35)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-surface border border-border rounded-xl p-5"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Ouvrir la page du projet ${project.title}`}
              />
              <div className="relative z-[1] pointer-events-none">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-medium text-text text-sm">{project.title}</h3>
                  <span className="text-xs text-muted">{project.year}</span>
                </div>
                <p className="text-muted text-xs leading-relaxed mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-bg border border-border text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
