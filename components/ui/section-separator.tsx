"use client"

import { motion } from "framer-motion"

export function SectionSeparator() {
  return (
    <div className="relative h-24 w-full overflow-hidden flex items-center justify-center">
      {/* Horizontal Line */}
      <div className="absolute left-1/2 top-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
      
      {/* Moving Light Effect */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-px w-48 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      {/* Subtle Dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30"
      />
    </div>
  )
}
