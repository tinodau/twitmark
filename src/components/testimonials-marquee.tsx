"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

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
  return (
    <section className="overflow-hidden border-y border-white/10 bg-black/20 py-16 backdrop-blur-sm">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
          Loved by <span className="text-gradient">curators</span>
        </h2>
        <p className="text-muted-foreground text-lg">Join thousands who save tweets daily</p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="from-background absolute top-0 left-0 z-10 h-full w-20 bg-gradient-to-r to-transparent" />
        <div className="from-background absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l to-transparent" />

        {/* Scrolling content */}
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="flex gap-6"
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="glass min-w-[350px] rounded-2xl border border-white/10 p-6 backdrop-blur-sm transition-all hover:border-white/20"
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-sm font-bold text-blue-400">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.username}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
