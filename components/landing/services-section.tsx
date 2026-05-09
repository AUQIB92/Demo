"use client"

import { motion } from "framer-motion"
import { Camera, Clock, Shield, Smartphone, Wifi, Wrench } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion"

const services = [
  {
    icon: Camera,
    title: "CCTV Installation",
    description: "Professional setup of dome, bullet, and PTZ cameras with optimal placement for maximum coverage.",
  },
  {
    icon: Wifi,
    title: "Smart Integration",
    description: "Connect your security system to smart home platforms for seamless control and automation.",
  },
  {
    icon: Shield,
    title: "AI Monitoring",
    description: "Advanced AI algorithms detect threats in real-time with instant alerts to your device.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock technical support and emergency response for complete peace of mind.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description: "Regular maintenance and AMC plans to keep your security infrastructure running perfectly.",
  },
  {
    icon: Smartphone,
    title: "Remote Access",
    description: "View live feeds and manage your system from anywhere with our mobile application.",
  },
]

export function ServicesSection({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 sm:py-32">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center lg:text-left"
        >
          <span className="section-kicker justify-center lg:justify-start">Expertise</span>
          <h2 className="section-title">
            Intelligent <span className="brand-gradient-text italic px-2">protection</span>
          </h2>
          <p className="section-copy mx-auto lg:mx-0">
            Professional surveillance solutions crafted for homes and businesses 
            that value both security and architectural aesthetics.
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <StaggerItem key={service.title}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4 }}
                className="group relative h-full"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/5 text-accent transition-all group-hover:bg-accent group-hover:text-white">
                  <service.icon className="h-6 w-6" />
                </div>
                
                <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground/80">
                  {service.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
