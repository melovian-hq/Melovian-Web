import { PersistedState } from 'runed'
import { MediaQuery } from 'svelte/reactivity'

export type ThemeMode = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'melovian-theme'

const prefersDark = new MediaQuery('(prefers-color-scheme: dark)')
const stored = new PersistedState<ThemeMode>(THEME_STORAGE_KEY, 'system', {
  storage: 'local',
  syncTabs: true,
})

export const theme = {
  get mode(): ThemeMode {
    return stored.current
  },
  set mode(value: ThemeMode) {
    stored.current = value
  },
  get resolved(): 'light' | 'dark' {
    return stored.current === 'system' ? (prefersDark.current ? 'dark' : 'light') : stored.current
  },
  toggle() {
    stored.current = this.resolved === 'dark' ? 'light' : 'dark'
  },
}
