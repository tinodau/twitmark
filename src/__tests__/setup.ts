import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"

// Mock Supabase
vi.mock("@supabase/supabase-js", async () => {
  return {
    createClient: vi.fn(() => ({
      auth: {
        getUser: vi.fn(),
        signInWithOAuth: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        single: vi.fn(),
      })),
    })),
  }
})
