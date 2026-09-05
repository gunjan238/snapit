/* eslint-disable prettier/prettier */
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import wedding from "@/assets/project-wedding.jpg";
import fashion from "@/assets/project-fashion.jpg";
import product from "@/assets/project-product.jpg";
import election from "@/assets/project-election.jpg";
import { SectionHeading } from "./SectionHeading";

const projects = [
  { img: wedding, title: "Royal Wedding Film", category: "Wedding · 2024", span: "lg:col-span-2 lg:row-span-2" },
  { img: fashion, title: "Couture Editorial", category: "Fashion · 2024", span: "" },
  { img: product, title: "Luxe Product Launch", category: "Product · 2024", span: "" },
  { img: election, title: "Pune Campaign", category: "Political · 2024", span: "lg:col-span-2" },
];

const reels = [
  {
    img: fashion,
    title: "Brand Reel",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    img: wedding,
    title: "Wedding Teaser",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    img: product,
    title: "Product Story",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    img: election,
    title: "Rally Cut",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative pt-8 pb-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* <SectionHeading
          eyebrow="Selected Work"
          title="Stories we've"
          highlight="brought to life."
          description="From intimate weddings to nation-scale campaigns, here's a glimpse of recent projects."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16 auto-rows-[260px]">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href="#contact"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`group relative overflow-hidden rounded-2xl border border-border ${p.span}`}
            >
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-xs uppercase tracking-widest text-primary mb-1">{p.category}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-xl font-semibold pr-4">{p.title}</h3>
                  <ArrowUpRight className="h-5 w-5 text-primary opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </div>
              </div>
            </motion.a>
          ))}
        </div> */}

        {/* Reels showcase */}
        <ReelsSwipeStack />
      </div>
    </section>
  );
}

function ReelsSwipeStack() {
  const [order, setOrder] = useState(reels);

  const advance = (dir: 1 | -1) => {
    setOrder((prev) => {
      const next = [...prev];
      if (dir === 1) next.push(next.shift()!);
      else next.unshift(next.pop()!);
      return next;
    });
  };

  return (
    <div className="mt-0">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <h3 className="text-2xl font-semibold">
          Latest <span className="text-gradient-gold">reels</span>
         
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => advance(-1)}
            className="h-11 w-11 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary/60 transition"
            aria-label="Previous reel"
          >
            ←
          </button>
          <button
            onClick={() => advance(1)}
            className="h-11 w-11 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary/60 transition"
            aria-label="Next reel"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="relative mx-auto w-full max-w-[320px] aspect-[9/16]"
        style={{ perspective: "1200px" }}
      >
        {order.map((r, i) => {
          const isTop = i === 0;
          return (
            <ReelCard
              key={r.title}
              reel={r}
              index={i}
              isTop={isTop}
              total={order.length}
              onSwipe={() => advance(1)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ReelCard({
  reel,
  index,
  isTop,
  total,
  onSwipe,
}: {
  reel: (typeof reels)[number];
  index: number;
  isTop: boolean;
  total: number;
  onSwipe: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const depth = index;
  const scale = 1 - depth * 0.06;
  const y = depth * 18;
  const rotate = depth * -3;

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden border border-border shadow-card-luxe bg-card"
      style={{ zIndex: total - index, transformStyle: "preserve-3d" }}
      animate={{ scale, y, rotate, opacity: depth > 3 ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 400) {
          onSwipe();
        }
      }}
      whileDrag={{ cursor: "grabbing" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <img
        src={reel.img}
        alt={reel.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <AnimatePresence>
        {isTop && hovered && (
          <motion.video
            key="video"
            src={reel.video}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent pointer-events-none" />
      {!hovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
              ▶
            </span>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <p className="text-xs uppercase tracking-widest text-primary mb-1">Reel</p>
        <p className="font-semibold text-lg">{reel.title}</p>
      </div>
    </motion.div>
  );
}