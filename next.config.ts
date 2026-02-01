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
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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
}

export default nextConfig
