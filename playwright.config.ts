import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from '@playwright/test'

// /tmp on this box has a user quota. Keep browser profiles in the project.
const tmp = path.resolve('.tmp')
mkdirSync(tmp, { recursive: true })
process.env.TMPDIR = tmp

const port = 4519

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    // Use the system chromium; skips the ~150MB playwright download.
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
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
