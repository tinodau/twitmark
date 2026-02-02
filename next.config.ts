import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Cache components for partial prerendering
  cacheComponents: true,
  // Enable experimental features for better performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,
  },
  // Use edge runtime for better Cloudflare Pages compatibility
  serverExternalPackages: ["@supabase/supabase-js"],
  // Optimize images - use unoptimized for Cloudflare Pages
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: false, // Set to true if you encounter image issues on CF Pages
  },
  // Compress responses
  compress: true,
  // Production source maps for debugging (disable for smaller bundles)
  productionBrowserSourceMaps: false,
  // Optimize package imports
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },
  // Cloudflare Pages compatibility
  output: "standalone",
}

export default nextConfig
