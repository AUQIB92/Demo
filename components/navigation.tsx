"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "?v=home", label: "Home", key: "home" },
  { href: "?v=products", label: "Products", key: "products" },
  { href: "?v=services", label: "Services", key: "services" },
  { href: "?v=process", label: "Process", key: "process" },
  { href: "?v=faq", label: "FAQ", key: "faq" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const searchParams = useSearchParams()
  const activeView = searchParams.get("v") || "home"

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-6 pt-6 sm:px-10"
    >
      <div
        className={[
          "mx-auto max-w-7xl rounded-[30px] border border-white/[0.55] bg-background/[0.76] backdrop-blur-2xl transition-all duration-300 dark:border-white/10",
          "shadow-[0_26px_90px_-42px_rgba(5,48,56,0.55)]",
          isScrolled ? "bg-background/[0.91] shadow-[0_30px_100px_-42px_rgba(5,48,56,0.62)]" : "",
        ].join(" ")}
      >
        <nav className="flex h-20 items-center justify-between px-6 sm:px-8">
          <Link href="/" className="group flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-accent/40">
              <Eye className="h-6 w-6" />
              <div className="absolute inset-0 animate-pulse rounded-xl bg-white/10" />
            </div>
            <div className="flex flex-col -space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tighter text-foreground sm:text-2xl">
                  HR
                </span>
                <span className="text-xl font-bold tracking-tighter text-accent sm:text-2xl">
                  SECURITY
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.45em] text-muted-foreground/60">
                Services
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-full px-7 py-3 text-lg font-black transition-all duration-300",
                  activeView === link.key
                    ? "text-accent bg-accent/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            <Link href="/booking">
              <Button
                size="sm"
                className="h-10 rounded-full px-6 font-bold shadow-none"
              >
                Book Now
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full border border-border/70 bg-background/70 p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[28px] border border-white/[0.45] bg-background/92 shadow-[0_24px_70px_-34px_rgba(5,48,56,0.5)] backdrop-blur-2xl md:hidden dark:border-white/10"
      >
        <div className="space-y-4 px-6 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={[
                "block rounded-2xl border border-transparent px-4 py-3 text-sm font-medium transition-all",
                activeView === link.key
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "bg-secondary/20 text-muted-foreground hover:border-border/60 hover:text-foreground",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
          <div className="space-y-3 border-t border-border/60 pt-4">
            <div className="flex items-center justify-between rounded-2xl bg-secondary/30 px-4 py-3">
              <span className="text-sm text-muted-foreground">Appearance</span>
              <ThemeToggle />
            </div>
            <Link href="/dashboard" className="block">
              <Button variant="ghost" className="w-full justify-start rounded-full text-muted-foreground">
                Sign in
              </Button>
            </Link>
            <Link href="/booking" className="block">
              <Button className="w-full rounded-full">Book Now</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}
