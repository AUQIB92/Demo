"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Settings, 
  ClipboardCheck, 
  Camera,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Check,
  Zap,
  CheckCircle2,
  Copy,
  Smartphone
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const serviceTypes = [
  {
    id: "installation",
    icon: Camera,
    title: "Installation",
    description: "New CCTV setup and configuration",
    basePrice: 1999,
  },
  {
    id: "repair",
    icon: Wrench,
    title: "Repair",
    description: "Fix existing camera issues",
    basePrice: 999,
  },
  {
    id: "maintenance",
    icon: Settings,
    title: "Maintenance",
    description: "Regular checkup and cleaning",
    basePrice: 799,
  },
  {
    id: "inspection",
    icon: ClipboardCheck,
    title: "Site Inspection",
    description: "Professional security assessment",
    basePrice: 499,
  },
]

const timeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
]

const urgencyLevels = [
  { id: "standard", label: "Standard", multiplier: 1, description: "3-5 business days" },
  { id: "express", label: "Express", multiplier: 1.5, description: "Within 48 hours" },
  { id: "emergency", label: "Emergency", multiplier: 2, description: "Same day service" },
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedUrgency, setSelectedUrgency] = useState("standard")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "verifying" | "success">("pending")
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    pincode: "",
    date: "",
    timeSlot: "",
    notes: "",
  })

  const selectedServiceData = serviceTypes.find(s => s.id === selectedService)
  const selectedUrgencyData = urgencyLevels.find(u => u.id === selectedUrgency)

  // Countdown timer for payment
  useEffect(() => {
    if (step === 5 && paymentStatus === "pending" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, paymentStatus, timeLeft])

  // Mock pricing calculation
  const basePrice = selectedServiceData?.basePrice || 0
  const urgencyMultiplier = selectedUrgencyData?.multiplier || 1
  const distanceCharge = formData.pincode ? 150 : 0 // Mock distance charge
  const gst = Math.round((basePrice * urgencyMultiplier + distanceCharge) * 0.18)
  const total = Math.round(basePrice * urgencyMultiplier + distanceCharge + gst)

  // UPI payment string for QR code
  const upiPaymentString = `upi://pay?pa=securevision@upi&pn=SecureVision&am=${total}&cu=INR&tn=Booking-${Date.now()}`
  
  // Generate booking ID
  const bookingId = `SV${Date.now().toString().slice(-8)}`

  // Format time left
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle copy UPI ID
  const handleCopyUPI = () => {
    navigator.clipboard.writeText("securevision@upi")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simulate payment verification
  const handleVerifyPayment = () => {
    setPaymentStatus("verifying")
    setTimeout(() => {
      setPaymentStatus("success")
    }, 2000)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== null
      case 2: return formData.address && formData.pincode
      case 3: return formData.date && formData.timeSlot
      default: return true
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="section-kicker">Book Service</span>
            <h1 className="mt-4 text-display text-4xl sm:text-5xl text-foreground">
              Schedule your <span className="teal-gradient-text">service</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Professional technicians at your doorstep. Transparent pricing with no hidden charges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-10"
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step >= s 
                          ? "bg-accent text-accent-foreground" 
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {step > s ? <Check className="w-4 h-4" /> : s}
                    </div>
                    {s < 5 && (
                      <div className={`w-12 sm:w-20 h-px mx-2 ${step > s ? "bg-accent" : "bg-border"}`} />
                    )}
                  </div>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                {/* Step 1: Service Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-headline text-2xl text-foreground mb-6">
                      Select Service Type
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {serviceTypes.map((service) => (
                        <motion.button
                          key={service.id}
                          whileHover={{ y: -2 }}
                          onClick={() => setSelectedService(service.id)}
                          className={`relative p-6 rounded-2xl border text-left transition-colors ${
                            selectedService === service.id
                              ? "bg-accent/10 border-accent/50"
                              : "bg-card border-border/50 hover:border-accent/30"
                          }`}
                        >
                          {selectedService === service.id && (
                            <div className="absolute top-4 right-4">
                              <Check className="w-5 h-5 text-accent" />
                            </div>
                          )}
                          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                            <service.icon className="w-6 h-6 text-accent" />
                          </div>
                          <h3 className="text-headline text-lg text-foreground mb-1">
                            {service.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {service.description}
                          </p>
                          <span className="text-accent font-medium">
                            From Rs {service.basePrice}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Urgency Selection */}
                    <h2 className="text-headline text-2xl text-foreground mb-6">
                      Select Urgency
                    </h2>
                    <RadioGroup 
                      value={selectedUrgency} 
                      onValueChange={setSelectedUrgency}
                      className="grid sm:grid-cols-3 gap-4"
                    >
                      {urgencyLevels.map((level) => (
                        <label
                          key={level.id}
                          className={`relative p-4 rounded-xl border cursor-pointer transition-colors ${
                            selectedUrgency === level.id
                              ? "bg-accent/10 border-accent/50"
                              : "bg-card border-border/50 hover:border-accent/30"
                          }`}
                        >
                          <RadioGroupItem value={level.id} className="sr-only" />
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">{level.label}</span>
                            {level.id === "emergency" && (
                              <Zap className="w-4 h-4 text-accent" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {level.description}
                          </span>
                          {level.multiplier > 1 && (
                            <Badge variant="outline" className="mt-2 text-xs border-accent/30 text-accent">
                              +{(level.multiplier - 1) * 100}% surcharge
                            </Badge>
                          )}
                        </label>
                      ))}
                    </RadioGroup>
                  </motion.div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-headline text-2xl text-foreground mb-6">
                      Service Location
                    </h2>
                    
                    {/* Map Placeholder */}
                    <div className="aspect-video bg-secondary/50 rounded-2xl mb-6 flex items-center justify-center border border-border/50">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-accent/50 mx-auto mb-3" />
                        <p className="text-muted-foreground">Map integration placeholder</p>
                        <Button variant="outline" size="sm" className="mt-3 border-accent/30 text-accent">
                          Use Current Location
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Full Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your complete address..."
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="mt-2 bg-secondary/50 border-border/50 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pincode">PIN Code</Label>
                          <Input
                            id="pincode"
                            placeholder="Enter PIN code"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            className="mt-2 bg-secondary/50 border-border/50"
                          />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input
                            value="Auto-detected from PIN"
                            disabled
                            className="mt-2 bg-secondary/30 border-border/30"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Schedule */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-headline text-2xl text-foreground mb-6">
                      Choose Date & Time
                    </h2>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-accent" />
                          Select Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="mt-2 bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div>
                        <Label className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          Time Slot
                        </Label>
                        <Select 
                          value={formData.timeSlot} 
                          onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                        >
                          <SelectTrigger className="mt-2 bg-secondary/50 border-border/50">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions for the technician..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="mt-2 bg-secondary/50 border-border/50 resize-none"
                        rows={3}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-headline text-2xl text-foreground mb-6">
                      Review & Confirm
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-card border border-border/50">
                        <h3 className="font-medium text-foreground mb-4">Booking Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Service</span>
                            <span className="text-foreground">{selectedServiceData?.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Urgency</span>
                            <span className="text-foreground">{selectedUrgencyData?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date & Time</span>
                            <span className="text-foreground">{formData.date} / {formData.timeSlot}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location</span>
                            <span className="text-foreground text-right max-w-[200px] truncate">{formData.address}</span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => setStep(5)}
                        className="h-14 w-full rounded-2xl bg-accent text-base text-accent-foreground hover:bg-accent/90"
                      >
                        Proceed to Payment
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              {step < 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-between mt-10 pt-6 border-t border-border/50"
                >
                  <Button
                    variant="ghost"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                    className="text-muted-foreground"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
</motion.div>
                )}

                {/* Step 5: QR Payment */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {paymentStatus === "success" ? (
                      /* Payment Success */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                        >
                          <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </motion.div>
                        <h2 className="text-headline text-3xl text-foreground mb-3">
                          Payment Successful
                        </h2>
                        <p className="text-muted-foreground mb-8">
                          Your booking has been confirmed
                        </p>
                        
                        <div className="max-w-sm mx-auto p-6 rounded-2xl bg-card border border-border/50 text-left">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Booking ID</span>
                            <span className="font-mono text-foreground">{bookingId}</span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Service</span>
                            <span className="text-foreground">{selectedServiceData?.title}</span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Scheduled</span>
                            <span className="text-foreground">{formData.date}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Amount Paid</span>
                            <span className="text-accent font-semibold">Rs {total}</span>
                          </div>
                        </div>

                        <div className="mt-8 space-y-3">
                          <Button 
                            className="w-full max-w-sm bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => window.location.href = "/dashboard"}
                          >
                            View in Dashboard
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full max-w-sm border-border/50"
                            onClick={() => window.location.href = "/"}
                          >
                            Back to Home
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      /* Payment QR Code */
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-headline text-2xl text-foreground">
                            Complete Payment
                          </h2>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
                            <div className={`w-2 h-2 rounded-full ${paymentStatus === "verifying" ? "bg-yellow-500 animate-pulse" : "bg-accent animate-pulse"}`} />
                            <span className="text-sm font-mono text-accent">
                              {paymentStatus === "verifying" ? "Verifying..." : formatTime(timeLeft)}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          {/* QR Code Section */}
                          <div className="p-8 rounded-2xl bg-card border border-border/50 text-center">
                            <p className="text-sm text-muted-foreground mb-6">
                              Scan QR code with any UPI app
                            </p>
                            
                            {/* QR Code */}
                            <div className="relative inline-block">
                              <div className="p-4 bg-white rounded-2xl">
                                <QRCodeSVG 
                                  value={upiPaymentString}
                                  size={200}
                                  level="H"
                                  includeMargin={false}
                                  bgColor="#ffffff"
                                  fgColor="#0a0a0a"
                                />
                              </div>
                              {paymentStatus === "verifying" && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center"
                                >
                                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </motion.div>
                              )}
                            </div>

                            {/* Amount */}
                            <div className="mt-6">
                              <span className="text-sm text-muted-foreground">Amount to pay</span>
                              <p className="mt-1 text-3xl font-semibold text-foreground">Rs {total}</p>
                            </div>

                            {/* UPI ID */}
                            <div className="mt-6 p-3 rounded-xl bg-secondary/50 flex items-center justify-between">
                              <div className="text-left">
                                <span className="text-xs text-muted-foreground block">UPI ID</span>
                                <span className="text-sm font-mono text-foreground">securevision@upi</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyUPI}
                                className="text-accent"
                              >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>

                            {/* Supported Apps */}
                            <div className="mt-6 flex items-center justify-center gap-3">
                              <span className="text-xs text-muted-foreground">Supported:</span>
                              <div className="flex items-center gap-2">
                                {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                                  <span key={app} className="px-2 py-1 text-xs rounded-md bg-secondary/50 text-muted-foreground">
                                    {app}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="space-y-4">
                            <div className="p-6 rounded-2xl bg-card border border-border/50">
                              <h3 className="font-medium text-foreground mb-4">Order Summary</h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Service</span>
                                  <span className="text-foreground">{selectedServiceData?.title}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Urgency</span>
                                  <span className="text-foreground">{selectedUrgencyData?.label}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Date</span>
                                  <span className="text-foreground">{formData.date}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Time</span>
                                  <span className="text-foreground">{formData.timeSlot}</span>
                                </div>
                                <div className="pt-3 mt-3 border-t border-border/50">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Base Price</span>
                                    <span className="text-foreground">Rs {basePrice}</span>
                                  </div>
                                  {urgencyMultiplier > 1 && (
                                    <div className="flex justify-between mt-2">
                                      <span className="text-muted-foreground">Urgency Charge</span>
                                      <span className="text-foreground">Rs {Math.round(basePrice * (urgencyMultiplier - 1))}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between mt-2">
                                    <span className="text-muted-foreground">Distance</span>
                                    <span className="text-foreground">Rs {distanceCharge}</span>
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span className="text-muted-foreground">GST (18%)</span>
                                    <span className="text-foreground">Rs {gst}</span>
                                  </div>
                                </div>
                                <div className="pt-3 mt-3 border-t border-border/50 flex justify-between items-baseline">
                                  <span className="font-medium text-foreground">Total</span>
                                  <span className="text-xl font-semibold text-foreground">Rs {total}</span>
                                </div>
                              </div>
                            </div>

                            {/* Verify Payment Button */}
                            <Button 
                              onClick={handleVerifyPayment}
                              disabled={paymentStatus === "verifying"}
                              className="h-14 w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                              {paymentStatus === "verifying" ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Verifying Payment...
                                </>
                              ) : (
                                <>
                                  <Smartphone className="w-4 h-4 mr-2" />
                                  I&apos;ve Made the Payment
                                </>
                              )}
                            </Button>

                            {/* Help Text */}
                            <p className="text-xs text-center text-muted-foreground">
                              Having trouble? Contact support at support@securevision.in
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
            </div>

            {/* Pricing Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="sticky top-24 p-6 rounded-2xl bg-card border border-border/50"
              >
                <h3 className="text-headline text-lg text-foreground mb-6">
                  Price Breakdown
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Service Fee</span>
                    <span className="text-foreground">Rs {basePrice}</span>
                  </div>
                  {urgencyMultiplier > 1 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Urgency Surcharge</span>
                      <span className="text-accent">+Rs {Math.round(basePrice * (urgencyMultiplier - 1))}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance Charge</span>
                    <span className="text-foreground">Rs {distanceCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="text-foreground">Rs {gst}</span>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <div className="flex justify-between items-baseline">
                      <span className="text-foreground font-medium">Total</span>
                      <span className="text-2xl font-semibold text-foreground">Rs {total}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Inclusive of all taxes
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs text-accent">
                    💡 Book during off-peak hours (2-4 PM) for 10% discount on select services.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
