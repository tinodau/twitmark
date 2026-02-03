import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ConditionalNavbar } from "@/components/conditional-navbar"
import { AppToastProvider } from "./toast-provider"
import { QueryProvider } from "./query-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const runtime = "edge"

export const metadata: Metadata = {
  title: "Twitmark - Your Personal X Bookmark Manager",
  description:
    "Save tweets. Read later. Never lose gems. Organize your X bookmarks with folders, read in distraction-free mode, and build your personal knowledge base.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark w-screen max-w-screen overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} w-screen max-w-screen overflow-x-hidden antialiased`}
      >
        <QueryProvider>
          <AppToastProvider>
            <ConditionalNavbar />
            {children}
          </AppToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
