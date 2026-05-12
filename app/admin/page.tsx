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
  Users,
  Settings,
  LogOut,
  Menu,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { createClient } from "@/lib/supabase/client"

interface Booking {
  id: string
  user_id: string
  service_type: string
  urgency: string
  address: string
  scheduled_date: string
  time_slot: string
  status: string
  total_amount: number
  created_at: string
  profiles: {
    full_name: string
    email: string
    phone: string
  }
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  features: string[]
  stock: number
  image_url: string
  created_at: string
}

interface DashboardStats {
  totalBookings: number
  pendingApprovals: number
  totalRevenue: number
  totalProducts: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({ totalBookings: 0, pendingApprovals: 0, totalRevenue: 0, totalProducts: 0 })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      let isAdmin = false
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        isAdmin = profile?.role === 'admin'
      } catch {
        // profiles table may not exist
      }

      if (!isAdmin) {
        router.push('/dashboard')
        return
      }

      let bookings: Booking[] = []
      try {
        const { data: bookingsRaw } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (bookingsRaw) {
          bookings = await Promise.all(bookingsRaw.map(async (b: any) => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, email, phone')
                .eq('id', b.user_id)
                .single()
              return { ...b, profiles: profile || { full_name: 'Unknown', email: '', phone: '' } }
            } catch {
              return { ...b, profiles: { full_name: 'Unknown', email: '', phone: '' } }
            }
          }))
        }
      } catch {
        // bookings table may not exist
      }

      let productsData: any[] = []
      try {
        const { data } = await supabase.from('products').select('id')
        productsData = data || []
      } catch {
        // products table may not exist
      }

      const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0
      const totalRevenue = bookings?.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.total_amount, 0) || 0

      setStats({
        totalBookings: bookings?.length || 0,
        pendingApprovals: pendingCount,
        totalRevenue,
        totalProducts: productsData?.length || 0,
      })
      setRecentBookings(bookings || [])
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

  const updateBookingStatus = async (id: string, status: string) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setRecentBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      if (stats.pendingApprovals > 0 && status !== 'pending') {
        setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }))
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />
      default: return <AlertCircle className="w-4 h-4 text-blue-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/30'
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      default: return 'bg-secondary/50 text-muted-foreground border-border'
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
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border/50 bg-sidebar p-6 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-secondary"
        >
          <Eye className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Admin</span>
            <span className="block text-[10px] text-accent font-bold uppercase tracking-wider">HR Security</span>
          </div>
        </Link>

        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-accent/10 text-accent">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Calendar className="w-5 h-5" />
            Bookings
            {stats.pendingApprovals > 0 && (
              <Badge className="ml-auto bg-yellow-500 text-yellow-foreground">{stats.pendingApprovals}</Badge>
            )}
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Users className="w-5 h-5" />
            Customers
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg border border-border/50 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-display text-2xl sm:text-3xl text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your security business</p>
            </div>
          </div>
          <Link href="/admin/products">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalBookings}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">{stats.pendingApprovals}</Badge>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.pendingApprovals}</div>
              <div className="text-sm text-muted-foreground">Pending Approvals</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl bg-card border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalProducts}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-headline text-lg text-foreground">Recent Bookings</h2>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">Customer</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">Service</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">Date</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">Amount</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">Status</th>
                  <th className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-foreground">{booking.profiles?.full_name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">{booking.profiles?.phone || ''}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium text-foreground">{booking.service_type}</div>
                      <div className="text-xs text-muted-foreground capitalize">{booking.urgency}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm text-foreground">{booking.scheduled_date}</div>
                      <div className="text-xs text-muted-foreground">{booking.time_slot}</div>
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-foreground">₹{booking.total_amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4">
                      <Badge className={`${getStatusColor(booking.status)} border`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      {booking.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="h-8 text-xs border-green-500/30 text-green-400 hover:bg-green-500/10"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}