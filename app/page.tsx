import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <footer className="border-t border-border px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-muted text-sm">
          <p>© 2026 Zekeriya AKBURAK</p>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-text transition-colors duration-200 cursor-pointer">
              Haut de page
            </a>
            <a
              href="https://github.com/Zeky69"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors duration-200 cursor-pointer"
            >
              GitHub
            </a>
            <a
              href="mailto:zek.akburak@gmail.com"
              className="hover:text-text transition-colors duration-200 cursor-pointer"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
