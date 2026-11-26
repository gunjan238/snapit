/* eslint-disable prettier/prettier */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const reels = [
  {
    title: "Valued Feedback",
    video: "/weddings/feedback1.mp4",
    label: "Wedding",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative pt-8 pb-16 sm:pb-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
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
      <div className="flex items-end justify-between mb-6 sm:mb-8 flex-wrap gap-4">
        <h3 className="text-xl sm:text-2xl font-semibold">
          Feed<span className="text-gradient-gold">backs</span>
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => advance(-1)}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary/60 transition"
            aria-label="Previous reel"
          >
            ←
          </button>
          <button
            onClick={() => advance(1)}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary/60 transition"
            aria-label="Next reel"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="relative mx-auto w-full max-w-[260px] xs:max-w-[290px] sm:max-w-[320px] md:max-w-[340px] aspect-[9/16]"
        style={{ perspective: "1200px" }}
      >
        {order.map((r, i) => (
          <ReelCard
            key={r.title}
            reel={r}
            index={i}
            isTop={i === 0}
            total={order.length}
            onSwipe={() => advance(1)}
          />
        ))}
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
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const draggedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const depth = index;
  const scale = 1 - depth * 0.06;
  const y = depth * 18;
  const rotate = depth * -3;

  const pauseVideo = () => {
    const vid = videoRef.current;
    if (vid && !vid.paused) {
      vid.pause();
      vid.muted = true;
    }
    setPlaying(false);
  };

  // Pause when card scrolls out of view
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !isTop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) pauseVideo();
      },
      { threshold: 0.3 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [isTop]);

  // Scroll event fallback
  useEffect(() => {
    if (!isTop) return;

    const handleScroll = () => {
      const vid = videoRef.current;
      if (!vid || vid.paused) return;

      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.9 &&
        rect.bottom > window.innerHeight * 0.1;

      if (!inView) pauseVideo();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTop]);

  // Pause when card is no longer top
  useEffect(() => {
    if (!isTop) pauseVideo();
  }, [isTop]);

  const handleTap = () => {
    if (draggedRef.current) return;
    if (!isTop || !reel.video) return;

    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      setPlaying(true);
      setTimeout(() => {
        const vid = videoRef.current;
        if (vid) {
          vid.muted = false;
          vid.play().catch(() => {
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
      }, 50);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 rounded-2xl overflow-hidden border border-border shadow-card-luxe bg-card cursor-pointer"
      style={{ zIndex: total - index, transformStyle: "preserve-3d" }}
      animate={{ scale, y, rotate, opacity: depth > 3 ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => { draggedRef.current = false; }}
      onDrag={(_, info) => {
        if (Math.abs(info.offset.x) > 5) draggedRef.current = true;
      }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 400) {
          pauseVideo();
          onSwipe();
        }
      }}
      onTap={handleTap}
    >
      {/* Video — always visible, shows first frame as natural poster */}
      <video
        ref={videoRef}
        src={reel.video}
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent pointer-events-none" />

      {/* Play button — shown when not playing */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            key="play-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
              <span className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold text-sm sm:text-base">
                ▶
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom label */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 pointer-events-none">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-primary mb-1">
          {reel.label ?? "Reel"}
        </p>
        <p className="font-semibold text-base sm:text-lg">{reel.title}</p>
      </div>
    </motion.div>
  );
}