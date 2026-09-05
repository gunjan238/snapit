/* eslint-disable prettier/prettier */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const items = [
  {
    name: "Karan Verma",
    role: "CEO, Verma Couture",
    quote: "Snapit transformed our brand visuals. Our campaign reach grew 4x and inquiries doubled in a month.",
    rating: 5,
  },
  {
    name: "Anjali Desai",
    role: "Bride · December '24",
    quote: "They captured every emotion. Watching our wedding film still gives me goosebumps a year later.",
    rating: 5,
  },
  {
    name: "MLA Suresh Patil",
    role: "Election Campaign",
    quote: "Professional, fast, and politically aware. Their reels reached lakhs of voters in days.",
    rating: 5,
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, []);

  const cur = items[i];

  return (
    <section className="relative py-32 bg-surface overflow-hidden">
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
        <SectionHeading
          eyebrow="Testimonials"
          title="Kind words from"
          highlight="our clients."
          align="center"
        />

        <div className="mt-16 relative">
          <Quote className="absolute -top-4 -left-2 h-20 w-20 text-primary/15" />
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: cur.rating }).map((_, k) => (
                  <Star key={k} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-2xl lg:text-3xl leading-relaxed font-light">
                "{cur.quote}"
              </p>
              <footer className="mt-8">
                <div className="font-semibold">{cur.name}</div>
                <div className="text-sm text-muted-foreground">{cur.role}</div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={() => setI((p) => (p - 1 + items.length) % items.length)}
              className="h-12 w-12 rounded-full border border-border hover:border-primary hover:text-primary transition flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Go to slide ${k + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    k === i ? "w-10 bg-gradient-gold" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((p) => (p + 1) % items.length)}
              className="h-12 w-12 rounded-full border border-border hover:border-primary hover:text-primary transition flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}