"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Eye, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"

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
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const searchParams = useSearchParams()
  const activeView = searchParams.get("v") || "home"
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 200 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', authUser.id)
            .single()
          setUser({
            email: authUser.email || '',
            name: profile?.full_name || authUser.user_metadata?.full_name as string || 'User',
          })
        } catch {
          setUser({
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name as string || 'User',
          })
        }
      }
    }
    checkUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }, [cursorX, cursorY])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] h-10 w-10 rounded-full bg-accent/20 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hoveredLink ? 2.5 : 1,
          opacity: hoveredLink ? 0.5 : 0.6,
        }}
        transition={{ duration: 0.2 }}
      />
      
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="fixed left-0 right-0 top-0 z-50 px-6 pt-6 sm:px-10"
      >
        <motion.div
          className={[
            "mx-auto max-w-7xl rounded-[30px] border border-white/[0.55] bg-background/[0.76] backdrop-blur-2xl transition-all duration-300 dark:border-white/10",
            "shadow-[0_26px_90px_-42px_rgba(5,48,56,0.55)]",
            isScrolled ? "bg-background/[0.91] shadow-[0_30px_100px_-42px_rgba(5,48,56,0.62)]" : "",
          ].join(" ")}
        >
          <nav className="flex h-20 items-center justify-between px-6 sm:px-8">
            <Link href="/" className="group flex items-center gap-3.5">
              <motion.div 
                className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/25 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="h-6 w-6" />
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-white/10" 
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div className="flex flex-col -space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tighter text-foreground sm:text-2xl">
                    HR
                  </span>
                  <motion.span 
                    className="text-xl font-bold tracking-tighter text-accent sm:text-2xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    SECURITY
                  </motion.span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.45em] text-muted-foreground/60">
                  Services
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.key)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={[
                      "rounded-full px-7 py-3 text-lg font-black transition-all duration-300",
                      activeView === link.key
                        ? "text-accent bg-accent/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/5",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <ThemeToggle />
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3"
                >
                  <Link href="/dashboard">
                    <Button variant="ghost" className="h-10 rounded-full px-4 font-bold text-muted-foreground hover:text-foreground">
                      <User className="w-4 h-4 mr-2" />
                      {user.name.split(' ')[0]}
                    </Button>
                  </Link>
                  <button onClick={handleSignOut} className="p-2 rounded-full text-muted-foreground hover:text-destructive transition-colors" title="Sign out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button size="sm" className="h-11 rounded-full px-7 text-base font-extrabold tracking-wide bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/booking">
                  <Button size="sm" className="h-10 rounded-full px-6 font-bold shadow-none">Book Now</Button>
                </Link>
              </motion.div>
            </div>

            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full border border-border/70 bg-background/70 p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9, rotate: 90 }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </nav>
        </motion.div>

        <motion.div
          initial={false}
          animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[28px] border border-white/[0.45] bg-background/92 shadow-[0_24px_70px_-34px_rgba(5,48,56,0.5)] backdrop-blur-2xl md:hidden dark:border-white/10"
        >
          <div className="space-y-4 px-6 py-6">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={isOpen ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: navLinks.indexOf(link) * 0.05 }}
              >
                <Link
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
              </motion.div>
            ))}
            <motion.div 
              className="space-y-3 border-t border-border/60 pt-4"
              initial={{ opacity: 0 }}
              animate={isOpen ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between rounded-2xl bg-secondary/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <Link href="/dashboard" className="block">
                    <Button variant="ghost" className="w-full justify-start rounded-full text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      {user.name.split(' ')[0]}
                    </Button>
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setIsOpen(false) }}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-start rounded-full bg-accent text-accent-foreground font-bold">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/booking" className="block">
                <Button className="w-full rounded-full">Book Now</Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.header>
    </>
  )
}
