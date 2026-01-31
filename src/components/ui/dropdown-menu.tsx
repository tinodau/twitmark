"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

interface DropdownMenuItemProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
}

export function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 min-w-[180px] overflow-hidden rounded-xl border border-border/40 bg-background/95 backdrop-blur shadow-lg"
            role="menu"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownMenuItem({
  onClick,
  disabled,
  children,
  icon,
  variant = "default",
}: DropdownMenuItemProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      disabled={disabled}
      role="menuitem"
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "danger"
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-accent"
      }`}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {children}
    </button>
  );
}
