/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { ArrowRight, Play, Camera, Award, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Camera, value: "70+", label: "Projects" },
  { icon: Users, value: "200+", label: "Clients" },
  { icon: Award, value: "8+", label: "Years" },
];

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Floating gold orbs */}
      <div className="absolute top-20 -left-20 w-[420px] h-[420px] rounded-full bg-primary/20 blur-[120px] animate-float-orb" />
      <div
        className="absolute bottom-10 -right-20 w-[480px] h-[480px] rounded-full bg-primary-glow/15 blur-[140px] animate-float-orb"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[260px] h-[260px] rounded-full bg-primary/10 blur-[100px] animate-float-orb"
        style={{ animationDelay: "6s" }}
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur text-xs tracking-widest uppercase text-muted-foreground mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Pune · Creative Agency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.9, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            We craft <span className="text-gradient-gold">visual</span>
            <br />
            stories that <span className="text-gradient-gold">sell.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.1, duration: 0.7 }}
            className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            Snapit is a Pune-based photography, videography, and digital
            marketing studio building brands through cinematic storytelling and
            data-driven campaigns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.7 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 h-14 px-8 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-105 transition-transform"
            >
              View Our Work
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary/60 transition-colors"
            >
              <Play className="h-4 w-4 text-primary" />
              Our Services
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.4, duration: 0.8 }}
          className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 rounded-2xl bg-card/70 backdrop-blur border border-border hover:border-primary/40 transition-colors"
            >
              <s.icon className="h-5 w-5 text-primary mb-3" />
              <div className="text-3xl font-bold text-gradient-gold">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}