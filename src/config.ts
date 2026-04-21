export const APP_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  apiKey: import.meta.env.VITE_API_KEY ?? '',
  zaloUrl: import.meta.env.VITE_ZALO_URL ?? '',
  uidStorageKey: 'shareapp_uid',
}

export const POLL_INTERVAL_MS = 60000
