"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, LayoutGrid, Sparkles, Zap } from "lucide-react";
import AuroraBackground from "@/components/ui/aurora-background";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import TestimonialsMarquee from "@/components/testimonials-marquee";

export default function Home() {
  return (
    <AuroraBackground>
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="container relative z-10 mx-auto px-4 pt-32 sm:px-8"
      >
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
              <span className="text-muted-foreground">
                Your personal X bookmark manager
              </span>
            </motion.div>

            <h1
              id="hero-title"
              className="mb-6 bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl"
            >
              Save tweets. Read later.
              <br />
              Never lose gems.
            </h1>

            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Organize your X bookmarks with folders, read in distraction-free
              mode, and build your personal knowledge base.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/dashboard"
                className="group relative flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Get Started Free
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="#features"
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
          className="mx-auto mt-32 max-w-6xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2
              id="features-title"
              className="mb-4 text-4xl font-bold sm:text-5xl"
            >
              Everything you need to{" "}
              <span className="text-gradient">curate</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple, powerful, and beautiful bookmark management
            </p>
          </motion.div>

          <BentoGrid className="mx-auto max-w-6xl">
            <BentoGridItem
              title="Smart Folders"
              description="Organize bookmarks into custom folders. Filter by topic, project, or mood."
              icon={<LayoutGrid className="h-6 w-6" aria-hidden="true" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Reading Mode"
              description="Distraction-free reading experience with clean typography and progress tracking."
              icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
            />
            <BentoGridItem
              title="Quick Actions"
              description="Save any tweet with one click. Access your library instantly."
              icon={<Zap className="h-6 w-6" aria-hidden="true" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Search & Filter"
              description="Find any bookmark in seconds with powerful search and smart filters."
              icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
              className="md:col-span-3 md:row-span-2"
              header={
                <div
                  className="flex h-full w-full items-center justify-center text-6xl font-bold text-white/10"
                  aria-hidden="true"
                >
                  🔍
                </div>
              }
            />
          </BentoGrid>
        </section>

        {/* Testimonials Marquee */}
        <TestimonialsMarquee />

        {/* CTA Section */}
        <section
          aria-labelledby="cta-title"
          className="mx-auto mt-32 max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 sm:p-16"
          >
            <h2 id="cta-title" className="mb-4 text-4xl font-bold sm:text-5xl">
              Ready to build your{" "}
              <span className="text-gradient">knowledge base</span>?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of users who save tweets daily. No credit card
              required.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-10 text-lg font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
          className="mx-auto mt-32 max-w-6xl border-t border-white/10 pt-8 text-center text-sm text-muted-foreground"
          role="contentinfo"
        >
          <p>Built with Next.js 16, Tailwind CSS 4, and Framer Motion</p>
        </footer>
      </main>
    </AuroraBackground>
  );
}
