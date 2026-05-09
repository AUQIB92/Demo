"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Eye,
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  Settings,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Clock,
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StaggerContainer, StaggerItem } from "@/components/motion"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Users, label: "Technicians", href: "/admin/technicians" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const stats = [
  { 
    label: "Total Revenue", 
    value: "Rs 12,45,890", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign 
  },
  { 
    label: "Active Bookings", 
    value: "142", 
    change: "+8.2%", 
    trend: "up",
    icon: Calendar 
  },
  { 
    label: "Products Sold", 
    value: "892", 
    change: "+23.1%", 
    trend: "up",
    icon: ShoppingCart 
  },
  { 
    label: "Avg. Rating", 
    value: "4.87", 
    change: "-0.1", 
    trend: "down",
    icon: TrendingUp 
  },
]

const recentBookings = [
  { 
    id: "BK-2024-001", 
    customer: "Priya Sharma", 
    service: "Installation", 
    status: "In Progress",
    amount: 15999,
    time: "2 hours ago" 
  },
  { 
    id: "BK-2024-002", 
    customer: "Rajesh Kumar", 
    service: "Maintenance", 
    status: "Scheduled",
    amount: 2999,
    time: "4 hours ago" 
  },
  { 
    id: "BK-2024-003", 
    customer: "Anjali Patel", 
    service: "Repair", 
    status: "Completed",
    amount: 4999,
    time: "6 hours ago" 
  },
  { 
    id: "BK-2024-004", 
    customer: "Vikram Singh", 
    service: "Installation", 
    status: "Pending",
    amount: 34999,
    time: "8 hours ago" 
  },
]

const lowStockItems = [
  { name: "Dome Pro 4K", stock: 5, threshold: 10 },
  { name: "NVR Hub 16", stock: 3, threshold: 8 },
  { name: "Smart Lock X1", stock: 7, threshold: 12 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-green-500/10 text-green-400 border-green-500/20"
    case "In Progress": return "bg-accent/10 text-accent border-accent/20"
    case "Scheduled": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "Pending": return "bg-muted text-muted-foreground border-border/50"
    default: return "bg-muted text-muted-foreground border-border/50"
  }
}

export default function AdminDashboard() {
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
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">Admin User</div>
              <div className="text-xs text-muted-foreground">admin@securevision.com</div>
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
            <h1 className="text-display text-2xl sm:text-3xl text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border/50 hidden sm:flex">
              <Clock className="w-4 h-4 mr-2" />
              Last 30 days
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      stat.trend === "up" 
                        ? "border-green-500/30 text-green-400" 
                        : "border-red-500/30 text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-semibold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-headline text-lg text-foreground">Recent Bookings</h2>
              <Link href="/admin/bookings">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
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
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                      {booking.customer.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{booking.customer}</div>
                      <div className="text-sm text-muted-foreground">{booking.service} / {booking.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    <span className="text-foreground font-medium hidden sm:block">
                      Rs {booking.amount.toLocaleString()}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alerts & Quick Actions */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-card border border-border/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-headline text-lg text-foreground">Low Stock Alert</h2>
              </div>

              <div className="space-y-3">
                {lowStockItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">{item.name}</span>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                      {item.stock} left
                    </Badge>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 border-border/50">
                Manage Inventory
              </Button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-card border border-border/50 p-6"
            >
              <h2 className="text-headline text-lg text-foreground mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-border/50 hover:border-accent/30">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start border-border/50 hover:border-accent/30">
                  <Users className="w-4 h-4 mr-2" />
                  Add Technician
                </Button>
                <Button variant="outline" className="w-full justify-start border-border/50 hover:border-accent/30">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Update Pricing
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
