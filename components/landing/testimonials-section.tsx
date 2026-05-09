"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion"

const testimonials = [
  {
    quote: "SecureVision transformed our office security. The AI monitoring has already prevented two potential break-ins. Worth every penny.",
    author: "Priya Sharma",
    role: "CEO, TechStart India",
    rating: 5,
  },
  {
    quote: "The installation team was professional and efficient. They completed our 8-camera setup in just one day. Excellent service.",
    author: "Rajesh Kumar",
    role: "Property Manager",
    rating: 5,
  },
  {
    quote: "Finally a security company that understands modern needs. The mobile app is intuitive and the 24/7 support is genuinely helpful.",
    author: "Anjali Patel",
    role: "Homeowner",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-shell">
      <div className="spotlight-orb right-[-15%] bottom-[-10%] h-[500px] w-[500px] bg-teal-500/5" />
      
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="section-kicker justify-center">Success Stories</span>
          <h2 className="section-title">
            Trusted by <span className="brand-gradient-text italic px-2">thousands</span> of clients
          </h2>
          <p className="section-copy mx-auto">
            Our commitment to excellence is reflected in the safety and satisfaction 
            of the homes and businesses we protect every day.
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.author}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                className="premium-card group flex h-full flex-col p-10"
              >
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex gap-1.5 text-accent">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-12 w-12 text-accent/10 transition-colors group-hover:text-accent/20" />
                </div>

                <p className="relative z-10 mb-10 mt-8 flex-1 text-lg leading-relaxed text-foreground/80 italic">
                  &quot;{testimonial.quote}&quot;
                </p>

                <div className="relative z-10 mt-auto flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-lg font-bold text-accent border border-accent/20 shadow-inner">
                    {testimonial.author
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground transition-colors group-hover:text-accent">{testimonial.author}</div>
                    <div className="text-sm font-medium text-muted-foreground/80">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
