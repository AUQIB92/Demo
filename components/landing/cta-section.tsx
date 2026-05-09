"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[4rem] bg-accent/5 px-8 py-16 text-center sm:px-16 lg:py-24"
        >
          <div className="relative z-10 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
            <Sparkles className="h-3 w-3" />
            AI Analysis
          </div>

          <h2 className="section-title relative z-10 mt-8">
            Uncertain about <span className="brand-gradient-text italic px-2">security?</span>
          </h2>

          <p className="section-copy relative z-10 mx-auto mt-8">
            Our AI-powered planner analyzes your space to craft a 
            custom strategy with instant pricing.
          </p>

          <div className="relative z-10 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/ai-planner">
              <Button size="lg" className="h-16 rounded-full px-12 text-lg font-bold shadow-none">
                Try Planner
              </Button>
            </Link>
            <Link href="/booking">
              <Button
                size="lg"
                variant="outline"
                className="h-16 rounded-full border-border/40 bg-background/20 px-12 text-lg font-bold backdrop-blur-sm transition-all hover:bg-background/40 hover:border-accent/30"
              >
                Schedule Visit
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
