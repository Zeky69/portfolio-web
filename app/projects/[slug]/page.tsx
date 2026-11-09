import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, projects } from "@/lib/projects";
import RevealText from "@/components/fx/RevealText";
import FadeIn from "@/components/fx/FadeIn";
import MediaPlate, { MediaView } from "@/components/project/MediaPlate";
import ProjectVisual from "@/components/project/Visuals";
import Explainer from "@/components/project/Explainers";

const EXPLAINED = new Set(["wallchange", "rag-against-the-machine", "therightone", "call-me-maybe"]);
import { TransitionLink } from "@/components/fx/PageTransition";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Zekeriya Akburak`,
    description: `${project.kicker}. ${project.description}`,
  };
}

async function getProjectMarkdown(slug: string) {
  try {
    return await readFile(path.join(process.cwd(), "content", "projects", `${slug}.md`), "utf-8");
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
  const markdown = await getProjectMarkdown(project.slug);
  const [cover, ...gallery] = project.media;
  const wide = gallery.filter((m) => m.w / m.h > 2.2);
  const regular = gallery.filter((m) => m.w / m.h <= 2.2);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="glass mx-auto flex max-w-[1600px] items-center justify-between rounded-full px-2 py-2">
          <TransitionLink
            href="/#projets"
            label="Projets"
            className="group inline-flex items-center gap-3 rounded-full py-1 pl-1 pr-4 text-sm"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-border-hover transition-all duration-500 ease-expo group-hover:-translate-x-1 group-hover:border-accent-dark group-hover:bg-accent-dark group-hover:text-text">
              <ArrowLeft size={15} />
            </span>
            Tous les projets
          </TransitionLink>
          <TransitionLink
            href="/"
            label="Accueil"
            className="grid h-9 w-9 place-items-center rounded-full bg-accent-dark text-[13px] font-extrabold tracking-tight text-text"
            aria-label="Accueil"
          >
            ZA
          </TransitionLink>
        </div>
      </header>

      <main className="px-5 sm:px-8 lg:px-12">
        <section
          data-stage={project.shape}
          data-side="right"
          data-c1={project.colors[0]}
          data-c2={project.colors[1]}
          className="mx-auto flex min-h-[92svh] max-w-[1600px] flex-col justify-end pb-16 pt-36"
        >
          <FadeIn y={12} delay={0.2}>
            <p className="label flex flex-wrap items-center gap-3 text-muted-light">
              <span className="h-px w-8" style={{ background: project.colors[0] }} />
              {project.status}
            </p>
          </FadeIn>
          <h1
            className="mt-8 max-w-[12ch] text-[clamp(3.4rem,11vw,11rem)] font-extrabold leading-[0.85] tracking-[-0.05em]"
          >
            <RevealText text={project.title} delay={0.3} stagger={0.03} play />
          </h1>
          <FadeIn delay={0.6} className="mt-8 max-w-3xl">
            <p className="font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic leading-[1.08]" style={{ color: project.colors[1] }}>
              {project.kicker}
            </p>
          </FadeIn>
          <FadeIn delay={0.75} className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
            <p className="text-lg leading-relaxed text-muted-light md:col-span-6">{project.description}</p>
            <div className="md:col-span-5 md:col-start-8">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                <div className="bg-bg/75 p-4 backdrop-blur">
                  <dt className="label text-muted">Année</dt>
                  <dd className="mt-2 text-sm">{project.year}</dd>
                </div>
                <div className="bg-bg/75 p-4 backdrop-blur">
                  <dt className="label text-muted">Stack</dt>
                  <dd className="mt-2 text-sm">{project.stack.slice(0, 3).join(" · ")}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium ${
                      i === 0 ? "textured overflow-hidden text-bg" : "border border-border-hover"
                    }`}
                    style={i === 0 ? { background: project.colors[0] } : undefined}
                  >
                    {l.label}
                    <ArrowUpRight size={14} className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
                  </a>
                ))}
                {project.links.length === 0 && (
                  <p className="label text-muted">Dépôt privé — démo sur demande</p>
                )}
              </div>
            </div>
          </FadeIn>
        </section>

        <div data-stage="scatter" data-dim="0.22" data-c1={project.colors[0]} data-c2={project.colors[1]} className="mx-auto max-w-[1600px]">
          <FadeIn y={60}>
            <MediaPlate colors={project.colors} pad="p-3 sm:p-8 md:p-12">
              {cover ? <MediaView media={cover} /> : project.visual && <ProjectVisual visual={project.visual} />}
            </MediaPlate>
          </FadeIn>

          {EXPLAINED.has(project.slug) && <Explainer slug={project.slug} colors={project.colors} />}

          {wide.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {wide.map((m) => (
                <FadeIn key={m.src} y={40}>
                  <MediaPlate colors={project.colors} pad="p-3 sm:p-5">
                    <MediaView media={m} />
                  </MediaPlate>
                  <p className="mt-3 text-sm text-muted">{m.alt}</p>
                </FadeIn>
              ))}
            </div>
          )}

          <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-12">
            <aside className="min-w-0 md:col-span-4">
              <div className="md:sticky md:top-32">
                <p className="label text-muted">En bref</p>
                <ul className="mt-5 space-y-4">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 leading-snug">
                      <span
                        className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: project.colors[0], boxShadow: `0 0 12px ${project.colors[0]}` }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
                <p className="label mt-10 text-muted">Technologies</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} className="glass rounded-full px-3 py-1.5 font-mono text-[11px] text-muted-light">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="min-w-0 md:col-span-8">
              {markdown && (
                <FadeIn>
                  {EXPLAINED.has(project.slug) ? (
                    <details className="group glass max-w-3xl rounded-3xl">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:px-10 [&::-webkit-details-marker]:hidden">
                        <span>
                          <span className="label block text-muted">Pour aller plus loin</span>
                          <span className="mt-2 block text-xl font-semibold tracking-tight">Tous les détails techniques</span>
                        </span>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border-hover text-lg transition-transform duration-500 ease-expo group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <article className="project-markdown border-t border-border p-6 sm:p-10">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{ a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
                        >
                          {markdown}
                        </ReactMarkdown>
                      </article>
                    </details>
                  ) : (
                    <article className="project-markdown glass max-w-3xl rounded-3xl p-6 sm:p-10">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{ a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
                      >
                        {markdown}
                      </ReactMarkdown>
                    </article>
                  )}
                </FadeIn>
              )}
              {regular.length > 0 && (
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {regular.map((m) => (
                    <FadeIn key={m.src} y={40}>
                      <MediaPlate colors={project.colors} pad="p-3 sm:p-4">
                        <MediaView media={m} />
                      </MediaPlate>
                      <p className="mt-3 text-sm text-muted">{m.alt}</p>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <TransitionLink
        href={`/projects/${next.slug}`}
        label={next.title}
        data-cursor="Suivant"
        data-stage={next.shape}
        data-side="right"
        data-c1={next.colors[0]}
        data-c2={next.colors[1]}
        data-dim="0.7"
        className="group relative mt-32 block overflow-hidden border-t border-border px-5 py-24 sm:px-8 md:py-36 lg:px-12"
      >
        <div className="relative mx-auto flex max-w-[1600px] items-end justify-between gap-8">
          <div>
            <p className="label text-muted">Projet suivant</p>
            <p
              className="mt-5 text-[clamp(2.8rem,9vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.05em] transition-transform duration-700 ease-expo group-hover:translate-x-4"
            >
              {next.title}
            </p>
            <p className="mt-4 font-serif text-xl italic" style={{ color: next.colors[1] }}>
              {next.kicker}
            </p>
          </div>
          <span
            className="textured hidden h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full text-bg transition-transform duration-700 ease-expo group-hover:rotate-45 md:grid"
            style={{ background: next.colors[0] }}
          >
            <ArrowUpRight size={32} />
          </span>
        </div>
      </TransitionLink>
    </>
  );
}
