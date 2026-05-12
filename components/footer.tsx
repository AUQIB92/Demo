"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Eye, Instagram, Linkedin, MessageCircle, Phone, Twitter } from "lucide-react"
import { RevealOnScroll, MorphingShape } from "@/components/motion"

const footerLinks = {
  Solutions: [
    { label: "CCTV Installation", href: "/services/installation" },
    { label: "Smart Integration", href: "/services/smart" },
    { label: "AI Monitoring", href: "/services/monitoring" },
    { label: "Maintenance", href: "/services/maintenance" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

export function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <footer ref={ref} className="pb-12 pt-16 relative overflow-hidden">
      <MorphingShape 
        className="absolute -left-20 top-1/2 w-60 h-60 opacity-30" 
        color="bg-accent/10"
        delay={0}
      />
      <MorphingShape 
        className="absolute -right-20 bottom-0 w-80 h-80 opacity-20" 
        color="bg-teal-500/10"
        delay={5}
      />
      
      <motion.div style={{ y }}>
        <div className="section-inner relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="glass-panel rounded-[3rem] px-8 py-12 sm:px-12"
          >
            <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
              <div className="flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-center gap-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-lg">
                      <Eye className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tight text-foreground">HR SECURITY</span>
                      <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-accent">Services</span>
                    </div>
                  </motion.div>
                  <p className="max-w-md text-base leading-relaxed text-muted-foreground/80">
                    Intelligent surveillance solutions by HR Security Services. 
                    Minimalist hardware, maximum protection.
                  </p>
                  <div className="flex flex-col gap-3 pt-2">
                    <motion.a 
                      href="tel:7006255363" 
                      className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors hover:text-accent"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Phone className="h-4 w-4" />
                      </div>
                      +91 7006255363
                    </motion.a>
                    <motion.a 
                      href="https://wa.me/917006255363" 
                      target="_blank" 
                      className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors hover:text-accent"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      WhatsApp Support
                    </motion.a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-background/40 text-muted-foreground/60 transition-all"
                      whileHover={{ y: -3, borderColor: "var(--accent)", backgroundColor: "var(--accent)/10", color: "var(--accent)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <social.icon className="h-4 w-4" />
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {Object.entries(footerLinks).map(([title, links], idx) => (
                  <RevealOnScroll key={title} delay={idx * 0.1} direction="up">
                    <div>
                      <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/40">
                        {title}
                      </h4>
                      <ul className="space-y-4">
                        {links.map((link, i) => (
                          <li key={i}>
                            <motion.div
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground/70 transition-colors hover:text-accent"
                              >
                                {link.label}
                              </Link>
                            </motion.div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>

            <motion.div 
              className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/10 pt-8 sm:flex-row"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                © {new Date().getFullYear()} HR Security Services. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="h-1 w-1 rounded-full bg-accent"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60">
                  Network Status: Operational
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}
