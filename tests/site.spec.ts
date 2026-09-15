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

test('store lists the big box edition as coming soon', async ({ page }) => {
  await page.goto('/store')
  await expect(page.getByRole('heading', { name: 'Melovian, in a box' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Big Box Physical Edition/ })).toBeVisible()
  await expect(page.getByText('Coming soon').first()).toBeVisible()
})

test('big box page opens the 3d lid', async ({ page }) => {
  await page.goto('/store/big-box-edition')
  const toggle = page.getByRole('button', { name: 'Open the box' })
  await expect(toggle).toBeVisible()
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Close the box' })).toBeVisible()
  await expect(page.locator('.open .lid')).toBeAttached()
  // Arrow keys orbit the model without a pointer.
  await page.locator('.stage').press('ArrowRight')
})

test('store rss feed is valid xml and announces the item', async ({ page }) => {
  const res = await page.goto('/store/rss.xml')
  expect(res?.ok()).toBeTruthy()
  expect(res?.headers()['content-type']).toContain('xml')
  const body = await res?.text()
  expect(body).toContain('<rss')
  expect(body).toContain('Big Box Physical Edition')
  expect(body).toContain('Coming soon')
})

test('extension detail page renders metadata and sections', async ({ page }) => {
  await page.goto('/extensions/genre-palette')
  await expect(page).toHaveTitle(/Genre palette/)
  await expect(page.getByRole('heading', { level: 1, name: 'Genre palette' })).toBeVisible()
  await expect(page.getByText('Security', { exact: true })).toBeVisible()
  await expect(page.getByText('Privacy', { exact: true })).toBeVisible()
  await expect(page.getByText('Version history', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /Install in Melovian/ })).toBeVisible()
})

test('author page lists extensions and is linked from detail page', async ({ page }) => {
  await page.goto('/extensions/genre-palette')
  await page.getByRole('link', { name: 'by Melovian' }).click()
  await expect(page).toHaveURL(/\/extensions\/author\/melovian/)
  await expect(page.getByRole('heading', { name: 'Melovian', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Genre palette' })).toBeVisible()
})

test('unknown author slug returns 404', async ({ page }) => {
  const response = await page.goto('/extensions/author/nobody-here')
  expect(response?.status()).toBe(404)
})

test('tag badge on detail page filters the gallery', async ({ page }) => {
  await page.goto('/extensions/genre-palette')
  await page.getByRole('link', { name: '#genre' }).click()
  await expect(page).toHaveURL(/\/extensions\?tag=genre/)
  await expect(page.getByRole('link', { name: 'Genre palette' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Neon arcade' })).toBeHidden()
})

test('gallery search fuzzy-matches name and tags', async ({ page }) => {
  await page.goto('/extensions')
  const input = page.getByPlaceholder('Search extensions')
  // Misspelled substring still lands on the card via subsequence match.
  await input.fill('neon')
  await expect(page.getByRole('link', { name: 'Neon arcade' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Genre palette' })).toBeHidden()
  await input.fill('podcast')
  await expect(page.getByRole('link', { name: 'Podcast progress style' })).toBeVisible()
})

test('unknown extension id returns 404', async ({ page }) => {
  const response = await page.goto('/extensions/does-not-exist')
  expect(response?.status()).toBe(404)
})

test('registry RSS feed is well-formed', async ({ request }) => {
  const response = await request.get('/extensions/rss.xml')
  expect(response.ok()).toBe(true)
  const body = await response.text()
  expect(body).toContain('<rss version="2.0">')
  expect(body).toContain('<item>')
})

test('per-extension RSS feed is well-formed', async ({ request }) => {
  const response = await request.get('/extensions/genre-palette/rss.xml')
  expect(response.ok()).toBe(true)
  const body = await response.text()
  expect(body).toContain('<rss version="2.0">')
  expect(body).toContain('genre-palette-')
})
