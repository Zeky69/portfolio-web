/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, projects } from "@/lib/projects";
import ScrollProgress from "@/components/ScrollProgress";
import RevealText from "@/components/fx/RevealText";
import FadeIn from "@/components/fx/FadeIn";
import ProjectArt from "@/components/fx/ProjectArt";
import { TransitionLink } from "@/components/fx/PageTransition";

const MarkdownImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    {...props}
    alt={props.alt ?? ""}
    loading="lazy"
    className="h-auto w-full rounded-2xl border border-border"
  />
);

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Zekeriya Akburak`,
    description: project.description,
  };
}

async function getProjectMarkdown(slug: string) {
  const filePath = path.join(process.cwd(), "content", "projects", `${slug}.md`);
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const markdownContent = await getProjectMarkdown(project.slug);

  const meta = [
    { label: "Année", value: project.year ?? "En cours" },
    { label: "Catégorie", value: project.category ?? project.tags[0] },
    { label: "Stack", value: project.tags.slice(0, 3).join(" · ") },
  ];

  return (
    <>
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between rounded-full border border-border bg-bg/70 px-3 py-2 backdrop-blur-xl">
          <TransitionLink
            href="/#projects"
            label="Projets"
            className="group inline-flex items-center gap-3 rounded-full py-1 pl-1 pr-4 text-sm text-text"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-border-hover transition-all duration-500 ease-expo group-hover:-translate-x-1 group-hover:border-accent group-hover:bg-accent">
              <ArrowLeft size={15} />
            </span>
            Retour aux projets
          </TransitionLink>
          <TransitionLink
            href="/"
            label="Accueil"
            className="grid h-9 w-9 place-items-center rounded-full bg-text text-[13px] font-bold tracking-tight text-bg transition-colors duration-300 hover:bg-accent hover:text-white"
            aria-label="Accueil"
          >
            ZA
          </TransitionLink>
        </div>
      </header>

      <main className="min-h-screen px-5 pb-24 pt-36 sm:px-8 md:pt-44 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          {/* Hero projet */}
          <FadeIn y={12} delay={0.3}>
            <p className="mb-8 flex items-center gap-3 font-mono text-xs text-muted">
              <span className="text-accent-light">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-border-hover" />
              {project.badge ?? "Projet"}
            </p>
          </FadeIn>
          <h1 className="max-w-[14ch] text-[clamp(3rem,9vw,9rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-text">
            <RevealText text={project.title} delay={0.35} stagger={0.025} />
          </h1>

          <div className="mt-14 grid gap-10 md:grid-cols-12">
            <FadeIn delay={0.55} className="md:col-span-6">
              <p className="text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.45] tracking-[-0.01em] text-muted-light">
                {project.description}
              </p>
            </FadeIn>
            <FadeIn delay={0.65} className="md:col-span-5 md:col-start-8">
              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {meta.map((m) => (
                  <div key={m.label} className="bg-bg p-4">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      {m.label}
                    </dt>
                    <dd className="mt-3 text-sm text-text">{m.value}</dd>
                  </div>
                ))}
              </dl>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Visiter"
                  className="group relative mt-4 flex items-center justify-between overflow-hidden rounded-2xl bg-accent px-5 py-4 text-sm font-medium text-white"
                >
                  <span className="absolute inset-0 translate-y-full bg-text transition-transform duration-500 ease-expo group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-500 group-hover:text-bg">
                    {project.href.replace(/^https?:\/\//, "")}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="relative transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:text-bg"
                  />
                </a>
              )}
            </FadeIn>
          </div>

          {/* Visuel */}
          <FadeIn delay={0.75} y={60} className="mt-20">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[32px] border border-border md:aspect-[21/9]">
              <ProjectArt variant={index} className="absolute inset-0 h-full w-full" />
            </div>
          </FadeIn>

          {/* Contenu */}
          <div className="mt-24 grid gap-12 md:grid-cols-12">
            <aside className="md:col-span-3">
              <div className="md:sticky md:top-32">
                <p className="font-mono text-xs text-muted">Technologies</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border-hover px-3 py-1.5 font-mono text-[11px] text-muted-light"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <p className="mt-10 font-mono text-xs text-muted">Points clés</p>
                <ul className="mt-5 space-y-3">
                  {project.details.map((d) => (
                    <li key={d} className="flex gap-3 text-sm leading-relaxed text-muted-light">
                      <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-gradient-to-r from-accent to-ice" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <FadeIn className="md:col-span-8 md:col-start-5">
              {markdownContent ? (
                <article className="project-markdown max-w-3xl">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      ),
                      img: MarkdownImage,
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </article>
              ) : (
                <p className="text-muted">Étude de cas à venir.</p>
              )}
            </FadeIn>
          </div>
        </div>
      </main>

      {/* Projet suivant */}
      <TransitionLink
        href={`/projects/${next.slug}`}
        label={next.title}
        data-cursor="Suivant"
        className="group relative block overflow-hidden border-t border-border px-5 py-20 sm:px-8 md:py-28 lg:px-12"
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-curtain group-hover:scale-y-100" />
        <div className="relative mx-auto flex max-w-[1600px] items-end justify-between gap-8">
          <div>
            <p className="font-mono text-xs text-muted transition-colors duration-500 group-hover:text-white/80">
              Projet suivant
            </p>
            <p className="mt-5 text-[clamp(2.5rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-text transition-transform duration-700 ease-expo group-hover:translate-x-4">
              {next.title}
            </p>
          </div>
          <span className="hidden h-24 w-24 shrink-0 place-items-center rounded-full border border-border-hover transition-all duration-700 ease-expo group-hover:rotate-45 group-hover:border-white md:grid">
            <ArrowUpRight size={32} />
          </span>
        </div>
      </TransitionLink>
    </>
  );
}
