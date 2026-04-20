/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, projects } from "@/lib/projects";

const MarkdownImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    {...props}
    alt={props.alt ?? ""}
    loading="lazy"
    className="rounded-xl border border-border w-full h-auto"
  />
);

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
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

  if (!project) {
    notFound();
  }

  const markdownContent = await getProjectMarkdown(project.slug);

  return (
    <main className="min-h-screen bg-bg text-text px-4 sm:px-6 lg:px-8 py-28">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors duration-200 mb-10"
        >
          <ArrowLeft size={14} />
          Retour aux projets
        </Link>

        <header className="mb-10 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-widest text-accent mb-3">Projet</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-4">
            {project.title}
          </h1>
          <p className="text-muted leading-relaxed max-w-2xl" style={{ lineHeight: "1.75" }}>
            {project.description}
          </p>
          {project.year && (
            <p className="text-sm text-muted mt-4">Annee: {project.year}</p>
          )}
          {project.category && (
            <p className="text-sm text-muted mt-1">Categorie: {project.category}</p>
          )}
        </header>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-semibold mb-4">Contenu du projet</h2>
          {markdownContent ? (
            <article className="project-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-light underline underline-offset-4"
                    />
                  ),
                  img: MarkdownImage,
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </article>
          ) : (
            <div>
              <p className="text-muted mb-4">
                Aucun fichier markdown n&apos;a ete trouve pour ce projet.
              </p>
              <ul className="space-y-3">
                {project.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-muted-light leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-heading text-2xl font-semibold mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-surface border border-border text-muted-light"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold mb-4">Liens</h2>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-light transition-colors duration-200"
            >
              Voir le projet
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <p className="text-sm text-muted">Lien public non disponible pour ce projet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
