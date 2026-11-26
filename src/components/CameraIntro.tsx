/* eslint-disable prettier/prettier */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/snapitt-logo.png";

export function CameraIntro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute flex flex-col items-center gap-3 sm:gap-4 px-6"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-2xl animate-pulse" />
              <img
                src={logoAsset}
                alt="SnapIt"
                className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain rounded-2xl"
              />
            </div>
            <motion.p
              className="text-[10px] sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] text-primary uppercase text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Capturing Stories · Crafting Brands
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
