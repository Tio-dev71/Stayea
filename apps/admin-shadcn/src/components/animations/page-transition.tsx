"use client"

import React from "react"
import { motion, AnimatePresence } from "motion/react"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  transitionKey?: string
}

/**
 * PageTransition provides a silky smooth entrance & exit transition for routes and tabs
 */
export function PageTransition({ children, className = "", transitionKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * FadeIn brings in elements with high-end luxury easing
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.28,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
}) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 12 }
      case "down":
        return { opacity: 0, y: -12 }
      case "left":
        return { opacity: 0, x: 12 }
      case "right":
        return { opacity: 0, x: -12 }
      case "none":
        return { opacity: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitial()}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerList container that animates children sequentially
 */
export function StaggerContainer({
  children,
  className = "",
  staggerChildren = 0.05,
  delayChildren = 0,
}: {
  children: React.ReactNode
  className?: string
  staggerChildren?: number
  delayChildren?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

