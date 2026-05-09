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
  Camera, 
  Wrench, 
  Settings, 
  ClipboardCheck,
  Check,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Award
} from "lucide-react"

const services = [
  {
    id: "installation",
    icon: Camera,
    title: "CCTV Installation",
    description: "Professional installation of security cameras with optimal placement for maximum coverage. Includes cabling, mounting, and full system configuration.",
    features: [
      "Site survey and planning",
      "Professional mounting",
      "Cable management",
      "System configuration",
      "Mobile app setup",
      "User training"
    ],
    price: "From Rs 1,999",
    popular: true,
  },
  {
    id: "repair",
    icon: Wrench,
    title: "Repair & Support",
    description: "Expert diagnosis and repair of faulty cameras, recorders, and networking equipment. Quick turnaround with warranty on all repairs.",
    features: [
      "Camera repair",
      "NVR/DVR repair",
      "Cable replacement",
      "Network troubleshooting",
      "Hardware replacement",
      "Emergency service"
    ],
    price: "From Rs 999",
    popular: false,
  },
  {
    id: "maintenance",
    icon: Settings,
    title: "Maintenance & AMC",
    description: "Regular maintenance keeps your security system running at peak performance. Annual plans include priority support and discounted repairs.",
    features: [
      "Quarterly inspections",
      "Lens cleaning",
      "Software updates",
      "Performance optimization",
      "Priority support",
      "Discounted repairs"
    ],
    price: "From Rs 4,999/year",
    popular: false,
  },
  {
    id: "inspection",
    icon: ClipboardCheck,
    title: "Site Inspection",
    description: "Comprehensive security assessment of your property. Our experts identify vulnerabilities and recommend the optimal security solution.",
    features: [
      "Property walkthrough",
      "Vulnerability assessment",
      "Coverage mapping",
      "Equipment recommendation",
      "Cost estimation",
      "Detailed report"
    ],
    price: "Rs 499 (Adjustable)",
    popular: false,
  },
]

const stats = [
  { icon: Shield, value: "50,000+", label: "Installations" },
  { icon: Clock, value: "< 2 hrs", label: "Response Time" },
  { icon: Users, value: "200+", label: "Technicians" },
  { icon: Award, value: "4.9★", label: "Rating" },
]

function ServicesContent() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
              <span className="section-kicker">Services</span>
            <h1 className="mt-4 text-display text-4xl sm:text-5xl md:text-6xl text-foreground">
              Professional security
              <br />
                <span className="teal-gradient-text">services</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              From installation to maintenance, we provide end-to-end security solutions 
              with certified technicians and transparent pricing.
            </p>
          </motion.div>

          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <StaggerItem key={i}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <StaggerItem key={service.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="premium-card h-full p-8"
                >
                  {service.popular && (
                    <Badge className="absolute right-6 top-6 border-0 bg-accent/92 text-accent-foreground">
                      Most Popular
                    </Badge>
                  )}

                  {/* Icon */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/12">
                    <service.icon className="w-7 h-7 text-accent" />
                  </div>

                  {/* Content */}
                  <h2 className="text-headline text-2xl text-foreground mb-3">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {service.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <span className="text-xl font-semibold text-foreground">
                      {service.price}
                    </span>
                    <Link href="/booking">
                      <Button className="group rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Book Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-display text-3xl sm:text-4xl text-foreground mb-5">
              Not sure what you need?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Schedule a free site inspection and our experts will recommend 
              the perfect security solution for your property.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button size="lg" className="h-14 rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/90">
                  Schedule Inspection
                </Button>
              </Link>
              <Link href="/ai-planner">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 h-14 border-border/50 hover:border-border"
                >
                  Try AI Planner
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Spinner className="h-8 w-8 text-accent" /></div>}>
      <ServicesContent />
    </Suspense>
  )
}
