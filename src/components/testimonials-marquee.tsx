"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"

const testimonials = [
  {
    name: "Alex Chen",
    username: "@alxchen",
    content: "Twitmark completely changed how I curate my X feed. The folder system is genius!",
    rating: 5,
  },
  {
    name: "Sarah Miller",
    username: "@sarahm",
    content: "Finally, a bookmark manager that understands X. Reading mode is a game changer.",
    rating: 5,
  },
  {
    name: "James Wilson",
    username: "@jwilson",
    content: "I've saved hundreds of valuable tweets. Twitmark helps me actually read them.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    username: "@emilyd",
    content: "Clean, fast, and beautiful. Exactly what I needed for organizing my X bookmarks.",
    rating: 5,
  },
  {
    name: "Michael Brown",
    username: "@mikeb",
    content: "The glassmorphism UI is stunning. Makes bookmarking actually enjoyable.",
    rating: 5,
  },
  {
    name: "Lisa Taylor",
    username: "@lisat",
    content: "I used to lose tweets in my likes. Now I have everything organized perfectly.",
    rating: 5,
  },
]

export default function TestimonialsMarquee() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // On mobile, show static cards instead of marquee
  const totalCardsMobile = 3
  const displayTestimonials = isMobile ? testimonials.slice(0, totalCardsMobile) : testimonials

  return (
    <section className="border-border/40 bg-background/95 -mx-4 mt-24 overflow-hidden border-y px-4 py-16 backdrop-blur-sm sm:px-0 dark:border-white/10 dark:bg-black/20">
      <div className="mb-12 px-4 text-center">
        <h2 className="mb-4 text-2xl font-bold sm:text-4xl">
          Loved by <span className="text-gradient dark:text-gradient">curators</span>
        </h2>
        <p className="text-foreground/70 dark:text-muted-foreground text-sm sm:text-lg">
          Join thousands who save tweets daily
        </p>
      </div>

      <div className="relative w-full overflow-hidden" style={{ maxWidth: "100%" }}>
        {/* Fade edges only on desktop */}
        {!isMobile && (
          <>
            <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-12 bg-linear-to-r to-transparent sm:w-20" />
            <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-12 bg-linear-to-l to-transparent sm:w-20" />
          </>
        )}

        {/* Mobile: Static grid, Desktop: Scrolling marquee */}
        {isMobile ? (
          <div className="flex flex-col gap-4 px-4">
            {displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="border-border/40 bg-background/95 hover:border-border/60 hover:bg-background/100 rounded-2xl border p-4 saturate-180 backdrop-blur-sm transition-all dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/70 dark:text-muted-foreground mb-4 text-sm">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500/20 to-cyan-500/20 text-sm font-bold text-blue-600 dark:text-blue-400">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-foreground font-medium dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-foreground/60 dark:text-muted-foreground text-xs">
                      {testimonial.username}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            animate={{ x: ["0%", "-40%"] }}
            transition={{
              duration: 40,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              repeatType: "loop",
            }}
            className="flex gap-4 whitespace-nowrap sm:gap-6"
          >
            {[...displayTestimonials, ...displayTestimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="border-border/40 bg-background/95 hover:border-border/60 hover:bg-background/100 min-w-70 overflow-hidden rounded-2xl border p-4 saturate-180 backdrop-blur-sm transition-all sm:min-w-[320px] sm:p-6 lg:min-w-87.5 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/70 dark:text-muted-foreground mb-4 text-wrap">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500/20 to-cyan-500/20 text-sm font-bold text-blue-600 dark:text-blue-400">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-foreground font-medium dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-foreground/60 dark:text-muted-foreground text-sm">
                      {testimonial.username}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
