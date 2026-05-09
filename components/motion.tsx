"use client"

import { motion, type Variants, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

// Premium animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
  }
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }
  }
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }
  }
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
  }
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }
  }
}

// Motion components
interface MotionDivProps extends HTMLMotionProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function FadeIn({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeIn}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeInUp({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={scaleIn}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Hover card with subtle lift effect
export function HoverCard({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -4,
        transition: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }
      }}
      className={cn("transition-shadow duration-300", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Text reveal animation
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
  const words = children.split(" ")
  
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("inline-flex flex-wrap", className)}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay
          }
        }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
