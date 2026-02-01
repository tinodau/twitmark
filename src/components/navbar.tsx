"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
  ];

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg"
      aria-label="Main navigation"
    >
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold"
            aria-hidden="true"
          >
            T
          </div>
          <span className="text-xl font-bold text-white">Twitmark</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 sm:flex" role="list">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-2 py-1"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dashboard"
              className="group relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Go to dashboard"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </motion.div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle mobile menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 sm:hidden focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 bg-black/40 backdrop-blur-lg sm:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-4 px-4 py-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-medium text-muted-foreground transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg px-2 py-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 text-sm font-medium text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Go to dashboard"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
