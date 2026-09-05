import { Toaster } from "sonner";

import { CameraIntro } from "./components/CameraIntro";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { ScrollShowcase } from "./components/ScrollShowcase";
import { Projects } from "./components/Projects";
import { Clients } from "./components/Clients";
import { Team } from "./components/Team";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <CameraIntro />
      <Navbar />

      <main>
        <Hero />
        <ScrollShowcase />
        <About />
        <Services />
        <Projects />
        <Clients />
        <Team />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      <Toaster position="top-right" richColors />
    </div>
  );
}