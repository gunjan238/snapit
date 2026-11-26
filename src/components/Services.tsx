/* eslint-disable prettier/prettier */
/**
 * Services.tsx
 *
 * Media is served from the /public folder OR Google Drive.
 *
 * ── Local media ──────────────────────────────────────────────────────────────
 * Reference files as URL strings: e.g. "/weddings/BrideReel.mp4"
 * No imports needed — Vite/the browser resolves public/ paths directly.
 *
 * ── Google Drive media ───────────────────────────────────────────────────────
 * type: "drive-video"  → src is the Drive FILE ID of a video
 * type: "drive-image"  → src is the Drive FILE ID of an image
 *
 * Optional `poster` (e.g. "/gyms/reel-1.jpg") is tried FIRST as the thumbnail.
 * It is the most reliable option because it doesn't depend on Google.
 *
 * HOW TO GET A FILE ID FROM GOOGLE DRIVE:
 *   Open the file → Share → Copy link
 *   The link looks like:  https://drive.google.com/file/d/FILE_ID_HERE/view
 *   Copy just the FILE_ID_HERE part and paste it as `src`.
 *
 * HOW TO MAKE FILES PUBLICLY ACCESSIBLE:
 *   Right-click file → Share → Change to "Anyone with the link" → Viewer
 *
 * ── Placeholder IDs ──────────────────────────────────────────────────────────
 * Any src that is empty or starts with "YOUR_" is treated as "not filled in
 * yet" and shows a "No file mapped yet" card instead of a broken thumbnail.
 *
 * ── Thumbnails ───────────────────────────────────────────────────────────────
 * Every Drive thumbnail tries these sources in order until one loads:
 *   1. item.poster (your own image in /public)
 *   2. https://drive.google.com/thumbnail?id=...
 *   3. https://lh3.googleusercontent.com/d/...
 * If all fail, a gradient placeholder is shown (never a blank black card).
 *
 * ── Play button on service cards ─────────────────────────────────────────────
 * The play button is shown automatically whenever the first media item of a
 * service is a video ("video" or "drive-video"). `isVideo` on a ServiceItem is
 * still honoured as a manual override, but you no longer need to keep it in
 * sync with MEDIA_MAP.
 *
 * ── "View Full Album" button ─────────────────────────────────────────────────
 * Add an `albumUrl` string to any ServiceItem to show a button below the
 * gallery grid that opens the external album (Google Drive, etc.) in a new tab.
 *
 * ── "View More" button (under the service cards) ─────────────────────────────
 * Add a `viewMoreUrl` string to any Industry to show a "View More" button
 * directly below that industry's service cards. It opens the link (usually a
 * Google Drive folder) in a new tab. Placeholder URLs containing "YOUR_" hide
 * the button until you fill them in.
 *
 * ── Industry banner video ────────────────────────────────────────────────────
 * Add a `bannerVideoId` (Drive file ID) to any Industry to show a looping
 * muted video in the industry hero card instead of a static icon.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Shirt,
  HeartHandshake,
  UtensilsCrossed,
  Landmark,
  Newspaper,
  Lightbulb,
  Camera,
  Video,
  Megaphone,
  Instagram,
  Code2,
  BarChart3,
  PenLine,
  FileText,
  Mic,
  Palette,
  Search,
  Rocket,
  ArrowUpRight,
  ArrowLeft,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaType = "image" | "video" | "drive-video" | "drive-image";

type MediaItem = {
  type: MediaType;
  /**
   * For "image" and "video": path in /public, e.g. "/weddings/BrideReel.mp4"
   * For "drive-video" / "drive-image": the Google Drive FILE ID (not the URL)
   */
  src: string;
  /** Optional manual thumbnail, e.g. "/gyms/reel-1.jpg". Tried first. */
  poster?: string;
  caption?: string;
};

type ServiceItem = {
  label: string;
  slug: string;
  /** Manual override. The play button also appears automatically for video media. */
  isVideo?: boolean;
  albumUrl?: string;
};

type Industry = {
  icon: LucideIcon;
  name: string;
  slug: string;
  tagline: string;
  services: ServiceItem[];
  /**
   * Google Drive FILE ID for the looping banner video shown in the
   * industry hero card. Leave undefined to show the icon instead.
   */
  bannerVideoId?: string;
  /**
   * Drive folder (or any URL) opened by the "View More" button shown
   * below the service cards. Leave undefined to hide the button.
   */
  viewMoreUrl?: string;
};

const isDriveType = (t?: MediaType) => t === "drive-video" || t === "drive-image";

const isVideoType = (t?: MediaType) => t === "video" || t === "drive-video";

/** True when a src is empty or still a "YOUR_..." placeholder. */
const isUnsetSrc = (src?: string) => !src || src.startsWith("YOUR_");

// ─── Drive URL helpers ────────────────────────────────────────────────────────

/** Embeds a Drive video — plays natively inside an iframe */
function driveEmbedUrl(fileId: string) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/** Candidate thumbnail URLs, tried in order until one loads. */
function driveThumbnailUrls(fileId: string, size = 640) {
  return [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`,
    `https://lh3.googleusercontent.com/d/${fileId}=w${size}`,
  ];
}

/** Full-size image for the lightbox */
function driveImageUrl(fileId: string) {
  return `https://lh3.googleusercontent.com/d/${fileId}=w1920`;
}

// ─── Auto-thumbnail hook (local videos only) ──────────────────────────────────

function useVideoThumbnail(src: string): string | null {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;

    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 0.5;

    const capture = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumb(canvas.toDataURL("image/jpeg", 0.75));
      } catch {
        // CORS / decode error — leave null
      }
    };

    video.addEventListener("seeked", capture, { once: true });
    video.addEventListener("loadeddata", capture, { once: true });
    video.load();

    return () => {
      cancelled = true;
      video.src = "";
    };
  }, [src]);

  return thumb;
}

// ─── DriveThumb ───────────────────────────────────────────────────────────────
// Tries poster → Drive thumbnail → googleusercontent, then a gradient fallback.

function DriveThumb({
  fileId,
  poster,
  alt,
  className,
}: {
  fileId: string;
  poster?: string;
  alt: string;
  className?: string;
}) {
  const sources = [poster, ...driveThumbnailUrls(fileId)].filter(Boolean) as string[];
  const [idx, setIdx] = useState(0);

  if (idx >= sources.length) {
    return <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-black" />;
  }

  return (
    <img
      key={sources[idx]}
      src={sources[idx]}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}

// ─── DriveMediaCard ───────────────────────────────────────────────────────────

function DriveMediaCard({
  item,
  index,
  serviceLabel,
  onClick,
}: {
  item: MediaItem;
  index: number;
  serviceLabel: string;
  onClick: () => void;
}) {
  const isImage = item.type === "drive-image";

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 5) * 0.07, duration: 0.4 }}
      className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur
                 overflow-hidden text-left focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary aspect-[4/3]"
    >
      <div className="absolute inset-0 bg-black">
        <DriveThumb
          fileId={item.src}
          poster={item.poster}
          alt={item.caption ?? serviceLabel}
          className="absolute inset-0 w-full h-full object-cover opacity-90
                     group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />

        {!isImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur-sm
                         flex items-center justify-center shadow-gold
                         group-hover:scale-110 transition-transform duration-300"
            >
              <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-1" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-300 pointer-events-none" />

      {item.caption && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3
                     bg-gradient-to-t from-black/70 to-transparent
                     translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <span className="text-xs text-white/90">{item.caption}</span>
        </div>
      )}

      <div className="absolute top-3 left-3">
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                     bg-black/50 backdrop-blur text-[10px] text-white/80"
        >
          {isImage ? (
            <>
              <Camera className="h-3 w-3" />
              Photo
            </>
          ) : (
            <>
              <Video className="h-3 w-3" />
              Video
            </>
          )}
        </span>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
          <Maximize2 className="h-3.5 w-3.5 text-white/80" />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Lightbox: Drive video ────────────────────────────────────────────────────

function LightboxDriveVideo({ item }: { item: MediaItem }) {
  return (
    <div className="w-full aspect-video">
      <iframe
        key={item.src}
        src={driveEmbedUrl(item.src)}
        allow="autoplay"
        allowFullScreen
        className="w-full h-full border-0"
        title={item.caption ?? "Drive video"}
      />
    </div>
  );
}

// ─── Lightbox: Drive image ────────────────────────────────────────────────────

function LightboxDriveImage({ item }: { item: MediaItem }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      key={item.src}
      src={failed ? driveThumbnailUrls(item.src, 1600)[0] : driveImageUrl(item.src)}
      alt={item.caption ?? ""}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="max-h-[75vh] max-w-full object-contain"
    />
  );
}

// ─── ServiceCardPreview ────────────────────────────────────────────────────────

function ServiceCardPreview({
  service,
  mapKey,
  count,
  onClick,
  onPlay,
  delay,
}: {
  service: ServiceItem;
  mapKey: string;
  count: number;
  onClick: () => void;
  onPlay?: (item: MediaItem) => void;
  delay: number;
}) {
  const firstItem = MEDIA_MAP[mapKey]?.[0] ?? null;
  const firstIsReal = !!firstItem && !isUnsetSrc(firstItem.src);

  const isDrive = firstIsReal && isDriveType(firstItem?.type);
  const videoSrc = firstIsReal && firstItem?.type === "video" ? firstItem.src : "";
  const autoThumb = useVideoThumbnail(videoSrc);

  // Show the play button whenever the service is flagged as video OR its
  // first media item is actually a video — no need to keep the flag in sync.
  const showPlay = !!service.isVideo || isVideoType(firstItem?.type);

  const previewSrc: string | null = !firstIsReal
    ? null
    : isDrive
      ? "drive"
      : firstItem?.type === "image"
        ? firstItem.src
        : (firstItem?.poster ?? autoThumb ?? null);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="group relative rounded-2xl border border-border bg-card/70 backdrop-blur
                 hover:border-primary/60 hover:-translate-y-1 transition-all text-left
                 overflow-hidden focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-primary"
    >
      {/* Preview area */}
      <div className="relative h-28 overflow-hidden">
        {previewSrc ? (
          <>
            {isDrive && firstItem ? (
              <DriveThumb
                fileId={firstItem.src}
                poster={firstItem.poster}
                alt={service.label}
                className="absolute inset-0 w-full h-full object-cover opacity-60
                           group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <img
                src={previewSrc}
                alt={service.label}
                className="absolute inset-0 w-full h-full object-cover opacity-60
                           group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-glow/5" />
        )}

        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`grid-${service.slug}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#grid-${service.slug})`}
            className="text-primary"
          />
        </svg>

        {/* ── Play button — fires onPlay, does NOT open gallery ── */}
        {showPlay && firstItem && firstIsReal && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.(firstItem);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary/90
                       flex items-center justify-center opacity-80
                       group-hover:opacity-100 group-hover:scale-110 transition-all
                       hover:bg-primary focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary z-10"
            aria-label={`Preview ${service.label}`}
          >
            <Play className="h-3.5 w-3.5 text-primary-foreground fill-primary-foreground ml-0.5" />
          </button>
        )}

        {/* Fallback icon when no media is set yet */}
        {!previewSrc && !showPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary/60" />
            </div>
          </div>
        )}

        {/* Fallback centre play icon when no media is mapped yet */}
        {!firstIsReal && showPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="h-6 w-6 text-primary/60" />
            </div>
          </div>
        )}

        {count > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[10px] bg-black/50 text-white/70 px-2 py-0.5 rounded-full">
              {count} files
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
      </div>

      {/* Label row */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="absolute -top-2 left-6 h-2 w-2 rounded-full bg-primary" />
        <span className="text-sm font-medium text-foreground/90 leading-tight pr-2">
          {service.label}
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary
                     group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </div>
    </motion.button>
  );
}

// ─── VideoCard (local) ─────────────────────────────────────────────────────────

function VideoCard({
  item,
  index,
  serviceLabel,
  onClick,
}: {
  item: MediaItem;
  index: number;
  serviceLabel: string;
  onClick: () => void;
}) {
  const autoThumb = useVideoThumbnail(item.src);
  const poster = item.poster ?? autoThumb ?? undefined;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 5) * 0.07, duration: 0.4 }}
      className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur
                 overflow-hidden text-left focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-primary aspect-[4/3]"
    >
      <div className="absolute inset-0 bg-black">
        {poster ? (
          <img
            src={poster}
            alt={item.caption ?? serviceLabel}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100
                       group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-black" />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur-sm
                       flex items-center justify-center shadow-gold
                       group-hover:scale-110 transition-transform duration-300"
          >
            <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-1" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-300 pointer-events-none" />

      {item.caption && (
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3
                     bg-gradient-to-t from-black/70 to-transparent
                     translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <span className="text-xs text-white/90">{item.caption}</span>
        </div>
      )}

      <div className="absolute top-3 left-3">
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                     bg-black/50 backdrop-blur text-[10px] text-white/80"
        >
          <Video className="h-3 w-3" />
          Video
        </span>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
          <Maximize2 className="h-3.5 w-3.5 text-white/80" />
        </div>
      </div>
    </motion.button>
  );
}

// ─── LightboxVideo (local) ─────────────────────────────────────────────────────

function LightboxVideo({ item }: { item: MediaItem }) {
  const autoThumb = useVideoThumbnail(item.src);
  const poster = item.poster ?? autoThumb ?? undefined;

  return (
    <video
      key={item.src}
      src={item.src}
      poster={poster}
      controls
      autoPlay
      playsInline
      className="max-h-[75vh] max-w-full"
    />
  );
}

// ─── IndustryBannerVideo ──────────────────────────────────────────────────────

function IndustryBannerVideo({ fileId }: { fileId: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl">
      <img
        src={driveThumbnailUrls(fileId)[0]}
        alt="Industry banner"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <iframe
        ref={iframeRef}
        src={`${driveEmbedUrl(fileId)}?rm=minimal`}
        allow="autoplay"
        className="absolute inset-0 w-[300%] h-[300%] -top-full -left-full
                   pointer-events-none opacity-50 border-0 scale-50"
        title="Industry banner"
      />
      <div className="absolute inset-0 bg-black/50 rounded-3xl" />
    </div>
  );
}

// ─── Industries ───────────────────────────────────────────────────────────────

const RESTAURANTS_ALBUM_URL =
  "https://drive.google.com/drive/folders/YOUR_RESTAURANT_FOLDER_ID?usp=sharing";

const POLITICAL_ALBUM_URL =
  "https://drive.google.com/drive/folders/1QNaGxe15ZpX-TA_Rh-BxGxlwkPsE6jZH?usp=drive_link";

const GYMS_ALBUM_URL =
  "https://drive.google.com/drive/folders/1IL-z0ar1zRkKLS-82epEm8o1NTkaUXXu?usp=sharing";

const WEDDINGS_ALBUM_URL = "https://sites.google.com/view/weddings-by-snapit/work";

// ← NEW: replace YOUR_CLOTHING_FOLDER_ID with your real Drive folder ID
const CLOTHING_ALBUM_URL =
  "https://drive.google.com/drive/folders/1FOHHwoW0KZMZ-MOZHcVdc_7RgWoPv7bJ?usp=sharing";

// ← replace YOUR_PR_FOLDER_ID with your real Drive folder ID
const PR_ALBUM_URL =
  "https://drive.google.com/drive/folders/YOUR_PR_FOLDER_ID?usp=sharing";

const AI_ALBUM_URL =
  "https://drive.google.com/drive/folders/1LmViDhNklETzGyHRc7TP7T0Q3fgHgZfx?usp=drive_link";

const UGC_ALBUM_URL =
  "https://drive.google.com/drive/folders/18dzCbP-Jbtkqlg-TFypzn9ly7rGGIhCM";

const industries: Industry[] = [
  {
    icon: HeartHandshake,
    name: "Weddings",
    slug: "weddings",
    tagline: "Cinema for the big day.",
    viewMoreUrl: WEDDINGS_ALBUM_URL,
    services: [
      {
        label: "Films",
        slug: "cinematic-films",
        isVideo: true,
        albumUrl: WEDDINGS_ALBUM_URL,
      },
      {
        label: "Images",
        slug: "candid-photography",
        isVideo: false,
        albumUrl: WEDDINGS_ALBUM_URL,
      },
    ],
  },

  {
    icon: Dumbbell,
    name: "Gyms & Fitness",
    slug: "gyms-fitness",
    tagline: "Sweat, story, subscribers.",
    bannerVideoId: "YOUR_BANNER_FILE_ID",
    viewMoreUrl: GYMS_ALBUM_URL,
    services: [
      {
        label: "Trainer Reels",
        slug: "trainer-reels",
        isVideo: true,
        albumUrl: GYMS_ALBUM_URL,
      },
      {
        label: "Brand Shoots",
        slug: "brand-shoots",
        isVideo: true, // ← was false; Brand Shoots are all videos
        albumUrl: GYMS_ALBUM_URL,
      },
    ],
  },

  // ── NEW: Clothing (placed right next to Gyms & Fitness) ────────────────────
  {
    icon: Shirt,
    name: "Clothing & Fashion",
    slug: "clothing-fashion",
    tagline: "Drape it, shoot it, sell it.",
    bannerVideoId: "YOUR_BANNER_FILE_ID",
    viewMoreUrl: CLOTHING_ALBUM_URL,
    services: [
      {
        label: "Lookbook Reels",
        slug: "lookbook-reels",
        isVideo: true,
        albumUrl: CLOTHING_ALBUM_URL,
      },
    
    ],
  },

  {
    // ← icon changed from Dumbbell to BarChart3 (fits infographics + UGC)
    icon: BarChart3,
    name: "Infographics & UGC",
    slug: "info-ugc",
    tagline: "Learn and Grow",
    bannerVideoId: "YOUR_BANNER_FILE_ID",
    viewMoreUrl: UGC_ALBUM_URL,
    services: [
      {
        label: "UGC Reels",
        slug: "ugc-reels",
        isVideo: true,
        albumUrl: UGC_ALBUM_URL,
      },
    ],
  },

  {
    icon: UtensilsCrossed,
    name: "Restaurants & Cafés",
    slug: "restaurants-cafes",
    tagline: "Make every plate crave-worthy.",
    bannerVideoId: "YOUR_BANNER_FILE_ID",
    viewMoreUrl: RESTAURANTS_ALBUM_URL,
    services: [
      {
        label: "ASMR Food Films",
        slug: "asmr-food-films",
        isVideo: true,
        albumUrl: RESTAURANTS_ALBUM_URL,
      },
      {
        label: "Menu Reels",
        slug: "menu-reels",
        isVideo: true,
        albumUrl: RESTAURANTS_ALBUM_URL,
      },
    ],
  },

  {
    icon: Landmark,
    name: "Political",
    slug: "political",
    tagline: "Campaigns that move people.",
    viewMoreUrl: POLITICAL_ALBUM_URL,
    services: [
      {
        label: "Campaign Films",
        slug: "campaign-films",
        isVideo: true,
        albumUrl: POLITICAL_ALBUM_URL,
      },
      {
        label: "Rally & Event Coverage",
        slug: "rally-coverage",
        isVideo: false,
        albumUrl: POLITICAL_ALBUM_URL,
      },
    ],
  },

  // ── PR Reels ───────────────────────────────────────────────────────────────
  {
    icon: Newspaper,
    name: "PR Reels",
    slug: "pr-reels",
    tagline: "Stories the press can't ignore.",
    viewMoreUrl: PR_ALBUM_URL,
    services: [
      {
        label: "Anchor Reels",
        slug: "anchor-reels",
        isVideo: true,
        albumUrl: PR_ALBUM_URL,
      },
      {
        label: "Event Coverage",
        slug: "event-coverage",
        isVideo: true,
        albumUrl: PR_ALBUM_URL,
      },
    ],
  },

  // ── AI-Reels ───────────────────────────────────────────────────────────────
  {
    icon: Lightbulb,
    name: "AI-Reels",
    slug: "ai-reels",
    tagline: "Stories the press can't ignore.",
    viewMoreUrl: AI_ALBUM_URL,
    services: [
      {
        label: "Expo Reels",
        slug: "expo-reels",
        isVideo: true,
        albumUrl: AI_ALBUM_URL,
      },
      {
        label: "Event Coverage",
        slug: "ai-coverage",
        isVideo: true,
        albumUrl: AI_ALBUM_URL,
      },
    ],
  },
];

// ─── Capabilities ──────────────────────────────────────────────────────────────

const capabilities: { icon: LucideIcon; label: string; blurb: string }[] = [
  { icon: Camera, label: "Photography", blurb: "Editorial, product, lifestyle." },
  { icon: Video, label: "Videography", blurb: "Films, reels, ad spots." },
  { icon: Megaphone, label: "Digital Marketing", blurb: "Meta, Google, YouTube ads." },
  { icon: Instagram, label: "Social Media", blurb: "Strategy, content, community." },
  { icon: PenLine, label: "Scripting", blurb: "Ad scripts, hooks, storyboards." },
  { icon: FileText, label: "Content Writing", blurb: "Captions, blogs, web copy." },
  { icon: BarChart3, label: "Data Analysis", blurb: "Insights, dashboards, reporting." },
  { icon: Search, label: "SEO", blurb: "On-page, technical, local search." },
  { icon: Code2, label: "Web Development", blurb: "Fast, brand-first websites." },
  { icon: Palette, label: "Branding & Design", blurb: "Logos, identity, packaging." },
  { icon: Mic, label: "Voice-over & Audio", blurb: "VO, sound design, mixing." },
  { icon: Rocket, label: "Campaign Strategy", blurb: "Launches, funnels, growth." },
];

// ─── MEDIA MAP ─────────────────────────────────────────────────────────────────

const MEDIA_MAP: Record<string, MediaItem[]> = {
  "weddings/cinematic-films": [
    { type: "video", src: "/weddings/Teaser.mp4", caption: "Bride Reel" },
    { type: "video", src: "/weddings/SangeetReel.mp4", caption: "Teaser Film" },
    { type: "video", src: "/weddings/TULSI_.mp4", caption: "Tulsi Wedding" },
  ],

  "weddings/candid-photography": [
    { type: "image", src: "/weddings/DSC00906.jpg", caption: "Candid moment" },
    { type: "image", src: "/weddings/DSC01115.jpg" },
    { type: "image", src: "/weddings/IMG_4465.JPG" },
    { type: "image", src: "/weddings/IMG_4471.JPG" },
    { type: "image", src: "/weddings/Snap-04.jpg" },
    { type: "image", src: "/weddings/Snap-09.jpg" },
    { type: "image", src: "/weddings/Snap-14.jpg" },
    { type: "image", src: "/weddings/Snap-18.jpg" },
    { type: "image", src: "/weddings/Snap-24.jpg" },
    { type: "image", src: "/weddings/Snap-30.jpg" },
    { type: "image", src: "/weddings/DSC_5251.jpg" },
    { type: "image", src: "/weddings/DSC_5285.jpg" },
    { type: "image", src: "/weddings/DSC_5358.jpg" },
    { type: "image", src: "/weddings/DSC_5461.jpg" },
    { type: "image", src: "/weddings/DSC_5520.jpg" },
  ],

  "gyms-fitness/trainer-reels": [
    { type: "drive-video", src: "1201fz1ejjoJSG6pg1GMskuBwakul2GlO", caption: "Trainer Reel 1" },
    { type: "drive-video", src: "1yqZq200iszYLBhO97ZEIwCUBDp1BuJXi", caption: "Trainer Reel 2" },
    { type: "drive-video", src: "1-T7evg_NCrgOD6QmJMRs1EwJ0L9AAFaI", caption: "Trainer Reel 3" },
  ],

  "gyms-fitness/brand-shoots": [
    { type: "drive-video", src: "1-MUX58vnUBkJd-tZ_EDldXzDJWPltT8U", caption: "Brand shoot" },
    { type: "drive-video", src: "19A6SUKHEhklC3-RP6PZ2q7M_yH5psyQP" },
  ],

  // ── NEW: Clothing & Fashion — replace the YOUR_... placeholders with real
  //    Drive file IDs (or local /public paths) when you have the media ──────────
  "clothing-fashion/lookbook-reels": [
    { type: "drive-video", src: "1afFwklA4_MzEbrx1nPg77WIBmFbOIEpy", caption: "" },
    { type: "drive-video", src: "1qVUof4eteZktrvrEiVLwt9_vxQR3iXcv", caption: "" },
  ],


  "restaurants-cafes/asmr-food-films": [
    { type: "drive-video", src: "1ghTp5FX3a80vuhcqApxb4pvE54Ovnwtt", caption: "ASMR" },
    { type: "drive-video", src: "1xSd3EQcTXyGTGkt-gOjtYfo8NmUUAkCd" },
  ],

  "restaurants-cafes/menu-reels": [
    { type: "drive-video", src: "1dk8IrjJAScdlE4-rNsIxz82dXw0H3APZ", caption: "Menu Reel 1" },
    { type: "drive-video", src: "1TWeMA3qaLCG9FAnbqvxelWX_FPx7adI8", caption: "Menu Reel 2" },
  ],

  "political/campaign-films": [
    { type: "drive-video", src: "1uAAkrAW9ilT9UyqETZu2yfDEulY4ulTB", caption: "Campaign Film 1" },
    { type: "drive-video", src: "1xllJXz0uAAmgP-RP5lGo8QN0omNXe9ze", caption: "Campaign Film 2" },
  ],

  "political/rally-coverage": [
    { type: "drive-video", src: "1mEBF86Vd7qpH75g_XDfL7Nei16DYTkxI", caption: "Election" },
    { type: "drive-video", src: "1wo4V8IdcOauIz9AhYWfzghuQITVZvURl", caption: "Rally" },
  ],

  // ── PR Reels ──
  "pr-reels/anchor-reels": [
    { type: "drive-video", src: "1yxpSl9CMahtlPQv0j2oeHVTPI09uAJEg", caption: "Anchor Reel" },
  ],

  "pr-reels/event-coverage": [
    { type: "drive-video", src: "1Y8YrmgSbuFZ5vy9yttlDj0n2NxK1A7ge", caption: "Anchor Reel" },
  ],

  "ai-reels/ai-coverage": [
    { type: "drive-video", src: "1YyKwbeu491FChwzFQwuBgt1VnedxWinR", caption: "AI Reel" },
  ],

  "ai-reels/expo-reels": [
    { type: "drive-video", src: "1Z0PM-V1oC4Vu29fEnP36iyPm_wwbDGs0", caption: "AI Reel" },
  ],

  "info-ugc/ugc-reels": [
    { type: "drive-video", src: "1-xFTsngvyQhO8YzjSx5eY9RiA03x-MDD", caption: "Edtech" },
    { type: "drive-video", src: "1YAajsQQvmm0RpP1hZGyDfKauN7doiDuS", caption: "Edtech" },
    { type: "drive-video", src: "1yiN9zFnBOGCrZUMtdwXDSYt7KafPHy7W", caption: "Fintech" },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildPlaceholders(service: ServiceItem): MediaItem[] {
  return Array.from({ length: 4 }, (_, i) => ({
    type: service.isVideo ? "video" : ("image" as MediaType),
    src: "",
    caption: `Sample ${service.isVideo ? "Video" : "Photo"} ${i + 1}`,
  }));
}

// ─── Gallery view ──────────────────────────────────────────────────────────────

function ServiceGalleryView({
  industry,
  service,
  onBack,
}: {
  industry: Industry;
  service: ServiceItem;
  onBack: () => void;
}) {
  const key = `${industry.slug}/${service.slug}`;
  const items: MediaItem[] = MEDIA_MAP[key] ?? buildPlaceholders(service);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const isPlaceholder = (item: MediaItem) => isUnsetSrc(item.src);
  const visibleItems = items.slice(0, visibleCount);

  const handleKey = (e: React.KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === "Escape") setLightboxIndex(null);
    if (e.key === "ArrowRight") setLightboxIndex((i) => (i! + 1) % items.length);
    if (e.key === "ArrowLeft") setLightboxIndex((i) => (i! - 1 + items.length) % items.length);
  };

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4 }}
      onKeyDown={handleKey}
      tabIndex={-1}
      className="outline-none"
    >
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border
                     bg-card/60 hover:border-primary/60 text-sm text-muted-foreground
                     hover:text-foreground transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs tracking-[0.3em] uppercase text-primary shrink-0">
            {industry.name}
          </span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-semibold truncate">{service.label}</span>
        </div>
      </div>

      {/* Gallery heading */}
      <div className="mb-8">
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
          <span className="text-gradient-gold">{service.label}</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground italic">{industry.tagline}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "file" : "files"} · Click any to enlarge
        </p>
      </div>

      {/* Media grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleItems.map((item, i) =>
          isPlaceholder(item) ? (
            <motion.button
              key={i}
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 5) * 0.07, duration: 0.4 }}
              className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur
                         overflow-hidden text-left focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-primary aspect-[4/3]"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary-glow/5 gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.type === "video" || item.type === "drive-video" ? (
                    <Video className="h-6 w-6 text-primary/50" />
                  ) : (
                    <Camera className="h-6 w-6 text-primary/50" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{item.caption}</span>
                <span className="text-[10px] text-muted-foreground/50">No file mapped yet</span>
              </div>
            </motion.button>
          ) : isDriveType(item.type) ? (
            <DriveMediaCard
              key={i}
              item={item}
              index={i}
              serviceLabel={service.label}
              onClick={() => setLightboxIndex(i)}
            />
          ) : item.type === "image" ? (
            <motion.button
              key={i}
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 5) * 0.07, duration: 0.4 }}
              className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur
                         overflow-hidden text-left focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-primary aspect-[4/3]"
            >
              <img
                src={item.src}
                alt={item.caption ?? service.label}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-300 pointer-events-none" />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs text-white/90">{item.caption}</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] text-white/80">
                  <Camera className="h-3 w-3" />
                  Photo
                </span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                  <Maximize2 className="h-3.5 w-3.5 text-white/80" />
                </div>
              </div>
            </motion.button>
          ) : (
            <VideoCard
              key={i}
              item={item}
              index={i}
              serviceLabel={service.label}
              onClick={() => setLightboxIndex(i)}
            />
          )
        )}
      </div>

      {/* Load more */}
      {visibleCount < items.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + 12)}
            className="inline-flex items-center gap-2 h-11 px-8 rounded-full border border-border
                       bg-card/60 hover:border-primary/60 text-sm text-muted-foreground
                       hover:text-foreground transition-all"
          >
            Load more ({items.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* View Full Album button */}
      {service.albumUrl && !service.albumUrl.includes("YOUR_") && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-4 w-full max-w-sm">
            <div className="h-px flex-1 bg-border" />
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="h-px flex-1 bg-border" />
          </div>
          <a
            href={service.albumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 h-12 px-8 rounded-full
                       bg-gradient-gold text-primary-foreground font-semibold text-sm
                       shadow-gold hover:opacity-90 hover:-translate-y-0.5
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                       transition-all duration-200"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            View Full Album
          </a>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null &&
          (() => {
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
                <motion.div
                  initial={{ scale: 0.93, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.93, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-5xl mx-4"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-black max-h-[80vh] flex items-center justify-center">
                    {isPlaceholder(item) ? (
                      <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <p className="text-muted-foreground text-sm">{item.caption}</p>
                        <p className="text-muted-foreground/50 text-xs">
                          Add a Drive file ID or drop the file into{" "}
                          <code className="bg-white/10 px-1 rounded">public/</code> and update
                          the entry in <code className="bg-white/10 px-1 rounded">MEDIA_MAP</code>
                        </p>
                      </div>
                    ) : item.type === "drive-video" ? (
                      <LightboxDriveVideo item={item} />
                    ) : item.type === "drive-image" ? (
                      <LightboxDriveImage item={item} />
                    ) : item.type === "image" ? (
                      <img
                        src={item.src}
                        alt={item.caption ?? ""}
                        className="max-h-[75vh] max-w-full object-contain"
                      />
                    ) : (
                      <LightboxVideo item={item} />
                    )}
                  </div>

                  {item.caption && (
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                      {item.caption}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border
                                 bg-card/60 hover:border-primary/60 text-sm text-muted-foreground
                                 hover:text-foreground transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </button>

                    <span className="text-xs text-muted-foreground tracking-widest">
                      {lightboxIndex + 1} / {items.length}
                    </span>

                    <button
                      onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border
                                 bg-card/60 hover:border-primary/60 text-sm text-muted-foreground
                                 hover:text-foreground transition-all"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>

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
    </motion.div>
  );
}

// ─── Main Services component ──────────────────────────────────────────────────

export function Services() {
  const [active, setActive] = useState(0);
  const [gallery, setGallery] = useState<{
    industry: Industry;
    service: ServiceItem;
  } | null>(null);

  // Quick-play modal — opened by the play button on service cards
  const [videoPreview, setVideoPreview] = useState<MediaItem | null>(null);

  const current = industries[active];
  const Icon = current.icon;

  const hasBanner = !!current.bannerVideoId && !isUnsetSrc(current.bannerVideoId);
  const hasViewMore = !!current.viewMoreUrl && !current.viewMoreUrl.includes("YOUR_");

  return (
    <section id="services" className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2
                   w-[600px] h-[600px] rounded-full bg-primary/10
                   blur-[140px] pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-0
                   w-[400px] h-[400px] rounded-full bg-primary-glow/10
                   blur-[120px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {gallery ? (
            <ServiceGalleryView
              key="gallery"
              industry={gallery.industry}
              service={gallery.service}
              onBack={() => setGallery(null)}
            />
          ) : (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <SectionHeading
                eyebrow="Who we serve"
                title="One studio,"
                highlight="every industry."
                align="center"
              />

              {/* Industry selector */}
              <div className="mt-8 sm:mt-12 flex overflow-x-auto sm:flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none">
                {industries.map((ind, i) => {
                  const IIcon = ind.icon;
                  const isActive = i === active;
                  return (
                    <button
                      key={ind.name}
                      onClick={() => setActive(i)}
                      className={`inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-11 px-3 sm:px-5 rounded-full border transition-all shrink-0 ${isActive
                        ? "border-primary bg-primary/15 text-foreground shadow-gold"
                        : "border-border bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        }`}
                    >
                      <IIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span className="text-sm font-medium">{ind.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Industry content */}
              <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 sm:gap-8 items-stretch">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`hero-${current.name}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-3xl border border-border bg-card/60 backdrop-blur
                               p-8 flex flex-col justify-center overflow-hidden min-h-[260px]"
                  >
                    {hasBanner && (
                      <IndustryBannerVideo fileId={current.bannerVideoId!} />
                    )}

                    <div className="relative z-10">
                      {!hasBanner && (
                        <div className="relative mb-6 w-20 h-20">
                          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
                          <div className="relative w-20 h-20 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center">
                            <Icon className="h-9 w-9 text-primary-foreground" />
                          </div>
                        </div>
                      )}

                      {hasBanner && (
                        <div className="mb-4 w-12 h-12 rounded-full bg-primary/20 backdrop-blur flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      )}

                      <div className="text-xs tracking-[0.4em] uppercase text-primary mb-3">
                        Industry {String(active + 1).padStart(2, "0")} /{" "}
                        {String(industries.length).padStart(2, "0")}
                      </div>

                      <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        <span className="text-gradient-gold">{current.name}</span>
                      </h3>

                      <p className="mt-3 text-base text-muted-foreground italic">
                        {current.tagline}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`grid-${current.name}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col gap-4 sm:gap-5"
                  >
                    {/* Service cards */}
                    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 sm:gap-4">
                      {current.services.map((service, i) => {
                        const mapKey = `${current.slug}/${service.slug}`;
                        const count = MEDIA_MAP[mapKey]?.length ?? 0;
                        return (
                          <ServiceCardPreview
                            key={service.slug}
                            service={service}
                            mapKey={mapKey}
                            count={count}
                            onClick={() => setGallery({ industry: current, service })}
                            onPlay={(item) => setVideoPreview(item)}
                            delay={0.05 + i * 0.06}
                          />
                        );
                      })}
                    </div>

                    {/* View More → opens the industry's Drive folder in a new tab */}
                    {hasViewMore && (
                      <div className="flex justify-center">
                        <a
                          href={current.viewMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 h-11 px-7 rounded-full
                                     bg-gradient-gold text-primary-foreground font-semibold text-sm
                                     shadow-gold hover:opacity-90 hover:-translate-y-0.5
                                     focus-visible:outline-none focus-visible:ring-2
                                     focus-visible:ring-primary transition-all duration-200"
                        >
                          View More
                          <ExternalLink className="h-4 w-4 shrink-0" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Capability grid */}
              <div className="mt-24">
                <div className="text-center mb-10">
                  <div className="text-xs tracking-[0.4em] uppercase text-primary mb-3">
                    Full capability stack
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-semibold">
                    From{" "}
                    <span className="text-gradient-gold">script to strategy</span>{" "}
                    — under one roof.
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {capabilities.map((c, i) => (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: i * 0.04, duration: 0.35 }}
                      whileHover={{ y: -4 }}
                      className="group p-5 rounded-2xl border border-border bg-card/60 backdrop-blur
                                 hover:border-primary/60 transition-colors"
                    >
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/15
                                   flex items-center justify-center mb-3
                                   group-hover:bg-primary/25 transition-colors"
                      >
                        <c.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="text-sm font-semibold">{c.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{c.blurb}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Quick-play modal (triggered by play button on service cards) ── */}
      <AnimatePresence>
        {videoPreview && (
          <motion.div
            key="video-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
            onClick={() => setVideoPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl mx-4"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black">
                {videoPreview.type === "drive-video" ? (
                  <div className="w-full aspect-video">
                    <iframe
                      src={driveEmbedUrl(videoPreview.src)}
                      allow="autoplay"
                      allowFullScreen
                      className="w-full h-full border-0"
                      title={videoPreview.caption ?? "Video preview"}
                    />
                  </div>
                ) : (
                  <video
                    key={videoPreview.src}
                    src={videoPreview.src}
                    poster={videoPreview.poster}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[70vh]"
                  />
                )}
              </div>

              {videoPreview.caption && (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  {videoPreview.caption}
                </p>
              )}
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setVideoPreview(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10
                         hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}