"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { easeExpo } from "@/lib/animations";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Force l'état (ex : attendre la fin du preloader). Sinon : à l'entrée dans le viewport. */
  play?: boolean;
};

/** Lettres qui montent depuis un masque, mot par mot. */
export default function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.022,
  play,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const active = play ?? inView;
  const words = text.split(" ");
  let n = 0;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, wi) => (
          <span key={wi}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              {Array.from(word).map((char) => {
                const i = n++;
                return (
                  <motion.span
                    key={i}
                    className="inline-block will-change-transform"
                    initial={{ y: "115%", rotate: 6 }}
                    animate={
                      active ? { y: "0%", rotate: 0 } : { y: "115%", rotate: 6 }
                    }
                    transition={{
                      duration: 1,
                      ease: easeExpo,
                      delay: delay + i * stagger,
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}
