"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import {
  Shield,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedCounter, ParallaxSection, FloatingElement, MagneticButton } from "@/components/motion"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05])
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 150])

  const stats = [
    { value: 50, label: "K+ installations", suffix: "K+" },
    { value: 24, label: "support", suffix: "/7", prefix: "" },
    { value: 4.9, label: "rating", suffix: "/5", prefix: "", decimals: 1 },
  ]

  const highlights = [
    {
      icon: Shield,
      title: "AI detection",
      copy: "Smarter alerts for people, motion, and suspicious activity.",
    },
    {
      icon: Smartphone,
      title: "Remote access",
      copy: "Live view and playback on your phone without complexity.",
    },
    {
      icon: Zap,
      title: "Clean installation",
      copy: "Neat cable routing and fast setup for homes and offices.",
    },
  ]

  return (
    <section ref={containerRef} className="relative overflow-hidden pb-24 pt-36 sm:pt-48">
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      <motion.div 
        className="spotlight-orb right-[-5%] top-[-5%] h-[500px] w-[500px] bg-accent/10"
        style={{ y: heroY }}
      />
      <motion.div 
        className="spotlight-orb left-[-10%] top-[30%] h-[400px] w-[400px] bg-teal-500/5"
        style={{ y: orbY }}
      />

      <div className="section-inner relative z-10">
        <div className="grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl" style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-kicker flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <FloatingElement amplitude={3} duration={2}>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Sparkles className="h-2.5 w-2.5" />
                  </div>
                </FloatingElement>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent/80">Premium Surveillance</span>
              </div>
              <div className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30">
                Minimildtic © 2026
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-8 text-6xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-[6.5rem] leading-[0.85] lg:leading-[0.8]"
            >
              Security that <br />
              <span className="brand-gradient-text italic px-2">belongs.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-10 max-w-lg text-lg leading-relaxed text-muted-foreground/90 sm:text-xl lg:text-2xl"
            >
              Intelligent protection for modern architecture. <br className="hidden lg:block" />
              Minimalist hardware paired with precision AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center"
            >
              <MagneticButton strength={0.15}>
                <Link href="/booking">
                  <Button size="lg" className="h-16 rounded-full px-12 text-xl font-bold shadow-2xl shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Book Installation
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <Link href="/ai-planner">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 rounded-full border-border/60 bg-background/20 px-12 text-xl font-bold backdrop-blur-md transition-all hover:bg-background/40 hover:border-accent/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get AI Quote
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>

            <motion.div
              ref={statsRef}
              initial={{ opacity: 0 }}
              animate={isStatsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-16 flex items-center gap-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <div className="text-3xl font-bold tracking-tight text-foreground">
                    <AnimatedCounter 
                      to={stat.value} 
                      suffix={stat.suffix || ""} 
                      prefix={stat.prefix || ""}
                      decimals={stat.decimals ?? 0}
                    />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ y: imageY, scale: imageScale }}
            className="relative"
          >
            <div className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
              <div className="absolute inset-0 animate-radar rounded-full border border-accent" />
            </div>

            <ParallaxSection speed={0.3} className="relative z-10 overflow-hidden rounded-[4rem] p-3 sm:p-4 glass-panel">
              <div className="relative overflow-hidden rounded-[3rem] bg-black/5 dark:bg-black/20">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src="/product-images/dome-pro-4k.png"
                    alt="Dome Pro 4K security camera"
                    fill
                    className="object-cover mix-blend-screen brightness-110"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                  />
                  <div className="animate-scan absolute left-0 right-0 z-20 h-px bg-accent/30" />
                  
                  <div className="absolute inset-0 z-10 p-8 pointer-events-none">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md border border-white/10">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Live</span>
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                        4K UHD · ISO 100
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxSection>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
