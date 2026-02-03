"use client"

import { createClient } from "@/lib/supabase/client"
import { LogOut, User, Menu, PanelLeftClose, PanelRight } from "lucide-react"

interface HeaderProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  }
  onMobileMenuToggle: () => void
  isMobileMenuOpen: boolean
  isSidebarCollapsed: boolean
  onSidebarToggle: () => void
}

export function Header({
  user,
  onMobileMenuToggle,
  isMobileMenuOpen,
  isSidebarCollapsed,
  onSidebarToggle,
}: HeaderProps) {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="bg-secondary supports-backdrop-filter:bg-background fixed top-0 right-0 left-0 z-30 border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left section - Logo area matching sidebar width */}
        <div className="hidden items-center justify-between lg:flex" style={{ width: "225px" }}>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-primary-foreground text-lg font-bold">T</span>
              </div>
              <span className="font-semibold">Twitmark</span>
            </div>

            {/* Sidebar Collapse Toggle */}
            <button
              onClick={onSidebarToggle}
              aria-expanded={!isSidebarCollapsed}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus:ring-2 focus:outline-none"
            >
              {isSidebarCollapsed ? (
                <PanelRight className="h-5 w-5" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <button
              onClick={onMobileMenuToggle}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
              className="text-foreground hover:bg-accent focus:ring-primary/50 mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors focus:ring-2 focus:outline-none"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-lg font-bold">T</span>
            </div>
            <span className="font-semibold">Twitmark</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.user_metadata?.full_name || "User"}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
            </div>
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Desktop User Section - Only visible on large screens */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.user_metadata?.full_name || "User"}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
            </div>
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-5 w-5" />
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
