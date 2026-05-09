"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Eye,
  LayoutDashboard,
  Calendar,
  Package,
  FileText,
  MapPin,
  Bell,
  Settings,
  Clock,
  ChevronRight,
  Shield,
  Camera,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StaggerContainer, StaggerItem } from "@/components/motion"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: true },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
  { icon: MapPin, label: "Addresses", href: "/dashboard/addresses" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

const activeBookings = [
  {
    id: "BK-2024-089",
    service: "Installation",
    date: "Dec 15, 2024",
    time: "10:00 AM - 12:00 PM",
    status: "Technician En Route",
    technician: "Rahul Mehta",
    progress: 60,
  },
]

const recentBookings = [
  { 
    id: "BK-2024-078", 
    service: "Maintenance", 
    date: "Dec 10, 2024",
    status: "Completed",
    amount: 2999 
  },
  { 
    id: "BK-2024-065", 
    service: "Installation", 
    date: "Nov 28, 2024",
    status: "Completed",
    amount: 24999 
  },
  { 
    id: "BK-2024-052", 
    service: "Repair", 
    date: "Nov 15, 2024",
    status: "Completed",
    amount: 4999 
  },
]

const installedProducts = [
  { 
    name: "Dome Pro 4K", 
    location: "Main Entrance",
    warranty: "Dec 2026",
    status: "Online"
  },
  { 
    name: "Dome Pro 4K", 
    location: "Backyard",
    warranty: "Dec 2026",
    status: "Online"
  },
  { 
    name: "NVR Hub 8", 
    location: "Control Room",
    warranty: "Dec 2026",
    status: "Online"
  },
]

const amcPlan = {
  name: "Premium AMC",
  validTill: "Dec 2025",
  servicesUsed: 2,
  servicesTotal: 4,
  nextService: "Mar 2025",
}

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-sidebar p-6 hidden lg:block">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
            <Eye className="w-5 h-5 text-accent" />
          </div>
          <span className="font-semibold text-foreground">SecureVision</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active 
                  ? "bg-accent/10 text-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
              P
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">Priya Sharma</div>
              <div className="text-xs text-muted-foreground">priya@email.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-display text-2xl sm:text-3xl text-foreground">Welcome back, Priya</h1>
            <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your security</p>
          </div>
          <Link href="/booking">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Book Service
            </Button>
          </Link>
        </motion.div>

        {/* Active Booking */}
        {activeBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 rounded-2xl bg-accent/10 border border-accent/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-accent font-medium">Active Booking</span>
            </div>
            
            {activeBookings.map((booking) => (
              <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-headline text-xl text-foreground mb-1">
                    {booking.service} Service
                  </h3>
                  <p className="text-muted-foreground">
                    {booking.date} / {booking.time}
                  </p>
                  <p className="text-sm text-accent mt-2">
                    {booking.status} - {booking.technician}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{booking.progress}%</span>
                  </div>
                  <Progress value={booking.progress} className="h-2" />
                  <Button variant="outline" size="sm" className="mt-2 border-accent/30 text-accent">
                    Track Live
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StaggerItem>
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Camera className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-semibold text-foreground">3</div>
              <div className="text-sm text-muted-foreground">Cameras Installed</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-semibold text-foreground">Active</div>
              <div className="text-sm text-muted-foreground">Security Status</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-semibold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="text-2xl font-semibold text-foreground">5</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-headline text-lg text-foreground">Booking History</h2>
              <Link href="/dashboard/bookings">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                >
                  <div>
                    <div className="font-medium text-foreground">{booking.service}</div>
                    <div className="text-sm text-muted-foreground">{booking.date} / {booking.id}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      {booking.status}
                    </Badge>
                    <span className="text-foreground font-medium hidden sm:block">
                      Rs {booking.amount.toLocaleString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AMC Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-card border border-border/50 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-headline text-lg text-foreground">AMC Plan</h2>
                <Badge className="bg-accent/10 text-accent border-accent/20">Active</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-foreground font-medium">{amcPlan.name}</div>
                  <div className="text-sm text-muted-foreground">Valid till {amcPlan.validTill}</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Services Used</span>
                    <span className="text-foreground">{amcPlan.servicesUsed}/{amcPlan.servicesTotal}</span>
                  </div>
                  <Progress value={(amcPlan.servicesUsed / amcPlan.servicesTotal) * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">Next Scheduled Service</div>
                  <div className="text-foreground font-medium">{amcPlan.nextService}</div>
                </div>
              </div>
            </motion.div>

            {/* Installed Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-card border border-border/50 p-6"
            >
              <h2 className="text-headline text-lg text-foreground mb-4">Your Equipment</h2>
              
              <div className="space-y-3">
                {installedProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm text-foreground">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.location}</div>
                    </div>
                    <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                      {product.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 border-border/50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Check System Status
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
