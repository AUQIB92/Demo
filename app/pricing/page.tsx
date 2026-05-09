"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  ArrowRight,
  HelpCircle
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const plans = [
  {
    name: "Starter",
    description: "Perfect for small homes and apartments",
    price: 24999,
    cameras: "Up to 4 cameras",
    features: [
      "Professional installation",
      "4-channel NVR included",
      "Mobile app access",
      "1 year warranty",
      "Basic support",
    ],
    notIncluded: [
      "AI detection",
      "Cloud storage",
      "Priority support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for homes and small businesses",
    price: 54999,
    cameras: "Up to 8 cameras",
    features: [
      "Professional installation",
      "8-channel NVR with 2TB",
      "Mobile app access",
      "AI motion detection",
      "30-day cloud backup",
      "2 year warranty",
      "Priority support",
    ],
    notIncluded: [
      "24/7 monitoring",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Complete solution for businesses",
    price: 149999,
    cameras: "Up to 16 cameras",
    features: [
      "Professional installation",
      "16-channel NVR with 4TB",
      "Mobile & desktop access",
      "Advanced AI analytics",
      "90-day cloud backup",
      "24/7 professional monitoring",
      "3 year warranty",
      "Dedicated account manager",
      "Custom integrations",
    ],
    notIncluded: [],
    popular: false,
  },
]

const amcPlans = [
  {
    name: "Basic AMC",
    price: 4999,
    period: "per year",
    features: [
      "2 scheduled visits",
      "Remote support",
      "Software updates",
      "10% repair discount",
    ],
  },
  {
    name: "Premium AMC",
    price: 9999,
    period: "per year",
    features: [
      "4 scheduled visits",
      "24/7 priority support",
      "All software updates",
      "25% repair discount",
      "Free minor repairs",
      "Loaner equipment",
    ],
  },
]

export default function PricingPage() {
  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero */}
        <section className="pt-32 pb-16 relative">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="section-kicker">Pricing</span>
              <h1 className="mt-4 text-display text-4xl sm:text-5xl text-foreground">
                Simple, transparent <span className="teal-gradient-text">pricing</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                All-inclusive packages with professional installation. 
                No hidden fees, no surprises.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <StaggerContainer className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <StaggerItem key={plan.name}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className={`premium-card h-full p-8 ${
                      plan.popular 
                        ? "border-accent/35 bg-accent/10" 
                        : ""
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0">
                        Most Popular
                      </Badge>
                    )}

                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="text-headline text-2xl text-foreground mb-2">
                        {plan.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">
                        Rs {plan.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground ml-2">one-time</span>
                      <div className="text-sm text-accent mt-1">{plan.cameras}</div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3 opacity-50">
                          <div className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground line-through">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link href="/booking" className="block">
                      <Button 
                        className={`w-full h-12 ${
                          plan.popular 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "bg-accent text-accent-foreground hover:bg-accent/90"
                        }`}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* AMC Plans */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="section-kicker">Maintenance Plans</span>
              <h2 className="mt-4 text-display text-3xl sm:text-4xl text-foreground">
                Keep your system running
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Annual maintenance contracts ensure peak performance and extend the life of your equipment.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {amcPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="premium-card p-6"
                >
                  <h3 className="text-headline text-xl text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      Rs {plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-16 border-t border-border/50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <HelpCircle className="w-12 h-12 text-accent/50 mb-4" />
              <h2 className="text-headline text-2xl text-foreground mb-3">
                Have questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our team is here to help you choose the right plan for your needs.
              </p>
              <div className="flex gap-4">
                <Link href="/#faq">
                  <Button variant="outline" className="border-border/50">
                    View FAQ
                  </Button>
                </Link>
                <Link href="/ai-planner">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </TooltipProvider>
  )
}
