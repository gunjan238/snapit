/* eslint-disable prettier/prettier */
import { ArrowUp, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";
import logoAsset from "@/assets/snapitt-logo.png";

export function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logoAsset} alt="SnapIt" className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg" />
          </div>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
            A Pune-based creative agency crafting cinematic photography,
            videography and digital marketing for ambitious brands.
          </p>
          <div className="mt-5 sm:mt-6 flex gap-2 sm:gap-3">
            {[Instagram].map((Icon, i) => (
              <a
                key={i}
                href="https://www.instagram.com/snapitt_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm uppercase tracking-widest text-primary mb-4 sm:mb-5">Studio</h4>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
            <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
            <li><a href="#projects" className="hover:text-primary transition-colors">Work</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm uppercase tracking-widest text-primary mb-4 sm:mb-5">Contact</h4>
          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
            <li className="break-all">snapitt04@gmail.com</li>
            <li>+91 78209 71568</li>
            <li>Pune</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SnapIt. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-gold text-primary-foreground shadow-gold flex items-center justify-center hover:scale-110 transition"
            aria-label="Back to top"
          >
            <ArrowUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
