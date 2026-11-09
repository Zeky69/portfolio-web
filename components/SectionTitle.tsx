"use client";

import { motion } from "framer-motion";
import RevealText from "@/components/fx/RevealText";
import { easeExpo } from "@/lib/animations";

export default function SectionTitle({
  title,
  accent,
  intro,
  className = "",
}: {
  title: string;
  accent?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <h2
        className="text-[clamp(2.8rem,7.5vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.025em]"
      >
        <RevealText text={title} />
        {accent && (
          <>
            {" "}
            <span className="font-serif text-[0.92em] font-normal italic tracking-[-0.02em] text-steel">
              <RevealText text={accent} delay={0.15} />
            </span>
          </>
        )}
      </h2>
      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: easeExpo, delay: 0.2 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted-light"
        >
          {intro}
        </motion.p>
      )}
    </header>
  );
}
