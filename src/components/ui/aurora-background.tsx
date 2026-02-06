"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
  children: React.ReactNode
  showRadialGradient?: boolean
}

export default function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "bg-background relative flex min-h-screen flex-col items-center justify-center",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-bg absolute inset-0 opacity-50" />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-[20%] -left-[20%] h-[60%] w-[60%] rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -right-[20%] -bottom-[20%] h-[60%] w-[60%] rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-[30%] left-[30%] h-[40%] w-[40%] rounded-full bg-blue-600/10 blur-3xl"
        />
      </div>
      {showRadialGradient && (
        <div className="from-background absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
