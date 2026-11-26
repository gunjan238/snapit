/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/snapitt-logo.png";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.6, duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img src={logoAsset} alt="SnapItt" className="h-9 w-9 sm:h-12 sm:w-12 object-contain rounded-lg" />
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-9 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contact"
            className="inline-flex items-center px-5 xl:px-6 h-10 xl:h-11 rounded-full bg-gradient-gold text-primary-foreground font-medium text-sm shadow-gold hover:scale-105 transition-transform whitespace-nowrap"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-foreground p-1.5 rounded-lg hover:bg-card/60 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden backdrop-blur-xl bg-background/95 border-b border-border"
        >
          <ul className="flex flex-col gap-1 px-4 sm:px-6 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-2 text-base text-muted-foreground hover:text-primary rounded-lg hover:bg-card/40 transition-all"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex justify-center items-center h-12 rounded-full bg-gradient-gold text-primary-foreground font-medium text-sm shadow-gold"
              >
                Book a Call
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
