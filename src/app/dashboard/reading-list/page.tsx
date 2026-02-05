"use client"

import { motion } from "framer-motion"
import { Clock, Sparkles } from "lucide-react"

export default function ReadingListPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-border/40 bg-background/95 relative overflow-hidden rounded-2xl border p-12 text-center backdrop-blur"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-24 -right-24 h-48 w-48 animate-pulse rounded-full" />
        <div
          className="absolute -bottom-24 -left-24 h-48 w-48 animate-pulse rounded-full bg-cyan-500/5"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative">
        <div className="from-primary/20 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br to-cyan-500/20">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Clock className="text-primary h-12 w-12" />
          </motion.div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-3 text-2xl font-bold"
        >
          Reading List
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mx-auto mb-6 max-w-md"
        >
          Track and manage your bookmarks that you want to read later. This feature is coming soon.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground flex items-center justify-center gap-2 text-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>Stay tuned for updates</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
