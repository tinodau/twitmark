"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, LayoutGrid, Sparkles, Zap } from "lucide-react"
import AuroraBackground from "@/components/ui/aurora-background"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import TestimonialsMarquee from "@/components/testimonials-marquee"

export default function Home() {
  return (
    <AuroraBackground>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Skip to main content
      </a>
      <main id="main-content" className="relative z-10 container mx-auto pt-32">
        {/* Hero Section */}
        <section aria-labelledby="hero-title">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-muted-foreground">Your personal X bookmark manager</span>
            </motion.div>

            <h1
              id="hero-title"
              className="mb-6 bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl"
            >
              Save tweets. Read later.
              <br />
              Never lose gems.
            </h1>

            <p className="text-muted-foreground mb-10 text-lg sm:text-xl">
              Organize your X bookmarks with folders, read in distraction-free mode, and build your
              personal knowledge base.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/dashboard"
                className="group focus:ring-primary/50 relative flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:ring-2 focus:outline-none"
              >
                Get Started Free
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="#features"
                className="focus:ring-primary/50 flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 focus:ring-2 focus:outline-none"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" aria-labelledby="features-title" className="mx-auto mt-32 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 id="features-title" className="mb-4 text-4xl font-bold sm:text-5xl">
              Everything you need to <span className="text-gradient">curate</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple, powerful, and beautiful bookmark management
            </p>
          </motion.div>

          <BentoGrid className="mx-auto max-w-6xl">
            <BentoGridItem
              title="Smart Folders"
              description="Organize bookmarks into custom folders. Filter by topic, project, or mood."
              icon={<LayoutGrid className="h-6 w-6" aria-hidden="true" />}
            />
            <BentoGridItem
              title="Reading Mode"
              description="Distraction-free reading experience with clean typography and progress tracking."
              icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
            />
            <BentoGridItem
              title="Search & Filter"
              description="Find any bookmark in seconds with powerful search and smart filters."
              icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
            />
            <BentoGridItem
              title="Quick Actions"
              description="Save any tweet with one click. Access your library instantly."
              icon={<Zap className="h-6 w-6" aria-hidden="true" />}
            />
          </BentoGrid>
        </section>

        {/* Testimonials Marquee */}
        <TestimonialsMarquee />

        {/* CTA Section */}
        <section aria-labelledby="cta-title" className="mx-auto mt-32 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 sm:p-16"
          >
            <h2 id="cta-title" className="mb-4 text-4xl font-bold sm:text-5xl">
              Ready to build your <span className="text-gradient">knowledge base</span>?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of users who save tweets daily. No credit card required.
            </p>
            <Link
              href="/dashboard"
              className="group focus:ring-primary/50 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-10 text-lg font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:ring-2 focus:outline-none"
            >
              Start Bookmarking Now
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer
          className="text-muted-foreground mx-auto mt-32 border-t border-white/10 py-8 text-center text-sm"
          role="contentinfo"
        >
          <p>Built by Tino Dau</p>
        </footer>
      </main>
    </AuroraBackground>
  )
}
