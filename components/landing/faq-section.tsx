"use client"

import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How long does a typical CCTV installation take?",
    answer:
      "A standard installation of 4 to 8 cameras typically takes 4 to 6 hours. Larger installations may require 1 to 2 days. Our team arrives with all necessary equipment and ensures minimal disruption to your daily activities.",
  },
  {
    question: "Do you provide warranty on products and installation?",
    answer:
      "Yes, all our products come with a minimum 2-year manufacturer warranty. Installation work is covered under a 1-year service warranty. Extended warranty plans are available for comprehensive coverage.",
  },
  {
    question: "Can I monitor my cameras remotely?",
    answer:
      "Absolutely. All our systems come with free mobile app access for iOS and Android. You can view live feeds, receive alerts, and control your cameras from anywhere in the world with an internet connection.",
  },
  {
    question: "What is included in your AMC plans?",
    answer:
      "Our Annual Maintenance Contracts include quarterly inspections, unlimited remote support, priority emergency response, software updates, and discounted repairs. Different tiers are available based on your needs.",
  },
  {
    question: "How does distance-based pricing work?",
    answer:
      "Our pricing is transparent and calculated based on your service requirements plus distance from our nearest technician hub. You will see the exact breakdown before confirming your booking with no hidden charges.",
  },
  {
    question: "Do you offer financing or EMI options?",
    answer:
      "Yes, we partner with leading banks to offer 0 percent EMI options on purchases above Rs 15,000. You can also pay via UPI, cards, or net banking. Flexible payment plans are available for larger projects.",
  },
]

export function FAQSection({ id }: { id?: string }) {
  return (
    <section id={id} className="section-shell">
      <div className="spotlight-orb left-[-10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 bg-teal-500/5" />
      
      <div className="section-inner">
        <div className="grid gap-24 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32 h-fit"
          >
            <span className="section-kicker">Knowledge Base</span>
            <h2 className="section-title">
              Common <span className="brand-gradient-text italic px-2">questions</span>
            </h2>
            <p className="section-copy">
              Clear answers to the most frequent inquiries about our products, 
              installation process, and long-term support.
            </p>

            <div className="glass-panel mt-12 rounded-[2.5rem] p-10">
              <div className="text-xl font-bold text-foreground">Need specialized advice?</div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Our security experts are available for detailed consultations. 
                Whether it&apos;s a complex industrial layout or a custom home setup, 
                we&apos;re here to guide you.
              </p>
              <div className="mt-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Average response time</div>
                <div className="mt-1 text-2xl font-bold text-foreground">Under 15 minutes</div>
              </div>
            </div>
          </motion.div>

          <StaggerContainer>
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <StaggerItem key={faq.question}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="premium-card group border-border/40 px-8 transition-all duration-300 data-[state=open]:border-accent/40 data-[state=open]:shadow-xl data-[state=open]:shadow-accent/5"
                  >
                    <AccordionTrigger className="py-8 text-left text-lg font-bold tracking-tight text-foreground hover:no-underline transition-colors group-hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 text-base leading-relaxed text-muted-foreground border-t border-border/10 pt-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </StaggerItem>
              ))}
            </Accordion>
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
