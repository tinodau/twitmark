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
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
}

const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(14rem,auto)] grid-cols-1 gap-3 px-4 sm:gap-4 md:auto-rows-[minmax(18rem,auto)] lg:grid-cols-3",
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
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group border-border/80 bg-background/65 hover:border-border/60 hover:bg-background relative overflow-hidden rounded-2xl border p-4 saturate-180 backdrop-blur-sm transition-all duration-300 sm:p-5 md:p-6 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {icon && (
          <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 sm:h-10 sm:w-10 dark:text-blue-400">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="text-foreground text-lg font-semibold sm:text-xl dark:text-white">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-foreground/70 dark:text-muted-foreground text-sm leading-relaxed sm:text-base">
            {description}
          </p>
        )}
        {children}
      </div>
      {/* Hover glow effect */}
      <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
    </motion.div>
  )
}

export { BentoGrid, BentoGridItem }
