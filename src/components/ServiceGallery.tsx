/* eslint-disable prettier/prettier */
/**
 * ServiceGallery.tsx
 *
 * A full-page media gallery for a single service.
 * Reached via:  /services/:industrySlug/:serviceSlug
 *
 * Route state (from Services.tsx navigate call):
 *   industryName   — e.g. "Hotels & Hospitality"
 *   industryTagline — e.g. "Suites that sell themselves."
 *   serviceLabel   — e.g. "Property Films"
 *   serviceSlug    — e.g. "property-films"
 *   isVideo        — boolean
 *
 * ─── HOW TO WIRE UP YOUR REAL MEDIA ────────────────────────────────────────
 *  Replace the `MEDIA_MAP` object below with your actual file paths / URLs.
 *  Each key is `"${industrySlug}/${serviceSlug}"`.
 *  Each value is an array of MediaItem objects ({ type, src, poster?, caption? }).
 *
 *  For a headless CMS / API-driven approach, swap the MEDIA_MAP lookup inside
 *  `useEffect` for a fetch call and update `items` from the response.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Camera,
  Video,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type MediaType = "image" | "video";

type MediaItem = {
  type: MediaType;
  src: string;
  poster?: string; // thumbnail for video
  caption?: string;
};

// ─── Media map ──────────────────────────────────────────────────────────────
// Key format: "industry-slug/service-slug"
// Replace these placeholder arrays with your real file paths or CDN URLs.

const MEDIA_MAP: Record<string, MediaItem[]> = {
  // Hotels & Hospitality
  "hotels-hospitality/property-films": [
    { type: "video", src: "/media/hotels/property-film-1.mp4", poster: "/media/hotels/property-film-1-thumb.jpg", caption: "Grand Lobby Reveal" },
    { type: "video", src: "/media/hotels/property-film-2.mp4", poster: "/media/hotels/property-film-2-thumb.jpg", caption: "Rooftop Pool at Golden Hour" },
    { type: "image", src: "/media/hotels/property-1.jpg", caption: "Suite Overview" },
  ],
  "hotels-hospitality/interior-photography": [
    { type: "image", src: "/media/hotels/interior-1.jpg", caption: "Presidential Suite" },
    { type: "image", src: "/media/hotels/interior-2.jpg", caption: "Restaurant Ambience" },
    { type: "image", src: "/media/hotels/interior-3.jpg", caption: "Lobby Detail" },
    { type: "image", src: "/media/hotels/interior-4.jpg", caption: "Spa Lounge" },
  ],
  "hotels-hospitality/meta-google-ads": [
    { type: "video", src: "/media/hotels/ad-1.mp4", poster: "/media/hotels/ad-1-thumb.jpg", caption: "15s Meta Ad — Staycation" },
    { type: "video", src: "/media/hotels/ad-2.mp4", poster: "/media/hotels/ad-2-thumb.jpg", caption: "30s Google Display" },
  ],
  "hotels-hospitality/reels-reviews": [
    { type: "video", src: "/media/hotels/reel-1.mp4", poster: "/media/hotels/reel-1-thumb.jpg", caption: "Guest Experience Reel" },
    { type: "video", src: "/media/hotels/reel-2.mp4", poster: "/media/hotels/reel-2-thumb.jpg", caption: "Review Compilation" },
  ],

  // Add the remaining industries/services in the same pattern …
  // "gyms-fitness/trainer-reels": [ … ],
};

// ─── Fallback placeholder items (shown when no real media is mapped yet) ────

function buildPlaceholders(isVideo: boolean): MediaItem[] {
  return Array.from({ length: 4 }, (_, i) => ({
    type: isVideo ? "video" : "image",
    src: "",
    caption: `Sample ${isVideo ? "Video" : "Photo"} ${i + 1}`,
  }));
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ServiceGallery() {
  const navigate = useNavigate();
  const { industrySlug, serviceSlug } = useParams<{ industrySlug: string; serviceSlug: string }>();
  const { state } = useLocation() as {
    state: {
      industryName: string;
      industryTagline: string;
      serviceLabel: string;
      isVideo: boolean;
    } | null;
  };

  const key = `${industrySlug}/${serviceSlug}`;
  const rawItems = MEDIA_MAP[key] ?? buildPlaceholders(state?.isVideo ?? false);
  const [items] = useState<MediaItem[]>(rawItems);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const industryName  = state?.industryName  ?? "Service";
  const serviceLabel  = state?.serviceLabel  ?? "Gallery";
  const tagline       = state?.industryTagline ?? "";

  // Close lightbox on Escape, navigate with arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape")      setLightboxIndex(null);
      if (e.key === "ArrowRight")  setLightboxIndex((i) => (i! + 1) % items.length);
      if (e.key === "ArrowLeft")   setLightboxIndex((i) => (i! - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, items.length]);

  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    setPlaying(false);
  };

  const isPlaceholder = (item: MediaItem) => !item.src;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground
                       hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="h-5 w-px bg-border" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs tracking-[0.3em] uppercase text-primary shrink-0">
              {industryName}
            </span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm font-semibold truncate">{serviceLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Hero title ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-16 px-6">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
                        rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs tracking-[0.4em] uppercase text-primary mb-3">
              {industryName}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="text-gradient-gold">{serviceLabel}</span>
            </h1>
            {tagline && (
              <p className="mt-3 text-base text-muted-foreground italic">{tagline}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "file" : "files"} · Click any to enlarge
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Media grid ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => openLightbox(i)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur
                         overflow-hidden text-left focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-primary aspect-[4/3]"
            >
              {/* Media */}
              {isPlaceholder(item) ? (
                /* Placeholder when no real file is mapped */
                <div className="absolute inset-0 flex flex-col items-center justify-center
                                bg-gradient-to-br from-primary/10 to-primary-glow/5 gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.type === "video"
                      ? <Video className="h-6 w-6 text-primary/50" />
                      : <Camera className="h-6 w-6 text-primary/50" />
                    }
                  </div>
                  <span className="text-xs text-muted-foreground">{item.caption}</span>
                  <span className="text-[10px] text-muted-foreground/50">No file mapped yet</span>
                </div>
              ) : item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.caption ?? serviceLabel}
                  className="absolute inset-0 w-full h-full object-cover
                             group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                /* Video thumbnail */
                <div className="absolute inset-0 bg-black">
                  {item.poster && (
                    <img
                      src={item.poster}
                      alt={item.caption ?? serviceLabel}
                      className="w-full h-full object-cover opacity-70
                                 group-hover:opacity-90 transition-opacity duration-300"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur-sm
                                   flex items-center justify-center shadow-gold
                                   group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8
                              transition-colors duration-300 pointer-events-none" />

              {/* Caption bar */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3
                                bg-gradient-to-t from-black/70 to-transparent
                                translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs text-white/90">{item.caption}</span>
                </div>
              )}

              {/* Media-type badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                                 bg-black/50 backdrop-blur text-[10px] text-white/80">
                  {item.type === "video"
                    ? <><Video className="h-3 w-3" /> Video</>
                    : <><Camera className="h-3 w-3" /> Photo</>
                  }
                </span>
              </div>

              {/* Expand icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur
                               flex items-center justify-center">
                  <Maximize2 className="h-3.5 w-3.5 text-white/80" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (() => {
          const item = items[lightboxIndex];
          return (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Content — stop propagation so clicks inside don't close */}
              <motion.div
                initial={{ scale: 0.93, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.93, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl mx-4"
              >
                {/* Media area */}
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-[75vh] flex items-center justify-center">
                  {isPlaceholder(item) ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        {item.type === "video"
                          ? <Video className="h-8 w-8 text-primary/50" />
                          : <Camera className="h-8 w-8 text-primary/50" />
                        }
                      </div>
                      <p className="text-muted-foreground text-sm">{item.caption}</p>
                      <p className="text-muted-foreground/50 text-xs">
                        Map a real file in <code className="bg-white/10 px-1 rounded">MEDIA_MAP</code> inside ServiceGallery.tsx
                      </p>
                    </div>
                  ) : item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.caption ?? ""}
                      className="max-h-[75vh] max-w-full object-contain"
                    />
                  ) : (
                    <video
                      key={item.src}
                      src={item.src}
                      poster={item.poster}
                      controls
                      autoPlay
                      className="max-h-[75vh] max-w-full"
                    />
                  )}
                </div>

                {/* Caption */}
                {item.caption && (
                  <p className="mt-3 text-center text-sm text-muted-foreground">{item.caption}</p>
                )}

                {/* Controls row */}
                <div className="mt-4 flex items-center justify-between">
                  {/* Prev */}
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border
                               bg-card/60 hover:border-primary/60 text-sm text-muted-foreground
                               hover:text-foreground transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  {/* Counter */}
                  <span className="text-xs text-muted-foreground tracking-widest">
                    {lightboxIndex + 1} / {items.length}
                  </span>

                  {/* Next */}
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border
                               bg-card/60 hover:border-primary/60 text-sm text-muted-foreground
                               hover:text-foreground transition-all"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* Close button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                           flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}