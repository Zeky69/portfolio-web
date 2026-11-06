import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Band from "@/components/Band";
import Projects from "@/components/Projects";
import Profile from "@/components/Profile";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Band />
        <Projects />
        <Profile />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
