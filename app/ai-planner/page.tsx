"use client"

import { Suspense, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { 
  Sparkles, 
  Building2, 
  Home, 
  Factory,
  Store,
  ChevronRight,
  Camera,
  Shield,
  Eye,
  Check,
  ArrowRight
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"

const propertyTypes = [
  { id: "home", icon: Home, label: "Home" },
  { id: "apartment", icon: Building2, label: "Apartment" },
  { id: "office", icon: Building2, label: "Office" },
  { id: "retail", icon: Store, label: "Retail Store" },
  { id: "warehouse", icon: Factory, label: "Warehouse" },
]

const coverageAreas = [
  { id: "indoor", label: "Indoor Only" },
  { id: "outdoor", label: "Outdoor Only" },
  { id: "both", label: "Indoor + Outdoor" },
]

interface Recommendation {
  cameraCount: number
  cameras: { type: string; count: number; price: number }[]
  coverageScore: number
  totalPrice: number
  features: string[]
}

function AIPlannerContent() {
  const [step, setStep] = useState(1)
  const [propertyType, setPropertyType] = useState<string | null>(null)
  const [floors, setFloors] = useState(1)
  const [coverageArea, setCoverageArea] = useState("both")
  const [budget, setBudget] = useState([50000])
  const [areaSize, setAreaSize] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)

  const generateRecommendation = () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const baseCount = Math.max(2, Math.ceil(parseInt(areaSize || "1000") / 400))
      const floorMultiplier = floors
      const budgetFactor = budget[0] / 50000
      
      const totalCameras = Math.min(16, Math.round(baseCount * floorMultiplier * budgetFactor))
      
      const rec: Recommendation = {
        cameraCount: totalCameras,
        cameras: [
          { type: "Dome Pro 4K", count: Math.ceil(totalCameras * 0.5), price: 12999 },
          { type: "Bullet Elite", count: Math.ceil(totalCameras * 0.3), price: 15999 },
          { type: "PTZ Guardian", count: Math.max(1, Math.floor(totalCameras * 0.2)), price: 34999 },
        ],
        coverageScore: Math.min(98, 70 + Math.round(budgetFactor * 28)),
        totalPrice: Math.round(budget[0] * 0.85),
        features: [
          "AI-powered motion detection",
          "24/7 cloud recording",
          "Mobile app access",
          "Night vision coverage",
          floors > 1 ? "Multi-floor monitoring" : "Single-floor optimization",
        ],
      }
      
      setRecommendation(rec)
      setIsAnalyzing(false)
      setStep(2)
    }, 2500)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="section-kicker mb-6">
              <Sparkles className="w-4 h-4" />
              AI Security Planner
            </div>
            <h1 className="text-display text-4xl sm:text-5xl md:text-6xl text-foreground">
              Get your perfect
              <br />
              <span className="teal-gradient-text">security setup</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Answer a few questions and our AI will recommend the optimal camera configuration for your property.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Planner */}
      <section className="py-16 pb-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Input Form */}
            {step === 1 && !isAnalyzing && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                {/* Property Type */}
                <div>
                  <Label className="text-lg font-medium text-foreground mb-4 block">
                    What type of property?
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {propertyTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setPropertyType(type.id)}
                        className={`p-4 rounded-xl border text-center transition-colors ${
                          propertyType === type.id
                            ? "bg-accent/10 border-accent/50"
                            : "bg-card border-border/50 hover:border-accent/30"
                        }`}
                      >
                        <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                          propertyType === type.id ? "text-accent" : "text-muted-foreground"
                        }`} />
                        <span className={`text-sm ${
                          propertyType === type.id ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {type.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Floors */}
                <div>
                  <Label className="text-lg font-medium text-foreground mb-4 block">
                    Number of floors
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[floors]}
                      onValueChange={(value) => setFloors(value[0])}
                      min={1}
                      max={5}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-16 text-center text-2xl font-semibold text-foreground">
                      {floors}
                    </span>
                  </div>
                </div>

                {/* Coverage Area */}
                <div>
                  <Label className="text-lg font-medium text-foreground mb-4 block">
                    Coverage requirement
                  </Label>
                  <RadioGroup 
                    value={coverageArea} 
                    onValueChange={setCoverageArea}
                    className="grid sm:grid-cols-3 gap-3"
                  >
                    {coverageAreas.map((area) => (
                      <label
                        key={area.id}
                        className={`p-4 rounded-xl border cursor-pointer text-center transition-colors ${
                          coverageArea === area.id
                            ? "bg-accent/10 border-accent/50"
                            : "bg-card border-border/50 hover:border-accent/30"
                        }`}
                      >
                        <RadioGroupItem value={area.id} className="sr-only" />
                        <span className={coverageArea === area.id ? "text-foreground" : "text-muted-foreground"}>
                          {area.label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Area Size */}
                <div>
                  <Label htmlFor="area" className="text-lg font-medium text-foreground mb-4 block">
                    Approximate area (sq. ft.)
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="e.g., 2000"
                    value={areaSize}
                    onChange={(e) => setAreaSize(e.target.value)}
                    className="bg-secondary/50 border-border/50 text-lg h-14"
                  />
                </div>

                {/* Budget */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-medium text-foreground">
                      Budget Range
                    </Label>
                    <span className="text-2xl font-semibold text-accent">
                      Rs {budget[0].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={20000}
                    max={500000}
                    step={5000}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Rs 20,000</span>
                    <span>Rs 5,00,000</span>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateRecommendation}
                  disabled={!propertyType || !areaSize}
                  className="group h-16 w-full rounded-2xl bg-accent text-lg font-medium text-accent-foreground hover:bg-accent/90"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Recommendation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {/* Analyzing State */}
            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-accent" />
                </div>
                <h2 className="text-headline text-2xl text-foreground mb-3">
                  Analyzing your property...
                </h2>
                <p className="text-muted-foreground">
                  Our AI is calculating the optimal security configuration
                </p>
              </motion.div>
            )}

            {/* Step 2: Results */}
            {step === 2 && recommendation && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Coverage Score */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-12"
                >
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-secondary"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="text-accent"
                        strokeDasharray={`${recommendation.coverageScore * 4.4} 440`}
                        initial={{ strokeDasharray: "0 440" }}
                        animate={{ strokeDasharray: `${recommendation.coverageScore * 4.4} 440` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        {recommendation.coverageScore}%
                      </span>
                      <span className="text-sm text-muted-foreground">Coverage Score</span>
                    </div>
                  </div>
                  <h2 className="text-headline text-3xl text-foreground mb-2">
                    Your AI Recommendation
                  </h2>
                  <p className="text-muted-foreground">
                    Based on your property profile and budget
                  </p>
                </motion.div>

                {/* Camera Recommendations */}
                <StaggerContainer className="grid md:grid-cols-3 gap-4 mb-8">
                  {recommendation.cameras.map((camera, i) => (
                    <StaggerItem key={i}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="premium-card p-6"
                      >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                          <Camera className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="text-headline text-lg text-foreground mb-1">
                          {camera.type}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Recommended: {camera.count} units
                        </p>
                        <span className="text-accent font-medium">
                          Rs {(camera.price * camera.count).toLocaleString()}
                        </span>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-2xl bg-card border border-border/50 mb-8"
                >
                  <h3 className="text-headline text-lg text-foreground mb-4">
                    Included Features
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {recommendation.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Total & CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 rounded-2xl bg-accent/10 border border-accent/20"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-sm text-muted-foreground">Estimated Total</span>
                      <div className="text-3xl font-bold text-foreground">
                        Rs {recommendation.totalPrice.toLocaleString()}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Including installation & 1-year warranty
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-border/50"
                      >
                        Modify
                      </Button>
                      <Button className="bg-accent px-8 text-accent-foreground hover:bg-accent/90">
                        Book Installation
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function AIPlannerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Spinner className="h-8 w-8 text-accent" /></div>}>
      <AIPlannerContent />
    </Suspense>
  )
}
