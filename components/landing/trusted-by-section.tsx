"use client"

import { motion } from "framer-motion"

const brands = ["Google", "Microsoft", "Amazon", "Infosys", "Wipro", "TCS"]

export function TrustedBySection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel relative overflow-hidden rounded-[3.5rem] px-8 py-12 sm:px-16 sm:py-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-teal-500/5" />
          
          <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">Industry Standard</span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight">
                HR Security Services is the preferred choice for premium surveillance installations.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:w-1/2">
              {[
                { value: "4.9/5", label: "Rating" },
                { value: "98%", label: "Renewal" },
                { value: "150+", label: "Experts" },
                { value: "7 Cities", label: "Presence" },
              ].map((metric) => (
                <div key={metric.label} className="group cursor-default rounded-[2rem] border border-border/40 bg-background/40 p-6 text-center transition-all duration-300 hover:border-accent/40 hover:bg-background/60">
                  <div className="text-2xl font-bold text-accent transition-transform duration-300 group-hover:scale-110">{metric.value}</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 group-hover:text-accent/60">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 border-t border-border/10 pt-12">
            {brands.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-border/40 bg-background/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/40 transition-all duration-300 hover:border-accent/30 hover:bg-background/40 hover:text-accent/60"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
