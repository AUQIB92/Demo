"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
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

function PricingContent() {
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
                Simple, transparent <span className="brand-gradient-text italic px-2">pricing</span>
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
                        ? "border-accent shadow-xl shadow-accent/5 ring-1 ring-accent" 
                        : "border-border/50"
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="mb-4 bg-accent text-accent-foreground border-0">
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-headline text-2xl text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-semibold text-foreground">
                        Rs {plan.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">{plan.cameras}</span>
                      </div>
                      <div className="space-y-2">
                        {plan.features.map((feature, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      {plan.notIncluded.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {plan.notIncluded.map((feature, j) => (
                            <div key={j} className="flex items-center gap-2 opacity-40">
                              <Check className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground line-through">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link href={`/booking?plan=${plan.name.toLowerCase()}`}>
                      <Button className={`w-full h-12 rounded-xl ${
                        plan.popular 
                          ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}>
                        Choose {plan.name}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* AMC Section */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <span className="section-kicker">Maintenance</span>
              <h2 className="text-headline text-3xl sm:text-4xl text-foreground mt-4">
                Annual Maintenance Contracts
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Keep your security system running smoothly with our comprehensive AMC plans.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              {amcPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="premium-card p-8 border-border/50"
                >
                  <h3 className="text-headline text-xl text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-semibold text-foreground">
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

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Spinner className="h-8 w-8 text-accent" /></div>}>
      <PricingContent />
    </Suspense>
  )
}
