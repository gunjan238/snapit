/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-primary mb-3 sm:mb-4">{eyebrow}</p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
        {title} {highlight && <span className="text-gradient-gold">{highlight}</span>}
      </h2>
      {description && (
        <p className="mt-4 sm:mt-5 text-muted-foreground text-base sm:text-lg leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
