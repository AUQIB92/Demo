"use client"

import { Suspense, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StaggerContainer, StaggerItem } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { 
  Search, 
  Grid3X3, 
  List, 
  Star, 
  Check,
  SlidersHorizontal,
  ChevronDown 
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

const categories = [
  { id: "all", label: "All Products" },
  { id: "dome", label: "Dome Cameras" },
  { id: "bullet", label: "Bullet Cameras" },
  { id: "ptz", label: "PTZ Cameras" },
  { id: "nvr", label: "NVR/DVR" },
  { id: "locks", label: "Smart Locks" },
  { id: "alarms", label: "Alarm Systems" },
]

const products = [
  {
    id: 1,
    name: "Dome Pro 4K",
    category: "dome",
    image: "/product-images/dome-pro-4k.png",
    price: 12999,
    rating: 4.9,
    reviews: 284,
    features: ["4K Ultra HD", "Night Vision", "AI Detection", "360-degree view"],
    badge: "Best Seller",
    inStock: true,
    installationIncluded: true,
  },
  {
    id: 2,
    name: "Bullet Elite",
    category: "bullet",
    image: "/product-images/bullet-elite.png",
    price: 15999,
    rating: 4.8,
    reviews: 156,
    features: ["Weatherproof", "100m IR", "License Plate", "2-Way Audio"],
    badge: "New",
    inStock: true,
    installationIncluded: true,
  },
  {
    id: 3,
    name: "PTZ Guardian",
    category: "ptz",
    image: "/product-images/ptz-guardian.png",
    price: 34999,
    rating: 4.9,
    reviews: 89,
    features: ["30x Zoom", "Auto Tracking", "Preset Tours", "Smart Analytics"],
    badge: "Pro",
    inStock: true,
    installationIncluded: true,
  },
  {
    id: 4,
    name: "NVR Hub 16",
    category: "nvr",
    image: "/product-images/nvr-hub-16.png",
    price: 24999,
    rating: 4.7,
    reviews: 203,
    features: ["16 Channels", "4TB Storage", "Remote Access", "AI Search"],
    badge: null,
    inStock: true,
    installationIncluded: false,
  },
  {
    id: 5,
    name: "Dome Mini",
    category: "dome",
    image: "/product-images/dome-pro-4k.png",
    price: 6999,
    rating: 4.6,
    reviews: 412,
    features: ["1080p HD", "Compact", "Easy Install", "Motion Alerts"],
    badge: "Budget Pick",
    inStock: true,
    installationIncluded: true,
  },
  {
    id: 6,
    name: "Smart Lock X1",
    category: "locks",
    image: "/product-images/ptz-guardian.png",
    price: 18999,
    rating: 4.8,
    reviews: 178,
    features: ["Fingerprint", "Face ID", "Remote Access", "Auto Lock"],
    badge: "Smart Home",
    inStock: true,
    installationIncluded: true,
  },
  {
    id: 7,
    name: "Bullet Pro Night",
    category: "bullet",
    image: "/product-images/bullet-elite.png",
    price: 19999,
    rating: 4.9,
    reviews: 134,
    features: ["Color Night Vision", "4K HDR", "Smart Motion", "Siren"],
    badge: null,
    inStock: false,
    installationIncluded: true,
  },
  {
    id: 8,
    name: "Alarm System Pro",
    category: "alarms",
    image: "/product-images/nvr-hub-16.png",
    price: 29999,
    rating: 4.7,
    reviews: 98,
    features: ["24/7 Monitoring", "Sensors Kit", "Mobile Alerts", "Battery Backup"],
    badge: "Complete Kit",
    inStock: true,
    installationIncluded: true,
  },
]

function ProductsContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-32">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="spotlight-orb right-10 top-24 h-80 w-80 bg-accent/12" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="section-kicker">Products</span>
            <h1 className="mt-6 text-display text-5xl text-foreground sm:text-6xl">
              Teal-grade security equipment
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Camera, recorder, and access-control bundles selected for sharp footage,
              clean installs, and reliable remote monitoring.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="premium-card mb-8 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-full border-border/60 bg-background/70 pl-10 focus:border-accent/50"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Category Select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] rounded-full border-border/60 bg-background/70">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-border/50 md:hidden">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <div key={cat.id} className="flex items-center gap-2">
                            <Checkbox
                              id={cat.id}
                              checked={selectedCategory === cat.id}
                              onCheckedChange={() => setSelectedCategory(cat.id)}
                            />
                            <label htmlFor={cat.id} className="text-sm text-muted-foreground">
                              {cat.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="hidden items-center rounded-full border border-border/50 bg-background/60 p-1 sm:flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" 
                      ? "bg-accent/12 text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" 
                      ? "bg-secondary text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-muted-foreground mb-6"
          >
            Showing {filteredProducts.length} products
          </motion.p>

          {/* Products Grid */}
          <StaggerContainer 
            className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <StaggerItem key={product.id}>
                {viewMode === "grid" ? (
                  <ProductCard product={product} />
                ) : (
                  <ProductListItem product={product} />
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Spinner className="h-8 w-8 text-accent" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}

interface ProductProps {
  product: typeof products[0]
}

function ProductCard({ product }: ProductProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      className="premium-card group"
    >
      {/* Image */}
      <div className="relative z-10 aspect-square overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.2),transparent_48%),linear-gradient(145deg,rgba(255,255,255,0.75),rgba(204,251,241,0.32))] dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_48%),linear-gradient(145deg,rgba(20,83,88,0.45),rgba(8,47,73,0.22))]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/75 to-transparent" />
        <div className="absolute bottom-4 right-4 rounded-full border border-white/30 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur-xl">
          {product.category}
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <Badge className="border-0 bg-accent/92 text-accent-foreground shadow-[0_14px_28px_-18px_var(--glow-color)]">
              {product.badge}
            </Badge>
          )}
          {product.installationIncluded && (
            <Badge variant="outline" className="border-accent/30 bg-background/85 text-xs text-accent backdrop-blur-xl">
              Free Install
            </Badge>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm">
            <span className="text-muted-foreground font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        <h3 className="text-headline text-lg text-foreground mb-3">
          {product.name}
        </h3>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.features.slice(0, 2).map((feature, j) => (
            <span 
              key={j}
              className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-secondary/45 px-2.5 py-1 text-xs text-muted-foreground"
            >
              <Check className="w-3 h-3 text-accent" />
              {feature}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xl font-semibold text-foreground">
            Rs {product.price.toLocaleString()}
          </span>
          <Button 
            size="sm" 
            disabled={!product.inStock}
            className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function ProductListItem({ product }: ProductProps) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="premium-card group flex items-center gap-6 p-4"
    >
      {/* Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-secondary/50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {product.badge && (
            <Badge className="border-0 bg-accent/92 text-accent-foreground text-xs">
              {product.badge}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-headline text-foreground truncate">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {product.features.join(" / ")}
        </p>
      </div>

      {/* Price & Action */}
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold text-foreground whitespace-nowrap">
          Rs {product.price.toLocaleString()}
        </span>
        <Button 
          size="sm" 
          disabled={!product.inStock}
          className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Add
        </Button>
      </div>
    </motion.div>
  )
}
