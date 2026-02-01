import { test, devices, expect } from "@playwright/test"

test.describe("Responsive Design", () => {
  test("should work on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/")

    // Check if landing page is accessible on mobile
    const heroText = page.getByRole("heading", { level: 1 })
    await expect(heroText).toBeVisible()
  })

  test("should display correctly on tablet", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto("/dashboard")

    // Wait for content
    await page.waitForLoadState("networkidle")

    // Dashboard should be responsive
    const content = page.getByRole("main")
    await expect(content).toBeVisible()
  })

  test("should display correctly on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    await page.goto("/dashboard")

    // Wait for content
    await page.waitForLoadState("networkidle")

    // Dashboard should display properly
    const sidebar = page.getByRole("navigation")
    await expect(sidebar).toBeVisible()
  })

  test("should handle window resize", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForLoadState("networkidle")

    // Resize from desktop to mobile
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.setViewportSize({ width: 375, height: 667 })

    // Content should remain accessible
    const mainContent = page.getByRole("main")
    await expect(mainContent).toBeVisible()

    // Resize back to desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(mainContent).toBeVisible()
  })
})

test.describe("Mobile Safari", () => {
  test.use({ ...devices["iPhone 12"] })

  test("should work on iPhone 12", async ({ page }) => {
    await page.goto("/")
    const heroText = page.getByRole("heading", { level: 1 })
    await expect(heroText).toBeVisible()
  })
})

test.describe("Mobile Chrome", () => {
  test.use({ ...devices["Pixel 5"] })

  test("should work on Pixel 5", async ({ page }) => {
    await page.goto("/")
    const heroText = page.getByRole("heading", { level: 1 })
    await expect(heroText).toBeVisible()
  })
})
