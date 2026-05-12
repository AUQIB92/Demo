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
  Search,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string
  created_at: string
  booking_count: number
  total_spent: number
}

export default function AdminCustomers() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return }

      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      
      const customersWithStats = await Promise.all((profiles || []).map(async (p) => {
        const { data: bookings } = await supabase.from('bookings').select('total_amount').eq('user_id', p.id)
        return {
          ...p,
          booking_count: bookings?.length || 0,
          total_spent: bookings?.reduce((sum, b) => sum + b.total_amount, 0) || 0,
        }
      }))

      setCustomers(customersWithStats.filter(c => c.role !== 'admin'))
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

  const filtered = customers.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div className="min-h-screen bg-background flex">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className="fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border/50 bg-sidebar p-6 transform transition-transform duration-300">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center"><Eye className="w-5 h-5 text-white" /></div>
          <div><span className="font-semibold text-foreground">Admin</span><span className="block text-[10px] text-accent font-bold uppercase tracking-wider">HR Security</span></div>
        </Link>
        <nav className="space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50"><LayoutDashboard className="w-5 h-5" /> Overview</Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50"><Calendar className="w-5 h-5" /> Bookings</Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50"><Package className="w-5 h-5" /> Products</Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-accent/10 text-accent"><Users className="w-5 h-5" /> Customers</Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><LogOut className="w-5 h-5" /> Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg border border-border/50 lg:hidden"><Menu className="w-5 h-5" /></button>
            <div><h1 className="text-2xl sm:text-3xl font-bold text-foreground">Customers</h1><p className="text-muted-foreground mt-1">{filtered.length} registered customers</p></div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="h-12 pl-11 rounded-xl bg-secondary/50 border-border/50" />
        </div>

        <div className="space-y-3">
          {filtered.map((customer) => (
            <motion.div key={customer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">{customer.full_name?.charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-foreground">{customer.full_name || 'Unknown'}</div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">{customer.booking_count} bookings</div>
                    <div className="text-xs text-muted-foreground">₹{customer.total_spent.toLocaleString()} spent</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20"><Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">No customers found</p></div>
          )}
        </div>
      </main>
    </div>
  )
}