"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustedBySection } from "@/components/landing/trusted-by-section"
import { ServicesSection } from "@/components/landing/services-section"
import { ProductsSection } from "@/components/landing/products-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"
import { SectionSeparator } from "@/components/ui/section-separator"
import { Spinner } from "@/components/ui/spinner"

function HomeContent() {
  const searchParams = useSearchParams()
  const activeView = searchParams.get("v") || "home"
  const [isLoading, setIsLoading] = useState(false)

  // Simulate loading state for transitions
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [activeView])

  const variants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm"
            >
              <Spinner className="h-8 w-8 text-accent" />
            </motion.div>
          ) : (
            <motion.div
              key={activeView}
              variants={variants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="w-full"
            >
              {activeView === "home" && (
                <>
                  <HeroSection />
                  <SectionSeparator />
                  <TrustedBySection />
                  <SectionSeparator />
                  <TestimonialsSection />
                </>
              )}
              {activeView === "services" && <ServicesSection />}
              {activeView === "products" && <ProductsSection />}
              {activeView === "process" && <HowItWorksSection />}
              {activeView === "faq" && <FAQSection />}
              
              {!["home", "services", "products", "process", "faq"].includes(activeView) && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <h2 className="text-3xl font-bold">Page not found</h2>
                  <p className="mt-4 text-muted-foreground">The requested section does not exist.</p>
                  <Link href="/?v=home" className="mt-8">
                    <Button>Back to Home</Button>
                  </Link>
                </div>
              )}
              
              <SectionSeparator />
              <CTASection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner /></div>}>
      <HomeContent />
    </Suspense>
  )
}
