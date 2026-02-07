"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, LayoutGrid, Sparkles, Zap } from "lucide-react"
import AuroraBackground from "@/components/ui/aurora-background"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import TestimonialsMarquee from "@/components/testimonials-marquee"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkAuth()
  }, [])

  const buttonText = user ? "Dashboard" : "Get Started Free"
  return (
    <AuroraBackground>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Skip to main content
      </a>
      <main id="main-content" className="relative z-10 mx-auto px-4 pt-24 sm:pt-32">
        {/* Hero Section */}
        <section aria-labelledby="hero-title">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-md px-4 text-center md:max-w-lg lg:max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-sm"
            >
              <Sparkles className="h-3 w-3 text-blue-400 sm:h-4 sm:w-4" />
              <span className="text-muted-foreground dark:text-muted-foreground">
                Your personal X bookmark manager
              </span>
            </motion.div>

            <h1
              id="hero-title"
              className="bg-linear-to-r from-cyan-600 to-blue-700 bg-clip-text pb-4 text-3xl leading-tight font-bold tracking-tight text-transparent sm:mb-6 sm:text-4xl sm:leading-tight lg:text-7xl lg:leading-[1.05] dark:from-white dark:via-white dark:to-white/70"
            >
              Save tweets. Read later.
              <br />
              Never lose gems.
            </h1>

            <p className="text-foreground/80 dark:text-muted-foreground mb-8 px-2 text-base leading-relaxed sm:mb-10 sm:px-0 sm:text-xl sm:leading-relaxed">
              Organize your X bookmarks with folders, search instantly, and build your personal
              knowledge base.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Link
                href="/dashboard"
                className="group focus:ring-primary/50 relative flex h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyan-600 to-blue-700 px-6 text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 focus:ring-2 focus:outline-none sm:w-auto sm:px-8"
                aria-label={user ? "Go to dashboard" : "Get started free"}
              >
                {loading ? "..." : buttonText}
                {!user && (
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </Link>
              <Link
                href="#features"
                className="focus:ring-primary/50 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 focus:ring-2 focus:outline-none sm:w-auto sm:px-8"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="mx-auto mt-24 max-w-md scroll-mt-20 px-4 sm:mt-32 sm:scroll-mt-24 sm:px-0 lg:max-w-5xl xl:max-w-6xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8 text-center sm:mb-12"
          >
            <h2
              id="features-title"
              className="mb-3 text-2xl leading-tight font-bold sm:mb-4 sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight"
            >
              Everything you need to{" "}
              <span className="text-gradient dark:text-gradient">curate</span>
            </h2>
            <p className="text-foreground/80 dark:text-muted-foreground px-2 text-base sm:px-0 sm:text-lg">
              Simple, powerful, and beautiful bookmark management
            </p>
          </motion.div>

          <BentoGrid className="mx-auto max-w-6xl">
            <BentoGridItem
              title="Unlimited Folders"
              description="Create unlimited folders to organize your bookmarks by topic, project, or mood."
              icon={<LayoutGrid className="h-6 w-6" aria-hidden="true" />}
            />
            <BentoGridItem
              title="Quick Actions"
              description="Save, edit, and manage your bookmarks with a clean, intuitive interface."
              icon={<Zap className="h-6 w-6" aria-hidden="true" />}
            />
            <BentoGridItem
              title={
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <span>Search & Filter</span>
                  <span className="text-muted-foreground rounded-full bg-white/10 px-2 py-0.5 text-xs">
                    Coming Soon
                  </span>
                </div>
              }
              description="Find any bookmark instantly with powerful search and filter by folder or content."
              icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
            />
          </BentoGrid>
        </section>

        {/* About Section */}
        <section
          id="about"
          aria-labelledby="about-title"
          className="mx-auto mt-24 max-w-md scroll-mt-20 px-4 text-center sm:mt-32 sm:scroll-mt-24 sm:px-0 md:max-w-lg lg:max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              id="about-title"
              className="mb-6 text-2xl leading-tight font-bold sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight"
            >
              Built for <span className="text-gradient dark:text-gradient">curators</span>, by a
              curator
            </h2>
            <p className="text-foreground/80 dark:text-muted-foreground mb-6 px-2 text-base leading-relaxed sm:mb-8 sm:px-0 sm:text-lg sm:leading-relaxed">
              Twitmark was born from a simple frustration: losing track of valuable X content. But
              folders are a premium feature, so as a developer who constantly discovers gems on the
              platform, I needed a better way to save, organize, and actually read what matters.
            </p>
            <p className="text-foreground/80 dark:text-muted-foreground mb-6 px-2 text-base leading-relaxed sm:mb-8 sm:px-0 sm:text-lg sm:leading-relaxed">
              No more losing tweets to the void. No more scrolling through likes and bookmarks to
              find that one perfect thread. Just clean, simple bookmark management that works the
              way you do.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-cyan-600 to-blue-700 text-xl font-bold text-white">
                T
              </div>
              <div className="text-left">
                <p className="font-medium text-white dark:text-white">Built by Tino Dau</p>
                <p className="text-foreground/70 dark:text-muted-foreground text-sm">
                  Developer & X User
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials Marquee */}
        <TestimonialsMarquee />

        {/* CTA Section */}
        <section
          aria-labelledby="cta-title"
          className="mx-auto mt-24 max-w-4xl px-4 text-center sm:mt-32 sm:px-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:border-0 sm:bg-transparent sm:p-12 lg:p-16"
          >
            <h2
              id="cta-title"
              className="mb-4 flex flex-col text-2xl leading-tight font-bold sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight"
            >
              <span>Ready to build your</span>
              <span>
                <span className="text-gradient">knowledge base</span>?
              </span>
            </h2>
            <p className="text-foreground/80 dark:text-muted-foreground mb-6 px-2 text-base leading-relaxed sm:mb-8 sm:px-0 sm:text-lg sm:leading-relaxed">
              Join thousands of users who save tweets daily. No credit card required.
            </p>
            <Link
              href="/dashboard"
              className="group focus:ring-primary/50 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-cyan-600 to-blue-700 px-6 text-base font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 focus:ring-2 focus:outline-none sm:h-14 sm:w-auto sm:px-10 sm:text-lg"
            >
              Start Now
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer
          className="text-foreground/60 border-border/20 dark:text-muted-foreground mx-auto mt-24 border-t px-4 py-6 text-center text-xs sm:mt-32 sm:py-8 sm:text-sm dark:border-white/10"
          role="contentinfo"
        >
          <p>Built by Tino Dau</p>
        </footer>
      </main>
    </AuroraBackground>
  )
}
