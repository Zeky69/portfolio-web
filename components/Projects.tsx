"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import MediaPlate, { MediaView } from "@/components/project/MediaPlate";
import ProjectVisual from "@/components/project/Visuals";
import RevealText from "@/components/fx/RevealText";
import { TransitionLink } from "@/components/fx/PageTransition";
import { moreProjects, projects, type Project } from "@/lib/projects";
import { easeExpo } from "@/lib/animations";

function Chapter({ project, index }: { project: Project; index: number }) {
  const side = index % 2 === 0 ? "right" : "left";
  const cover = project.media[0];

  return (
    <article
      data-stage={project.shape}
      data-side={side}
      data-c1={project.colors[0]}
      data-c2={project.colors[1]}
      className="relative flex min-h-[100svh] items-center py-20 md:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 md:grid-cols-12">
        <div className={`min-w-0 md:col-span-7 ${side === "right" ? "" : "md:col-start-6"} lg:col-span-6 ${side === "left" ? "lg:col-start-7" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: easeExpo }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="label tabular" style={{ color: project.colors[0] }}>
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-border-hover" />
            <span className="label text-muted-light">{project.status}</span>
          </motion.div>

          <div className="mt-6 flex items-end gap-4">
            {project.icon && (
              <motion.img
                src={project.icon}
                alt=""
                width={72}
                height={72}
                initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: easeExpo }}
                className="mb-2 h-12 w-12 shrink-0 sm:h-[72px] sm:w-[72px]"
              />
            )}
            <h3
              className="text-[clamp(2.8rem,6.6vw,6.8rem)] font-extrabold leading-[0.88] tracking-[-0.05em]"
              style={{ fontVariationSettings: '"wdth" 80' }}
            >
              <RevealText text={project.title} stagger={0.02} />
            </h3>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: easeExpo, delay: 0.15 }}
            className="mt-5 font-serif text-[clamp(1.4rem,2.2vw,2rem)] italic leading-[1.1]"
            style={{ color: project.colors[1] }}
          >
            {project.kicker}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 1.2, ease: easeExpo, delay: 0.1 }}
            className="mt-9"
          >
            <TransitionLink href={`/projects/${project.slug}`} label={project.title} data-cursor="Ouvrir" className="block">
              <MediaPlate colors={project.colors} pad={cover ? "p-3 sm:p-5" : "p-3 sm:p-4"}>
                {cover ? <MediaView media={cover} /> : project.visual && <ProjectVisual visual={project.visual} />}
              </MediaPlate>
            </TransitionLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: easeExpo, delay: 0.1 }}
            className="mt-9"
          >
            <p className="max-w-[60ch] text-[1.05rem] leading-relaxed text-muted-light">{project.description}</p>

            <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {project.highlights.slice(0, 4).map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-snug text-text/90">
                  <span
                    className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: project.colors[0], boxShadow: `0 0 12px ${project.colors[0]}` }}
                  />
                  {h}
                </li>
              ))}
            </ul>

            <ul className="mt-7 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="glass rounded-full px-3 py-1.5 font-mono text-[11px] text-muted-light">
                  {s}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <TransitionLink
                href={`/projects/${project.slug}`}
                label={project.title}
                className="textured group inline-flex items-center gap-3 overflow-hidden rounded-full px-5 py-3 text-sm font-semibold text-bg"
                style={{ background: project.colors[0] }}
              >
                Étude de cas
                <ArrowUpRight size={15} className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
              </TransitionLink>
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-border-hover px-5 py-3 text-sm transition-colors duration-300 hover:border-text"
                >
                  {l.label}
                  <ArrowUpRight size={14} className="text-muted transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:text-text" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projets" className="relative px-5 sm:px-8 lg:px-12">
      <div data-stage="scatter" data-dim="0.5" className="mx-auto max-w-[1600px] pb-10 pt-32 md:pt-44">
        <SectionTitle
          n="01"
          label="Projets"
          title="Ce que j'ai"
          accent="construit."
          intro="Six projets complets, du natif macOS à l'IA locale. Chacun est en ligne, publié ou open source — et chacun a sa forme."
        />
      </div>

      {projects.map((p, i) => (
        <Chapter key={p.slug} project={p} index={i} />
      ))}

      <div data-stage="scatter" data-dim="0.4" className="mx-auto max-w-[1600px] pb-24 pt-10">
        <p className="label text-muted">Aussi sur GitHub</p>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {moreProjects.map((m) => (
            <li key={m.title}>
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full items-start justify-between gap-4 bg-bg/80 p-5 backdrop-blur transition-colors duration-300 hover:bg-surface"
              >
                <span>
                  <span className="block text-lg font-semibold tracking-tight">{m.title}</span>
                  <span className="mt-1 block text-sm text-muted">{m.note}</span>
                </span>
                <ArrowUpRight size={16} className="mt-1 shrink-0 text-muted transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
