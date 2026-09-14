import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from '@playwright/test'

// /tmp on this box has a user quota. Keep browser profiles in the project.
const tmp = path.resolve('.tmp')
mkdirSync(tmp, { recursive: true })
process.env.TMPDIR = tmp

const port = 4519
// Prefer a system chromium when present to skip the bundled download.
// In CI the file is absent and Playwright uses its installed browser.
const systemChromium = process.env.CHROMIUM_PATH || '/usr/bin/chromium'
const executablePath = existsSync(systemChromium) ? systemChromium : undefined

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    launchOptions: {
      executablePath,
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command: `pnpm exec vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    // Never reuse: a stale server on the port would serve the wrong app.
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
