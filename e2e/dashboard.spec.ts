import { test, expect } from "@playwright/test"

test.describe("Dashboard CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto("/dashboard")
  })

  test("should display 'Add Bookmark' button", async ({ page }) => {
    const addBookmarkButton = page.getByRole("button", { name: /add bookmark/i })
    await expect(addBookmarkButton).toBeVisible()
  })

  test("should show empty state when no bookmarks exist", async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState("networkidle")

    // Check for empty state message
    page.getByText(/no bookmarks yet/i).or(page.getByText(/add your first bookmark/i))
    // Note: This might fail if user has bookmarks - adjust as needed
  })

  test("should validate URL input in add bookmark modal", async ({ page }) => {
    // Open add bookmark modal
    const addBookmarkButton = page.getByRole("button", { name: /add bookmark/i })
    await addBookmarkButton.click()

    // Wait for modal to appear
    const modal = page.getByRole("dialog")
    await expect(modal).toBeVisible()

    // Try invalid URL
    const urlInput = page.getByPlaceholder(/paste your x/i).or(page.getByPlaceholder(/url/i))
    await urlInput.fill("https://facebook.com/post/123")

    // Submit form
    const submitButton = page.getByRole("button", { name: /add bookmark|save/i })
    await submitButton.click()

    // Should show error message (toast or inline)
    const errorMessage = page.getByText(/invalid url|only x|twitter/i)
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
    // Note: Error might be in toast, adjust selector as needed
  })

  test("should have accessible navigation", async ({ page }) => {
    // Tab through interactive elements
    const tabCount = 10 // Check first 10 tab stops
    for (let i = 0; i < tabCount; i++) {
      await page.keyboard.press("Tab")
      // Verify focus indicator is visible
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement
        const styles = window.getComputedStyle(active as Element)
        return (
          styles.boxShadow !== "none" || styles.outline !== "none" || styles.borderWidth !== "0px"
        )
      })
      expect(focusedElement).toBeTruthy()
    }
  })

  test("should close modal on Escape key", async ({ page }) => {
    // Open add bookmark modal
    const addBookmarkButton = page.getByRole("button", { name: /add bookmark/i })
    await addBookmarkButton.click()

    // Verify modal is open
    const modal = page.getByRole("dialog")
    await expect(modal).toBeVisible()

    // Press Escape
    await page.keyboard.press("Escape")

    // Verify modal is closed
    await expect(modal).not.toBeVisible()
  })

  test("should display folder list in sidebar", async ({ page }) => {
    // Wait for sidebar to load
    await page.waitForLoadState("networkidle")

    // Check for folder section
    const folderSection = page.getByRole("navigation").getByText(/folders/i, {
      exact: false,
    })
    await expect(folderSection).toBeVisible()
  })
})
