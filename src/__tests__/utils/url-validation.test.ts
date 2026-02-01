import { describe, it, expect } from "vitest"

/**
 * URL Validation Tests
 * Tests for validating X/Twitter URLs
 */

describe("URL Validation", () => {
  describe("Valid X/Twitter URLs", () => {
    it("should accept x.com status URLs", () => {
      const url = "https://x.com/elonmusk/status/123456789"
      expect(isValidTwitterUrl(url)).toBe(true)
    })

    it("should accept x.com status URLs with query params", () => {
      const url = "https://x.com/user/status/123456789?s=20"
      expect(isValidTwitterUrl(url)).toBe(true)
    })

    it("should accept twitter.com status URLs", () => {
      const url = "https://twitter.com/user/status/123456789"
      expect(isValidTwitterUrl(url)).toBe(true)
    })

    it("should accept x.com status URLs with www", () => {
      const url = "https://www.x.com/user/status/123456789"
      expect(isValidTwitterUrl(url)).toBe(true)
    })

    it("should accept www.twitter.com status URLs", () => {
      const url = "https://www.twitter.com/user/status/123456789"
      expect(isValidTwitterUrl(url)).toBe(true)
    })

    it("should accept http protocol", () => {
      const url = "http://x.com/user/status/123456789"
      expect(isValidTwitterUrl(url)).toBe(true)
    })
  })

  describe("Invalid URLs", () => {
    it("should reject facebook.com URLs", () => {
      const url = "https://facebook.com/post/123456"
      expect(isValidTwitterUrl(url)).toBe(false)
    })

    it("should reject youtube.com URLs", () => {
      const url = "https://youtube.com/watch?v=abc123"
      expect(isValidTwitterUrl(url)).toBe(false)
    })

    it("should reject x.com profile URLs without status", () => {
      const url = "https://x.com/elonmusk"
      expect(isValidTwitterUrl(url)).toBe(false)
    })

    it("should reject empty string", () => {
      const url = ""
      expect(isValidTwitterUrl(url)).toBe(false)
    })

    it("should reject non-URL strings", () => {
      const url = "not a url"
      expect(isValidTwitterUrl(url)).toBe(false)
    })

    it("should reject instagram.com URLs", () => {
      const url = "https://instagram.com/p/abc123"
      expect(isValidTwitterUrl(url)).toBe(false)
    })
  })

  describe("Tweet ID Extraction", () => {
    it("should extract tweet ID from x.com URL", () => {
      const url = "https://x.com/user/status/123456789"
      expect(extractTweetId(url)).toBe("123456789")
    })

    it("should extract tweet ID from twitter.com URL", () => {
      const url = "https://twitter.com/user/status/987654321"
      expect(extractTweetId(url)).toBe("987654321")
    })

    it("should extract tweet ID from URL with query params", () => {
      const url = "https://x.com/user/status/123456789?s=20&t=abc"
      expect(extractTweetId(url)).toBe("123456789")
    })

    it("should return null for invalid URL", () => {
      const url = "https://facebook.com/post/123456"
      expect(extractTweetId(url)).toBe(null)
    })
  })
})

/**
 * Helper functions for URL validation (inlined for testing)
 * In production, these would be in a shared utility file
 */

function isValidTwitterUrl(url: string): boolean {
  if (!url || url.trim().length === 0) {
    return false
  }

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    // Accept x.com or twitter.com
    const validHostnames = ["x.com", "www.x.com", "twitter.com", "www.twitter.com"]

    if (!validHostnames.includes(hostname)) {
      return false
    }

    // Must contain /status/ path
    const pathParts = urlObj.pathname.split("/")
    return pathParts.includes("status")
  } catch {
    return false
  }
}

function extractTweetId(url: string): string | null {
  if (!isValidTwitterUrl(url)) {
    return null
  }

  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // Find the part after "status"
    const statusIndex = pathParts.indexOf("status")
    if (statusIndex >= 0 && statusIndex < pathParts.length - 1) {
      return pathParts[statusIndex + 1]
    }

    return null
  } catch {
    return null
  }
}
