/* eslint-disable prettier/prettier */
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
import drone from "@/assets/drone.png";
import camera from "@/assets/cam1.webp";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  specs: { label: string; value: string }[];
  image: string;
  bg: string;         // section background
  blob: string;       // decorative blob color
  titleColor: string; // huge title color
  accent: string;     // small accent color
};

const slides: Slide[] = [
  {
    id: "cinema",
    eyebrow: "01 — Cinema",
    title: "Cinema",
    copy: "Seeking frames that feel like scenes? Our cinematic photography turns every product, face and moment into a story worth watching.",
    specs: [
      { label: "format", value: "8K RAW" },
      { label: "lensing", value: "prime & anamorphic" },
      { label: "rig", value: "steadicam · gimbal" },
    ],
    image: camera,
    bg: "oklch(0.14 0.03 180)",
    blob: "oklch(0.55 0.12 180 / 0.55)",
    titleColor: "oklch(0.98 0.02 180)",
    accent: "oklch(0.86 0.07 180)",
  },
  {
    id: "aerial",
    eyebrow: "02 — Aerial",
    title: "Aerial",
    copy: "Take it higher. Our licensed drone unit paints your brand across skylines, coastlines and crowd shots that stop the scroll.",
    specs: [
      { label: "camera", value: "4K HDR · 10-bit" },
      { label: "range", value: "FPV · cinelifter" },
      { label: "clearance", value: "DGCA certified" },
    ],
    image: drone,
    bg: "oklch(0.18 0.04 30)",
    blob: "oklch(0.68 0.16 45 / 0.55)",
    titleColor: "oklch(0.98 0.03 60)",
    accent: "oklch(0.82 0.14 55)",
  },
  {
    id: "studio",
    eyebrow: "03 — Studio",
    title: "Studio",
    copy: "In-house sets, controlled light, obsessive detail. Product, editorial and campaign work built end-to-end from our Pune studio.",
    specs: [
      { label: "space", value: "2400 sq ft" },
      { label: "lights", value: "aputure · profoto" },
      { label: "output", value: "stills · reels · film" },
    ],
    image: camera,
    bg: "oklch(0.16 0.02 320)",
    blob: "oklch(0.62 0.16 330 / 0.55)",
    titleColor: "oklch(0.98 0.02 320)",
    accent: "oklch(0.85 0.10 320)",
  },
];

export function ScrollShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });

  return (
    <section
      id="showcase"
      ref={ref}
      className="relative"
      style={{ height: `${slides.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {slides.map((s, i) => (
          <Panel key={s.id} slide={s} index={i} total={slides.length} progress={smooth} />
        ))}

        {/* Scroll hint */}
        {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.5em] uppercase text-white/50 pointer-events-none">
          scroll
        </div> */}
      </div>
    </section>
  );
}

function Panel({
  slide,
  index,
  total,
  progress,
}: {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const mid = start + step / 2;
  const end = start + step;

  // Fade / slide the whole panel in and out
  const opacity = useTransform(progress, [start - 0.05, start + 0.05, end - 0.05, end + 0.05], [0, 1, 1, 0]);
  const panelY = useTransform(progress, [start, end], ["0%", "-8%"]);

  // Product image: rise from below, tilt, exit up
  const imgY = useTransform(progress, [start, mid, end], ["25%", "0%", "-25%"]);
  const imgRot = useTransform(progress, [start, end], [-18, 18]);
  const imgScale = useTransform(progress, [start, mid, end], [0.85, 1, 0.9]);

  // Giant title: horizontal drift
  const titleX = useTransform(progress, [start, end], ["-6%", "6%"]);
  // Blob subtle counter-drift
  const blobX = useTransform(progress, [start, end], ["4%", "-6%"]);
  const blobScale = useTransform(progress, [start, mid, end], [0.8, 1, 0.9]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, y: panelY, backgroundColor: slide.bg }}
    >
      {/* Doodle lines top-left */}
      <svg className="absolute top-16 right-24 w-32 h-32 opacity-60" viewBox="0 0 100 100" fill="none">
        <path d="M10 60 Q30 30 50 60 T90 60" stroke={slide.accent} strokeWidth="1.5" />
        <path d="M20 80 Q40 55 60 80" stroke={slide.accent} strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-24 left-24 w-24 h-24 opacity-50" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="6" stroke={slide.accent} strokeWidth="1.5" />
        <path d="M50 20 L50 44 M50 56 L50 80 M20 50 L44 50 M56 50 L80 50" stroke={slide.accent} strokeWidth="1.5" />
      </svg>

      {/* Decorative blob behind product */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46vmin] h-[46vmin] rounded-[42%_58%_63%_37%_/_43%_38%_62%_57%] blur-[2px]"
        style={{ backgroundColor: slide.blob, x: blobX, scale: blobScale }}
      />

      {/* Giant title behind product */}
      <motion.h2
        aria-hidden
        className="absolute left-0 right-0 top-[12%] text-center font-bold tracking-tight leading-none select-none pointer-events-none"
        style={{
          fontSize: "clamp(6rem, 18vw, 20rem)",
          color: slide.titleColor,
          x: titleX,
          mixBlendMode: "screen",
        }}
      >
        {slide.title}
      </motion.h2>

      {/* Product image, center stage */}
      <motion.img
        src={slide.image}
        alt={slide.title}
        className="relative z-10 h-[72vh] max-h-[720px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
        style={{ y: imgY, rotate: imgRot, scale: imgScale }}
      />

      {/* Left column: eyebrow + copy */}
      <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 max-w-[240px] md:max-w-[280px] z-20">
        <p
          className="text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4"
          style={{ color: slide.accent }}
        >
          {slide.eyebrow}
        </p>
        <p className="text-sm md:text-base leading-relaxed text-white/85">
          {slide.copy}
        </p>
      </div>

      {/* Right column: spec list */}
      <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 z-20">
        <p className="text-3xl md:text-4xl font-semibold mb-6 text-white">
          {String(index + 1).padStart(2, "0")}
          <span className="text-white/40 text-lg ml-2">/ {String(total).padStart(2, "0")}</span>
        </p>
        <ul className="space-y-4 min-w-[160px]">
          {slide.specs.map((sp) => (
            <li key={sp.label} className="border-t border-white/20 pt-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                {sp.label}
              </p>
              <p className="text-sm md:text-base text-white mt-1">{sp.value}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-30">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}