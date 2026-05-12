"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
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
  Smartphone,
  Loader2,
  Upload,
  ImageIcon,
  X,
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
import { Spinner } from "@/components/ui/spinner"

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

const districts = [
  { name: "Anantnag", division: "kashmir", charge: 100 },
  { name: "Kulgam", division: "kashmir", charge: 100 },
  { name: "Pulwama", division: "kashmir", charge: 300 },
  { name: "Shopian", division: "kashmir", charge: 300 },
  { name: "Budgam", division: "kashmir", charge: 300 },
  { name: "Srinagar", division: "kashmir", charge: 300 },
  { name: "Ganderbal", division: "kashmir", charge: 300 },
  { name: "Bandipora", division: "kashmir", charge: 300 },
  { name: "Baramulla", division: "kashmir", charge: 300 },
  { name: "Kupwara", division: "kashmir", charge: 300 },
  { name: "Jammu", division: "jammu", charge: 500 },
  { name: "Samba", division: "jammu", charge: 500 },
  { name: "Kathua", division: "jammu", charge: 500 },
  { name: "Udhampur", division: "jammu", charge: 500 },
  { name: "Reasi", division: "jammu", charge: 500 },
  { name: "Rajouri", division: "jammu", charge: 500 },
  { name: "Poonch", division: "jammu", charge: 500 },
  { name: "Doda", division: "jammu", charge: 500 },
  { name: "Kishtwar", division: "jammu", charge: 500 },
  { name: "Ramban", division: "jammu", charge: 500 },
]

const urgencyLevels = [
  { id: "standard", label: "Standard", multiplier: 1, description: "3-5 business days" },
  { id: "express", label: "Express", multiplier: 1.5, description: "Within 48 hours" },
  { id: "emergency", label: "Emergency", multiplier: 2, description: "Same day service" },
]

function BookingContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedUrgency, setSelectedUrgency] = useState("standard")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "verifying" | "success">("pending")
  const [timeLeft, setTimeLeft] = useState(600)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string>("")
  const [formData, setFormData] = useState({
    address: "",
    pincode: "",
    district: "",
    date: "",
    timeSlot: "",
    notes: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect_to=/booking')
      }
    }
    checkAuth()
  }, [router])

  const saveBooking = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const basePrice = selectedServiceData?.basePrice || 0
    const urgencyMultiplier = selectedUrgencyData?.multiplier || 1
    const districtData = districts.find(d => d.name === formData.district)
    const districtCharge = districtData?.charge || 0
    const urgencyCharge = Math.round(basePrice * (urgencyMultiplier - 1))
    const gst = Math.round((basePrice * urgencyMultiplier + districtCharge) * 0.18)
    const total = Math.round(basePrice * urgencyMultiplier + districtCharge + gst)

    const { error: insertError } = await supabase.from('bookings').insert({
      user_id: user.id,
      user_email: user.email,
      service_type: selectedServiceData?.title,
      urgency: selectedUrgency,
      address: formData.address,
      pincode: formData.pincode,
      district: formData.district,
      notes: formData.notes,
      scheduled_date: formData.date,
      time_slot: formData.timeSlot,
      status: 'pending',
      base_amount: basePrice,
      urgency_charge: urgencyCharge,
      distance_charge: districtCharge,
      gst,
      total_amount: total,
      payment_proof_url: proofPreview || null,
    })

    if (insertError) {
      console.error('Booking save error:', insertError.message)
      if (insertError.message?.includes('row-level security')) {
        throw new Error('Database RLS policy is blocking the insert. Run the SQL schema in Supabase to create the necessary policies.')
      }
      if (insertError.message?.includes('column') && insertError.message?.includes('not exist')) {
        throw new Error('Missing column in database. Run the SQL schema in Supabase to update the bookings table.')
      }
      if (insertError.message?.includes('does not exist')) {
        throw new Error('Database table not found. Run the SQL schema in Supabase to create the required tables.')
      }
      throw new Error(insertError.message)
    }

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          status: 'pending',
          bookingId: '',
          serviceType: selectedServiceData?.title,
          scheduledDate: formData.date,
          timeSlot: formData.timeSlot,
          customerName: user.user_metadata?.full_name || 'Customer',
          totalAmount: total,
          address: formData.address,
          district: formData.district,
        }),
      })
    } catch {
      // Email notification is optional
    }

    setSaving(false)
  }

  const selectedServiceData = serviceTypes.find(s => s.id === selectedService)
  const selectedUrgencyData = urgencyLevels.find(u => u.id === selectedUrgency)

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.")
      return
    }
    setProofFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setProofPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Countdown timer for payment
  useEffect(() => {
    if (step === 5 && paymentStatus === "pending" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, paymentStatus, timeLeft])

  // Pricing calculation
  const basePrice = selectedServiceData?.basePrice || 0
  const urgencyMultiplier = selectedUrgencyData?.multiplier || 1
  const districtData = districts.find(d => d.name === formData.district)
  const districtCharge = districtData?.charge || 0
  const gst = Math.round((basePrice * urgencyMultiplier + districtCharge) * 0.18)
  const total = Math.round(basePrice * urgencyMultiplier + districtCharge + gst)

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
    setSaveError("")
    setTimeout(async () => {
      try {
        await saveBooking()
        setPaymentStatus("success")
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to save booking'
        setSaveError(message)
        setPaymentStatus("pending")
        setSaving(false)
      }
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
                          <Label htmlFor="pincode" className="text-base font-semibold">PIN Code</Label>
                          <Input
                            id="pincode"
                            placeholder="Enter PIN code"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            className="h-14 rounded-xl bg-secondary/50 border-border/50 text-base mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="district" className="text-base font-semibold">District</Label>
                          <select
                            id="district"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            required
                            className="w-full h-14 rounded-xl border border-border bg-secondary/50 px-4 text-base text-foreground appearance-none cursor-pointer mt-2 focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                          >
                            <option value="">Select your district</option>
                            <optgroup label="─ Kashmir Division ─">
                              {districts.filter(d => d.division === 'kashmir').map(d => (
                                <option key={d.name} value={d.name}>{d.name}</option>
                              ))}
                            </optgroup>
                            <optgroup label="─ Jammu Division ─">
                              {districts.filter(d => d.division === 'jammu').map(d => (
                                <option key={d.name} value={d.name}>{d.name}</option>
                              ))}
                            </optgroup>
                          </select>
                          {formData.district && (
                            <p className="text-sm text-accent font-medium mt-2">
                              District charge: ₹{districts.find(d => d.name === formData.district)?.charge || 0}
                            </p>
                          )}
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
                          {formData.district && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">District</span>
                              <span className="text-foreground">{formData.district}</span>
                            </div>
                          )}
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
                            onClick={() => router.push("/dashboard")}
                          >
                            {saving ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            ) : (
                              "View in Dashboard"
                            )}
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
                                {formData.district && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">District</span>
                                    <span className="text-foreground">{formData.district}</span>
                                  </div>
                                )}
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
                                    <span className="text-muted-foreground">District Charge ({formData.district})</span>
                                    <span className="text-foreground">Rs {districtCharge}</span>
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
                            {/* Payment Proof Upload */}
                            <div className="p-5 rounded-xl bg-card border border-border/50">
                              <h3 className="text-sm font-semibold text-foreground mb-3">Upload Payment Proof</h3>
                              <p className="text-xs text-muted-foreground mb-4">
                                Take a screenshot or photo of your UPI payment confirmation and upload it here.
                              </p>
                              {proofPreview ? (
                                <div className="relative">
                                  <img src={proofPreview} alt="Payment proof" className="w-full rounded-xl max-h-48 object-contain bg-secondary/50" />
                                  <button
                                    type="button"
                                    onClick={() => { setProofFile(null); setProofPreview("") }}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-border/50 cursor-pointer hover:border-accent/50 transition-colors">
                                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                  <span className="text-sm text-muted-foreground">Click to upload screenshot</span>
                                  <span className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, JPEG (max 5MB)</span>
                                  <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleProofUpload} className="hidden" />
                                </label>
                              )}
                            </div>

                            {saveError && (
                              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                Failed to save booking: {saveError}. Please contact support.
                              </div>
                            )}

                            <Button 
                              onClick={handleVerifyPayment}
                              disabled={paymentStatus === "verifying" || !proofPreview}
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
                                  {proofPreview ? "Submit Payment Proof" : "Upload Proof First"}
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
                    <span className="text-muted-foreground">District Charge{formData.district ? ` (${formData.district})` : ''}</span>
                    <span className="text-foreground">Rs {districtCharge}</span>
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

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Spinner className="h-8 w-8 text-accent" /></div>}>
      <BookingContent />
    </Suspense>
  )
}
