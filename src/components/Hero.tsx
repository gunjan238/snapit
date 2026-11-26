/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { ArrowRight, Play, Camera, Award, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

// const stats = [
//   { icon: Camera, value: "70+", label: "Projects" },
//   { icon: Users, value: "200+", label: "Clients" },
//   { icon: Award, value: "2+", label: "Years" },
// ];

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Floating gold orbs */}
      <div className="absolute top-20 -left-20 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full bg-primary/20 blur-[120px] animate-float-orb" />
      <div
        className="absolute bottom-10 -right-20 w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full bg-primary-glow/15 blur-[140px] animate-float-orb"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[160px] sm:w-[260px] h-[160px] sm:h-[260px] rounded-full bg-primary/10 blur-[100px] animate-float-orb"
        style={{ animationDelay: "6s" }}
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full py-12">
        {/* Main hero text */}
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground mb-6 sm:mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Pune · Creative Agency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.9, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            We craft <span className="text-gradient-gold">visual</span>
            <br />
            stories that <span className="text-gradient-gold">sell.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.1, duration: 0.7 }}
            className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Snapit is a Pune-based photography, videography, and digital
            marketing studio building brands through cinematic storytelling and
            data-driven campaigns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.7 }}
            className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:scale-105 transition-transform text-sm sm:text-base"
            >
              View Our Work
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary/60 transition-colors text-sm sm:text-base"
            >
              <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              Our Services
            </a>
          </motion.div>
        </div>

        {/* Stats — fixed overflow: flex row on mobile with equal sizing, column on lg */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 0.8 }}
          className="mt-12 sm:mt-16 grid grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:max-w-sm"
        >
          {/* {stats.map((s) => (
            <div
              key={s.label}
              className="p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-card/70 backdrop-blur border border-border hover:border-primary/40 transition-colors min-w-0"
            >
              <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient-gold leading-tight">{s.value}</div>
              <div className="text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-muted-foreground mt-0.5 sm:mt-1 truncate">{s.label}</div>
            </div>
          ))} */}
        </motion.div>
      </div>
    </section>
  );
}
