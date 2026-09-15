/*
 * Single source of truth for site content and links. Section components
 * read from here so copy changes never touch markup. The canonical
 * origin ships as PUBLIC_SITE_URL (see .env) and surfaces in app.html
 * through %sveltekit.env.PUBLIC_SITE_URL% tokens; SITE_URL mirrors it
 * for in-app use.
 */

export const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? 'https://melovian.example.com'

export const SITE = {
  name: 'Melovian',
  tagline: 'Your music library, one app',
  description:
    'Melovian is a free, open source music player for Navidrome and Subsonic-compatible servers, plus local folders. One app for desktop, mobile, and web.',
  url: SITE_URL,
  ogImage: `${SITE_URL}/og.png`,
  license: 'Apache-2.0',
} as const

export const LINKS = {
  github: 'https://github.com/melovian-hq/Melovian',
  releases: 'https://github.com/melovian-hq/Melovian/releases',
  releasesAtom: 'https://github.com/melovian-hq/Melovian/releases.atom',
  issues: 'https://github.com/melovian-hq/Melovian/issues',
  // Static frontend demo published to GitHub Pages by the repo's
  // pages.yml workflow. Read-only, backed by a built-in fake catalog.
  demo: 'https://melovian-hq.github.io/Melovian/',
  docsSource: 'https://github.com/melovian-hq/Melovian/tree/main/docs/en',
  gettingStarted: 'https://github.com/melovian-hq/Melovian/blob/main/docs/en/getting-started.md',
  license: 'https://github.com/melovian-hq/Melovian/blob/main/LICENSE',
  docker: 'https://github.com/melovian-hq/Melovian/blob/main/docs/en/docker.md',
  // Community extension registry. The gallery at /extensions renders a
  // synced copy of its registry.json, and the app fetches the published
  // index for remote installs.
  extensionsRepo: 'https://github.com/melovian-hq/Melovian-Extensions',
  extensionsRegistry: 'https://melovian-hq.github.io/Melovian-Extensions/',
  navidrome: 'https://www.navidrome.org',
  subsonic: 'http://www.subsonic.org',
  selfhstIcons: 'https://selfh.st/icons',
} as const

export const NAV_ITEMS = [
  { label: 'Features', href: '/#features' },
  { label: 'Screenshots', href: '/#screenshots' },
  { label: 'Platforms', href: '/#platforms' },
  { label: 'Extensions', href: '/extensions' },
  { label: 'Store', href: '/store' },
  { label: 'Docs', href: '/docs' },
  { label: 'FAQ', href: '/#faq' },
] as const

export type Feature = {
  icon: string
  title: string
  description: string
}

export const FEATURES: Feature[] = [
  {
    icon: 'server',
    title: 'Every Subsonic server',
    description:
      'Connect Navidrome or any Subsonic-compatible server. Save several and switch between them.',
  },
  {
    icon: 'folder',
    title: 'Local folders too',
    description:
      'Point it at music folders on your computer and browse them next to your server libraries in one view.',
  },
  {
    icon: 'sparkles',
    title: 'Mixes built from your taste',
    description:
      'Personalized mixes and a personal radio mode generated from your play history and starred tracks.',
  },
  {
    icon: 'mic',
    title: 'Lyrics, your way',
    description:
      'Lyrics from configurable providers, or generate synced lyrics from the audio itself with the Lyrics Whisper extension.',
  },
  {
    icon: 'tag',
    title: 'Metadata editor',
    description:
      'Fix tags and artwork with matches from iTunes, MusicBrainz, Deezer, and TheAudioDB.',
  },
  {
    icon: 'download',
    title: 'Offline cache',
    description: 'Download tracks for offline listening. The player shows which tracks are local.',
  },
  {
    icon: 'command',
    title: 'Command palette',
    description: 'Press Ctrl+K (or Cmd+K) and jump anywhere. Press ? for the full shortcut list.',
  },
  {
    icon: 'audio-lines',
    title: 'Real audio control',
    description:
      'Gapless playback, crossfade, and on-the-fly transcoding to keep streams small on slow connections.',
  },
  {
    icon: 'speaker',
    title: 'Serve your library',
    description:
      'Melovian can share your local library over the Subsonic API and DLNA so other apps and devices can play it too.',
  },
  {
    icon: 'monitor-smartphone',
    title: 'Play on any device',
    description:
      'See every Melovian device signed in to your server. Move playback to another one, or control it without picking it up.',
  },
  {
    icon: 'users-round',
    title: 'Listen together',
    description:
      'Host a listening session and your other devices follow the same queue. Invite people on your server and it becomes a party.',
  },
  {
    icon: 'history',
    title: 'Scrobbling',
    description:
      'Send your plays to Last.fm, ListenBrainz, and Rocksky so your listening history stays accurate.',
  },
]

export type Screenshot = {
  id: string
  label: string
  src: string
  alt: string
  device: 'desktop' | 'mobile'
}

// WebP files are generated from assets-src/screenshots/*.png by
// scripts/optimize-images.mjs (runs on dev/build/install).
export const SCREENSHOTS: Screenshot[] = [
  {
    id: 'desktop-dark',
    label: 'Desktop',
    src: '/screenshots/desktop-dark-home.webp',
    alt: 'Melovian home screen on desktop, dark theme',
    device: 'desktop',
  },
  {
    id: 'desktop-light',
    label: 'Desktop, light',
    src: '/screenshots/desktop-light-home.webp',
    alt: 'Melovian home screen on desktop, light theme',
    device: 'desktop',
  },
  {
    id: 'album',
    label: 'Album view',
    src: '/screenshots/desktop-dark-album.webp',
    alt: 'Melovian album page on desktop, dark theme',
    device: 'desktop',
  },
  {
    id: 'playlists',
    label: 'Playlists',
    src: '/screenshots/desktop-dark-playlists.webp',
    alt: 'Melovian playlists page on desktop, dark theme',
    device: 'desktop',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    src: '/screenshots/mobile-dark-home.webp',
    alt: 'Melovian home screen on a phone, dark theme',
    device: 'mobile',
  },
]

export type Platform = {
  icon: string
  name: string
  detail: string
  formats: string[]
}

export const PLATFORMS: Platform[] = [
  {
    icon: 'terminal',
    name: 'Linux',
    detail: 'Keyboard media keys and a system tray icon. The AppImage ships its own audio engine.',
    formats: ['AppImage', 'Tarball', 'Distro packages'],
  },
  {
    icon: 'monitor',
    name: 'Windows',
    detail: 'Desktop app with the same library and player features.',
    formats: ['ZIP download'],
  },
  {
    icon: 'laptop',
    name: 'macOS',
    detail: 'One download runs on Apple silicon and Intel Macs.',
    formats: ['DMG download'],
  },
  {
    icon: 'smartphone',
    name: 'Android',
    detail: 'Lock-screen controls and Android Auto browsing.',
    formats: ['Install file (APK)'],
  },
  {
    icon: 'tablet-smartphone',
    name: 'iOS',
    detail:
      'Shows up on the CarPlay Now Playing screen. You install the app yourself with your Apple ID.',
    formats: ['Install file (IPA)'],
  },
  {
    icon: 'container',
    name: 'Web (Docker)',
    detail:
      'Runs on your own server and opens in any browser. Separate logins per person, optional single sign-on, metrics included.',
    formats: ['Docker image'],
  },
]

export const DOCKER_COMMANDS = [
  'docker pull ghcr.io/melovian-hq/melovian:latest',
  'docker run -d -p 8080:8080 -v melovian-data:/data ghcr.io/melovian-hq/melovian:latest',
] as const

export type Faq = {
  question: string
  answer: string
}

export const FAQS: Faq[] = [
  {
    question: 'What do I need to use Melovian?',
    answer:
      'Either a music server like Navidrome, or a folder of music files on your computer. You can use both at once and switch between them.',
  },
  {
    question: 'Is Melovian free?',
    answer:
      'Yes. Melovian is free and open source under the Apache-2.0 license. No accounts, no subscriptions, no tracking.',
  },
  {
    question: 'Which servers does it work with?',
    answer:
      'Navidrome is the most common, and anything else that speaks the Subsonic API works too: Gonic, Airsonic-Advanced, LMS with the Subsonic plugin, and more. Melovian can also share your local library to other Subsonic apps.',
  },
  {
    question: 'Can I run it in a browser instead of installing an app?',
    answer:
      'Yes. The Docker image runs on your own server and serves the same interface in any browser, with separate logins per person.',
  },
  {
    question: 'Is it stable?',
    answer:
      'Melovian is alpha software under active development. Day-to-day playback is reliable, but expect rough edges and skim the changelog before upgrading.',
  },
]

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE.name,
  description: SITE.description,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Linux, Windows, macOS, Android, iOS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  license: `https://www.apache.org/licenses/LICENSE-2.0`,
  url: SITE.url,
  downloadUrl: LINKS.releases,
  codeRepository: LINKS.github,
} as const
