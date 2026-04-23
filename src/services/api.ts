import { APP_CONFIG } from '../config'
import type { HistoryRecord, SubmitPayload } from '../types'

function ensureApiConfig() {
  if (!APP_CONFIG.apiBaseUrl || !APP_CONFIG.apiKey) {
    throw new Error('Missing API configuration. Set VITE_API_BASE_URL and VITE_API_KEY.')
  }
}

function createUrl(query?: Record<string, string>) {
  const url = new URL(APP_CONFIG.apiBaseUrl)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return url.toString()
}

function formatDateForApi(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Request failed')
  }

  return (await response.json()) as T
}

export async function submitShopeeLink(uid: string, link: string): Promise<void> {
  ensureApiConfig()

  const payload: SubmitPayload = {
    uid,
    link,
    key: APP_CONFIG.apiKey,
  }

  await request(createUrl({ action: "submit" }), {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(payload),
  })
}

export async function uploadHistoryImage(
  requestId: string,
  imageBase64: string,
  type: 'image' | 'success',
  date: string,
): Promise<{success: boolean, url: string}> {
  ensureApiConfig()
  const formattedDate = formatDateForApi(date)

  const res =  await request<{success: boolean, url: string}>(createUrl({ action: 'upload' }), {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      key: APP_CONFIG.apiKey,
      requestId,
      image: imageBase64,
      type,
      date: formattedDate,
    }),
  })

  return res;
}

export async function fetchHistory(uid: string, date: string): Promise<HistoryRecord[]> {
  ensureApiConfig()
  const formattedDate = formatDateForApi(date)

  const response = await request<HistoryRecord[]>(
    createUrl({ action: 'list', uid, key: APP_CONFIG.apiKey, date: formattedDate }),
    {
      method: 'GET',
    },
  )

  return response ?? []
}
