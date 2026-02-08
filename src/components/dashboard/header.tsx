"use client"

import { createClient } from "@/lib/supabase/client"
import { LogOut, User, PanelLeftClose, PanelRight } from "lucide-react"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"

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
    <header className="bg-secondary supports-backdrop-filter:bg-background sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Desktop Sidebar Collapse Toggle */}
        <button
          onClick={onSidebarToggle}
          aria-expanded={!isSidebarCollapsed}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-primary/50 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus:ring-2 focus:outline-none lg:flex"
        >
          {isSidebarCollapsed ? (
            <PanelRight className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <button
            onClick={onMobileMenuToggle}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close sidebar" : "Open sidebar"}
            className="text-foreground hover:bg-accent focus:ring-primary/50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors focus:ring-2 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PanelRight className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <div className="flex gap-4">
            <ThemeToggle />
            <DropdownMenu
              trigger={
                <div className="bg-muted hover:bg-accent focus:ring-primary/50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors focus:ring-2 focus:outline-none">
                  <User className="text-muted-foreground h-5 w-5" />
                </div>
              }
            >
              <DropdownMenuItem>
                <div className="flex flex-col items-start">
                  <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                icon={<LogOut className="h-4 w-4" />}
                variant="danger"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop Header - Theme Toggle & User Dropdown */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <ThemeToggle />
          <DropdownMenu
            trigger={
              <div className="bg-muted hover:bg-accent focus:ring-primary/50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors focus:ring-2 focus:outline-none">
                <User className="text-muted-foreground h-5 w-5" />
              </div>
            }
          >
            <DropdownMenuItem>
              <div className="flex flex-col items-start">
                <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              icon={<LogOut className="h-4 w-4" />}
              variant="danger"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
