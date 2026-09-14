// Loads .env so the sync scripts honor the same file Vite reads.
// Existing environment variables always win; a missing file is fine.
try {
  process.loadEnvFile(new URL('../../.env', import.meta.url))
} catch {
  // No .env file, rely on the ambient environment.
}
