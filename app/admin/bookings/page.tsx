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
  Search,
  Filter,
  ChevronDown,
  ImageIcon,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface Booking {
  id: string
  user_id: string
  user_email: string
  service_type: string
  urgency: string
  address: string
  pincode: string
  district: string
  notes: string
  scheduled_date: string
  time_slot: string
  status: string
  total_amount: number
  payment_proof_url: string | null
  created_at: string
  profiles: {
    full_name: string
    email: string
    phone: string
  }
}

export default function AdminBookings() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

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

      let bookingsData: any[] = []
      try {
        const { data } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (data) {
          bookingsData = await Promise.all(data.map(async (b: any) => {
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

      setBookings(bookingsData || [])
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

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

      // Send email notification on approval/rejection
      if (status === 'confirmed' || status === 'cancelled') {
        const booking = bookings.find(b => b.id === id)
        if (booking) {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: booking.user_email || booking.profiles?.email,
              status,
              bookingId: id,
              serviceType: booking.service_type,
              scheduledDate: booking.scheduled_date,
              timeSlot: booking.time_slot,
              customerName: booking.profiles?.full_name,
              totalAmount: booking.total_amount,
              address: booking.address,
              district: booking.district,
            }),
          })
        }
      }
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: <CheckCircle className="w-4 h-4 text-blue-400" /> }
      case 'completed': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: <CheckCircle className="w-4 h-4 text-green-400" /> }
      case 'cancelled': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: <XCircle className="w-4 h-4 text-red-400" /> }
      case 'in_progress': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: <AlertCircle className="w-4 h-4 text-purple-400" /> }
      default: return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: <Clock className="w-4 h-4 text-yellow-400" /> }
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      booking.profiles?.phone?.includes(search) ||
      booking.service_type?.toLowerCase().includes(search.toLowerCase()) ||
      booking.id.includes(search)
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border/50 bg-sidebar p-6 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-secondary">
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
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-accent/10 text-accent">
            <Calendar className="w-5 h-5" />
            Bookings
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Users className="w-5 h-5" />
            Customers
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg border border-border/50 lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-display text-2xl sm:text-3xl text-foreground">All Bookings</h1>
              <p className="text-muted-foreground mt-1">Manage and approve service bookings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
              {bookings.filter(b => b.status === 'pending').length} Pending
            </Badge>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
              {bookings.filter(b => b.status === 'completed').length} Completed
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-11 rounded-xl bg-secondary/50 border-border/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 pl-11 pr-10 rounded-xl bg-secondary/50 border border-border/50 text-foreground appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="rounded-2xl bg-card border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 py-4">Customer</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 py-4">Service</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 py-4">Schedule</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 py-4">Amount</th>
                  <th className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 py-4">Proof</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 py-4">Status</th>
                  <th className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, i) => {
                  const style = getStatusStyle(booking.status)
                  return (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 hover:bg-secondary/20 cursor-pointer"
                      onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{booking.profiles?.full_name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">{booking.profiles?.email}</div>
                        <div className="text-xs text-muted-foreground">{booking.profiles?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{booking.service_type}</div>
                        <div className="text-xs text-muted-foreground capitalize">{booking.urgency}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">{booking.scheduled_date}</div>
                        <div className="text-xs text-muted-foreground">{booking.time_slot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">₹{booking.total_amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {booking.payment_proof_url ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400" title="Proof uploaded">
                            <ImageIcon className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${style.bg} ${style.text} ${style.border} border`}>
                          {style.icon}
                          <span className="ml-1.5 capitalize">{booking.status.replace('_', ' ')}</span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {booking.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              className="h-9 text-xs bg-green-500 text-white hover:bg-green-600"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              className="h-9 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateStatus(booking.id, 'in_progress')}
                            className="h-9 text-xs bg-purple-500 text-white hover:bg-purple-600"
                          >
                            <AlertCircle className="w-3.5 h-3.5 mr-1" />
                            Start Job
                          </Button>
                        )}
                        {booking.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateStatus(booking.id, 'completed')}
                            className="h-9 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground">No bookings found</h3>
              <p className="text-muted-foreground mt-2">
                {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No bookings have been created yet'}
              </p>
            </div>
          )}
        </div>

        {/* Expanded Booking Details */}
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl bg-card border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Booking Details</h3>
              <Badge className={getStatusStyle(selectedBooking.status).bg + ' ' + getStatusStyle(selectedBooking.status).text}>
                {selectedBooking.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Customer</span>
                <p className="font-medium text-foreground mt-1">{selectedBooking.profiles?.full_name}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.profiles?.email}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.profiles?.phone}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Service</span>
                <p className="font-medium text-foreground mt-1">{selectedBooking.service_type}</p>
                <p className="text-sm text-muted-foreground capitalize">{selectedBooking.urgency} urgency</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Schedule</span>
                <p className="font-medium text-foreground mt-1">{selectedBooking.scheduled_date}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.time_slot}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Location</span>
                <p className="font-medium text-foreground mt-1">{selectedBooking.address}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.district} · PIN: {selectedBooking.pincode}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Amount</span>
                <p className="font-semibold text-lg text-foreground mt-1">₹{selectedBooking.total_amount.toLocaleString()}</p>
              </div>
              {selectedBooking.notes && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Notes</span>
                  <p className="text-sm text-foreground mt-1">{selectedBooking.notes}</p>
                </div>
              )}
              {selectedBooking.payment_proof_url && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Payment Proof</span>
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-border/50 bg-secondary/20 max-w-md">
                    <img
                      src={selectedBooking.payment_proof_url}
                      alt="Payment proof screenshot"
                      className="w-full h-auto max-h-80 object-contain cursor-pointer"
                      onClick={() => window.open(selectedBooking.payment_proof_url!, '_blank')}
                    />
                    <a
                      href={selectedBooking.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}