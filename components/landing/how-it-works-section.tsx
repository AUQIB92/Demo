"use client"

import { motion } from "framer-motion"
import { Calendar, ClipboardList, CreditCard, MapPin } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion"

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Choose Your Service",
    description: "Select from installation, repair, maintenance, or site inspection services.",
  },
  {
    icon: MapPin,
    step: "02",
    title: "Enter Location",
    description: "Provide your address and our AI calculates optimal pricing based on distance.",
  },
  {
    icon: Calendar,
    step: "03",
    title: "Schedule Appointment",
    description: "Pick a convenient date and time slot. Express service available for urgent needs.",
  },
  {
    icon: CreditCard,
    step: "04",
    title: "Confirm and Pay",
    description: "Review your booking, make payment via UPI or card, and track your technician live.",
  },
]

export function HowItWorksSection({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 sm:py-32">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="section-kicker justify-center">Process</span>
          <h2 className="section-title">
            Simple <span className="brand-gradient-text italic px-2">onboarding</span>
          </h2>
          <p className="section-copy mx-auto">
            A streamlined workflow from initial inquiry to final handover.
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 gap-20 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <StaggerItem key={step.step}>
              <div className="group relative">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/5 text-accent transition-all group-hover:bg-accent group-hover:text-white">
                  <step.icon className="h-7 w-7" />
                </div>

                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60">
                  Step {step.step}
                </div>
                <h3 className="mb-4 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground/80">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
