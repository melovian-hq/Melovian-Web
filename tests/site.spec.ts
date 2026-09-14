import { expect, test } from '@playwright/test'

test('landing renders hero and primary CTAs', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Melovian/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download Melovian' }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Try the live demo' }).first()).toBeVisible()
})

test('no horizontal overflow on a phone-width viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(scrollWidth).toBeLessThanOrEqual(375)
})

test('docker commands share one code box with one copy button', async ({ page }) => {
  await page.goto('/#platforms')
  const box = page.locator('#platforms').locator('div.bg-muted\\/60')
  await expect(box.getByText('docker pull ghcr.io')).toBeVisible()
  await expect(box.getByText('docker run -d -p 8080')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy docker commands' })).toBeVisible()
})

test('docs index links into a prerendered doc page', async ({ page }) => {
  await page.goto('/docs')
  await page.getByRole('link', { name: 'Web deployment (Docker)' }).first().click()
  await expect(page).toHaveURL(/\/docs\/docker/)
  await expect(page.locator('article h1')).toBeVisible()
  // On this page is visible at desktop width
  await expect(page.getByText('On this page')).toBeVisible()
})

test('inline code renders without literal backticks', async ({ page }) => {
  await page.goto('/docs/configuration')
  const code = page.locator('article code:not(pre code)').first()
  await expect(code).toBeVisible()
  const text = await code.textContent()
  expect(text).toBeTruthy()
  expect(text).not.toContain('`')
})

test('docs search opens with a shortcut and navigates to a result', async ({ page }) => {
  await page.goto('/docs')
  await page.getByRole('button', { name: 'Search documentation' }).first().click()
  const input = page.getByPlaceholder('Search documentation...')
  await expect(input).toBeFocused()
  await input.fill('docker')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/docs\//)
})

test('docs search opens with the slash key', async ({ page }) => {
  await page.goto('/docs')
  // The key handler binds during hydration; wait for it.
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('/')
  await expect(page.getByPlaceholder('Search documentation...')).toBeFocused()
})

test('mobile menu opens as an overlay and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const nav = page.locator('#mobile-nav')
  await expect(nav).toBeVisible()
  await nav.getByRole('link', { name: 'Docs' }).click()
  await expect(page).toHaveURL(/\/docs/)
})

test('changelog lists synced releases', async ({ page }) => {
  await page.goto('/changelog')
  await expect(page.getByRole('heading', { name: "What's new" })).toBeVisible()
  await expect(page.locator('ol li').first()).toBeVisible()
})

test('unknown routes render the custom 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByRole('heading', { name: 'This page is off the record' })).toBeVisible()
})

test('prerendered /404 page works without js navigation', async ({ page }) => {
  const res = await page.goto('/404.html')
  expect(res?.ok()).toBeTruthy()
  await expect(page.getByRole('heading', { name: 'This page is off the record' })).toBeVisible()
})
