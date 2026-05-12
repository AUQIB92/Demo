"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard", active: true },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
  { icon: MapPin, label: "Addresses", href: "/dashboard/addresses" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

interface Booking {
  id: string
  service_type: string
  scheduled_date: string
  time_slot: string
  status: string
  total_amount: number
  created_at: string
}

interface Profile {
  full_name: string
  email: string
  phone: string
}

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/auth/login')
        return
      }

      let profile: Profile | null = null
      let isAdmin = false

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email, phone, role')
          .eq('id', authUser.id)
          .single()
        profile = profileData
        isAdmin = profileData?.role === 'admin'
      } catch {
        // profiles table may not exist yet - fall back to user_metadata
        profile = {
          full_name: (authUser.user_metadata?.full_name as string) || 'User',
          email: authUser.email || '',
          phone: (authUser.user_metadata?.phone as string) || '',
        }
      }

      if (isAdmin) {
        router.push('/admin')
        return
      }

      const { data: userBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      setUser(profile)
      setBookings(userBookings || [])
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status))
  const completedBookings = bookings.filter(b => b.status === 'completed')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/30 text-green-400'
      case 'confirmed': return 'border-blue-500/30 text-blue-400'
      case 'pending': return 'border-yellow-500/30 text-yellow-400'
      case 'cancelled': return 'border-red-500/30 text-red-400'
      default: return 'border-border text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border/50 bg-sidebar p-6 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-secondary"
        >
          <Eye className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
            <Eye className="w-5 h-5 text-accent" />
          </div>
          <span className="font-semibold text-foreground">SecureVision</span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
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

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{user?.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg border border-border/50 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-display text-2xl sm:text-3xl text-foreground">Welcome back, {user?.full_name?.split(' ')[0]}</h1>
              <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your security</p>
            </div>
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
                    {booking.service_type} Service
                  </h3>
                  <p className="text-muted-foreground">
                    {booking.scheduled_date} / {booking.time_slot}
                  </p>
                  <p className="text-sm text-accent mt-2">
                    Status: {booking.status.replace('_', ' ')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status.replace('_', ' ')}
                  </Badge>
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
              <div className="text-2xl font-semibold text-foreground">{bookings.length}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
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
              <div className="text-2xl font-semibold text-foreground">{completedBookings.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
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
              <div className="text-2xl font-semibold text-foreground">{activeBookings.length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
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
              <div className="text-2xl font-semibold text-foreground">₹{bookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Booking History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-headline text-lg text-foreground">Recent Bookings</h2>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings yet</p>
              <Link href="/booking">
                <Button className="mt-4 bg-accent text-accent-foreground">Book Your First Service</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                >
                  <div>
                    <div className="font-medium text-foreground">{booking.service_type}</div>
                    <div className="text-sm text-muted-foreground">{booking.scheduled_date} / {booking.id.slice(-8)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-foreground font-medium hidden sm:block">
                      ₹{booking.total_amount.toLocaleString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}