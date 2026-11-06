"use client";

import { ArrowUpRight, Github, Mail } from "lucide-react";
import RevealText from "@/components/fx/RevealText";
import Magnetic from "@/components/fx/Magnetic";
import FadeIn from "@/components/fx/FadeIn";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-5 pb-24 pt-32 sm:px-8 md:pt-44 lg:px-12"
    >
      {/* Halo vivant */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="blob-drift absolute -bottom-1/3 left-1/4 h-[70vh] w-[70vh] rounded-full bg-accent/25 blur-[140px]" />
        <div
          className="blob-drift absolute -bottom-1/4 right-0 h-[45vh] w-[45vh] rounded-full bg-ice/10 blur-[120px]"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        <FadeIn y={12}>
          <p className="mb-10 flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-accent-light">06</span>
            <span className="h-px w-10 bg-border-hover" />
            Contact
          </p>
        </FadeIn>

        <h2 className="text-[clamp(3.5rem,13.5vw,14rem)] font-semibold leading-[0.84] tracking-[-0.06em] text-text">
          <RevealText text="Travaillons" stagger={0.03} />
          <br />
          <span className="flex flex-wrap items-end gap-x-[0.2em]">
            <RevealText text="ensemble." delay={0.2} stagger={0.03} className="text-outline" />
          </span>
        </h2>

        <div className="mt-16 grid items-end gap-12 md:mt-24 md:grid-cols-12">
          <FadeIn className="md:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-muted-light">
              Ouvert aux stages, projets et opportunités en développement
              applicatif ou en IA. Un message suffit — je réponds vite.
            </p>
            <div className="mt-10 space-y-3">
              <a
                href="mailto:zek.akburak@gmail.com"
                className="group flex items-center justify-between border-b border-border py-4 transition-colors duration-300 hover:border-accent"
              >
                <span className="flex items-center gap-4 text-text">
                  <Mail size={18} className="text-accent-light" />
                  zek.akburak@gmail.com
                </span>
                <ArrowUpRight size={18} className="text-muted transition-transform duration-500 ease-expo group-hover:rotate-45 group-hover:text-text" />
              </a>
              <a
                href="https://github.com/Zeky69"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-border py-4 transition-colors duration-300 hover:border-accent"
              >
                <span className="flex items-center gap-4 text-text">
                  <Github size={18} className="text-accent-light" />
                  github.com/Zeky69
                </span>
                <ArrowUpRight size={18} className="text-muted transition-transform duration-500 ease-expo group-hover:rotate-45 group-hover:text-text" />
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="flex md:col-span-7 md:justify-end">
            <Magnetic strength={0.45}>
              <a
                href="mailto:zek.akburak@gmail.com"
                data-cursor="Écrire"
                className="group relative grid h-48 w-48 place-items-center overflow-hidden rounded-full bg-accent text-white sm:h-60 sm:w-60"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-text transition-transform duration-700 ease-expo group-hover:scale-100" />
                <span className="relative flex flex-col items-center gap-2 text-center text-lg font-medium transition-colors duration-500 group-hover:text-bg">
                  <ArrowUpRight size={28} className="transition-transform duration-700 ease-expo group-hover:rotate-45" />
                  Écrire un mail
                </span>
              </a>
            </Magnetic>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
