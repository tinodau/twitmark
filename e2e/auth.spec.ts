import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
    await page.goto("/dashboard")

    // Should redirect to login page
    await expect(page).toHaveURL("/login")
  })

  test("should show Google OAuth button on login page", async ({ page }) => {
    await page.goto("/login")

    // Check for Google sign-in button/link
    const googleButton = page.getByRole("button", { name: /sign in with google/i })
    await expect(googleButton).toBeVisible()
  })

  test("should have proper accessibility on login page", async ({ page }) => {
    await page.goto("/login")

    // Test keyboard navigation
    await page.keyboard.press("Tab")
    const focusedElement = await page.evaluate(() => document.activeElement?.textContent)
    expect(focusedElement).toBeTruthy()

    // Check for proper heading hierarchy
    const h1 = page.locator("h1")
    await expect(h1).toBeVisible()
  })
})
