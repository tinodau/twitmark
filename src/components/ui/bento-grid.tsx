"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BentoGridProps {
  className?: string
  children: React.ReactNode
}

interface BentoGridItemProps {
  className?: string
  title?: string
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
}

const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid auto-rows-[18rem] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}

const BentoGridItem = ({ className, title, description, icon, children }: BentoGridItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 saturate-180 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {icon && (
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400">
            {icon}
          </div>
        )}
        {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
        {children}
      </div>
      {/* Hover glow effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
    </motion.div>
  )
}

export { BentoGrid, BentoGridItem }
