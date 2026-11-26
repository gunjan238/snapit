/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { Sparkles, Target, Heart, Zap } from "lucide-react";
import aboutImg from "@/assets/about-team.jpg";
import { SectionHeading } from "./SectionHeading";

const features = [
  { icon: Sparkles, title: "Cinematic Eye", text: "Award-winning visual storytelling." },
  { icon: Target, title: "Brand Focus", text: "Strategy that scales your business." },
  { icon: Heart, title: "Human Touch", text: "Real stories, real emotion." },
  { icon: Zap, title: "Fast Turnaround", text: "On-time, every time." },
];

export function About() {
  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-3xl rounded-3xl" />
          <img
            src={aboutImg}
            alt="Snapit studio team"
            loading="lazy"
            className="relative rounded-2xl sm:rounded-3xl border border-border shadow-card-luxe w-full aspect-[4/3] sm:aspect-[4/5] object-cover"
          />
          <div className="absolute -bottom-5 sm:-bottom-8 -right-3 sm:-right-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border shadow-card-luxe hidden sm:block">
            <div className="text-3xl sm:text-4xl font-bold text-gradient-gold">8+</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">Years of craft</div>
          </div>
        </motion.div>

        <div>
          <SectionHeading
            eyebrow="About Snapit"
            title="A creative studio"
            highlight="built in Pune."
            description="We blend cinematic photography, videography and digital marketing to build brands that look unforgettable and perform measurably. From weddings and fashion to fast-moving political campaigns, we move with intention."
          />

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2 sm:mb-3" />
                <div className="font-semibold text-sm sm:text-base mb-1">{f.title}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{f.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
