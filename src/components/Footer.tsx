/* eslint-disable prettier/prettier */
import { ArrowUp, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";
import logoAsset from "@/assets/snapitt-logo.jpg";

export function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoAsset} alt="SnapIt" className="h-12 w-12 rounded-lg" />
            {/* <span className="text-xl font-semibold">Snap<span className="text-gradient-gold">It</span></span> */}
          </div>
          <p className="mt-5 text-muted-foreground max-w-md leading-relaxed">
            A Pune-based creative agency crafting cinematic photography,
            videography and digital marketing for ambitious brands.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Youtube, Facebook, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-11 w-11 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-primary mb-5">Studio</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><a href="#about" className="hover:text-primary">About</a></li>
            <li><a href="#services" className="hover:text-primary">Services</a></li>
            <li><a href="#projects" className="hover:text-primary">Work</a></li>
            <li><a href="#team" className="hover:text-primary">Team</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-primary mb-5">Contact</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li>snapitt04@gmail.com</li>
            <li>+91 78209 71568</li>
            <li>Pune</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SnapIt. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-11 w-11 rounded-full bg-gradient-gold text-primary-foreground shadow-gold flex items-center justify-center hover:scale-110 transition"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}