import RevealText from "@/components/fx/RevealText";
import FadeIn from "@/components/fx/FadeIn";

export default function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: string;
  intro?: React.ReactNode;
}) {
  return (
    <div className="mb-16 grid items-end gap-8 md:mb-24 md:grid-cols-12">
      <div className="md:col-span-8">
        <FadeIn y={12}>
          <p className="mb-6 flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-accent-light">{index}</span>
            <span className="h-px w-10 bg-border-hover" />
            {label}
          </p>
        </FadeIn>
        <h2 className="text-[clamp(2.75rem,8.5vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-text">
          <RevealText text={title} />
        </h2>
      </div>
      {intro && (
        <FadeIn
          delay={0.2}
          className="max-w-sm leading-relaxed text-muted-light md:col-span-4 md:justify-self-end"
        >
          {intro}
        </FadeIn>
      )}
    </div>
  );
}
