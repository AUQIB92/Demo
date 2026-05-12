"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Eye,
  LayoutDashboard,
  Calendar,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  category: string
  price: number
  features: string[]
  stock: number
  image_url: string
  badge: string | null
  created_at: string
}

const categories = ["Indoor Camera", "Outdoor Camera", "PTZ Camera", "NVR/DVR", "Accessories"]

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    features: "",
    stock: "",
    badge: "",
    image_url: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      setProducts(productsData || [])
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

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        features: product.features.join(", "),
        stock: product.stock.toString(),
        badge: product.badge || "",
        image_url: product.image_url,
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: "", category: "", price: "", features: "", stock: "", badge: "", image_url: "" })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseInt(formData.price),
      features: formData.features.split(",").map(f => f.trim()).filter(Boolean),
      stock: parseInt(formData.stock),
      badge: formData.badge || null,
      image_url: formData.image_url,
    }

    if (editingProduct) {
      await supabase.from('products').update(productData).eq('id', editingProduct.id)
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p))
    } else {
      const { data } = await supabase.from('products').insert(productData).select().single()
      if (data) setProducts(prev => [data, ...prev])
    }

    setSaving(false)
    setIsModalOpen(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
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
          <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Calendar className="w-5 h-5" />
            Bookings
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-accent/10 text-accent">
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
              <h1 className="text-display text-2xl sm:text-3xl text-foreground">Product Catalog</h1>
              <p className="text-muted-foreground mt-1">Manage your surveillance products</p>
            </div>
          </div>
          <Button onClick={() => openModal()} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-card border border-border/50 overflow-hidden"
            >
              <div className="relative aspect-[4/5] bg-secondary/50">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                {product.badge && (
                  <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</div>
                <h3 className="font-bold text-foreground mt-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-semibold text-accent">₹{product.price.toLocaleString()}</span>
                  <Badge variant="outline" className={product.stock > 0 ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => openModal(product)} className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No products yet</h3>
            <p className="text-muted-foreground mt-2">Start by adding your first product</p>
            <Button onClick={() => openModal()} className="mt-6 bg-accent text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-card rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Dome Pro 4K" required className="h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="w-full h-12 rounded-xl border border-border bg-background px-4">
                    <option value="">Select category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="12999" required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="50" required className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Features (comma-separated)</Label>
                  <Textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="4K Ultra HD, Night Vision, AI Detection" className="rounded-xl resize-none" rows={2} />
                </div>

                <div className="space-y-2">
                  <Label>Badge (optional)</Label>
                  <Input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} placeholder="Best Seller, New, Pro" className="h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.png" className="h-12 rounded-xl" />
                </div>

                <Button type="submit" disabled={saving} className="w-full h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <>{editingProduct ? 'Update Product' : 'Add Product'}</>}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}