"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StaggerContainer, StaggerItem } from "@/components/motion"

const products = [
  {
    name: "Dome Pro 4K",
    category: "Indoor Camera",
    image: "/product-images/dome-pro-4k.png",
    price: 12999,
    rating: 4.9,
    reviews: 284,
    features: ["4K Ultra HD", "Night Vision", "AI Detection", "360-degree view"],
    badge: "Best Seller",
  },
  {
    name: "Bullet Elite",
    category: "Outdoor Camera",
    image: "/product-images/bullet-elite.png",
    price: 15999,
    rating: 4.8,
    reviews: 156,
    features: ["Weatherproof", "100m IR", "License Plate", "2-Way Audio"],
    badge: "New",
  },
  {
    name: "PTZ Guardian",
    category: "PTZ Camera",
    image: "/product-images/ptz-guardian.png",
    price: 34999,
    rating: 4.9,
    reviews: 89,
    features: ["30x Zoom", "Auto Tracking", "Preset Tours", "Smart Analytics"],
    badge: "Pro",
  },
  {
    name: "NVR Hub 16",
    category: "Network Recorder",
    image: "/product-images/nvr-hub-16.png",
    price: 24999,
    rating: 4.7,
    reviews: 203,
    features: ["16 Channels", "4TB Storage", "Remote Access", "AI Search"],
    badge: null,
  },
]

export function ProductsSection({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 sm:py-32">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="section-kicker">Equipment</span>
            <h2 className="section-title">
              Minimalist <span className="brand-gradient-text italic px-2">hardware</span>
            </h2>
            <p className="section-copy">
              Curated surveillance hardware featuring superior optics 
              and elegant industrial design.
            </p>
          </div>
          <Link href="/products" className="shrink-0">
            <Button variant="outline" className="h-12 rounded-full border-border/40 bg-background/20 px-8 text-sm font-bold backdrop-blur-sm transition-all hover:bg-background/40 hover:border-accent/30">
              View All
            </Button>
          </Link>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.name}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4 }}
                className="group relative h-full"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-muted/20 dark:bg-muted/10">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {product.badge && (
                    <Badge className="absolute left-6 top-6 border-0 bg-accent px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-none">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    <span>{product.category}</span>
                    <span className="text-accent">{product.rating} Rating</span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {product.name}
                  </h3>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={() => {
                        const message = `Hello HR Security Services, I'm interested in the ${product.name} model. Could you please provide the latest price and details?`;
                        window.open(`https://wa.me/917006255363?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full h-12 rounded-2xl bg-accent/5 text-accent border border-accent/20 font-bold transition-all hover:bg-accent hover:text-white"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Get Price via WhatsApp
                    </Button>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
