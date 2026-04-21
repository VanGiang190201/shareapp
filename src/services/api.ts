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
): Promise<{success: boolean, url: string}> {
  ensureApiConfig()

  const res =  await request<{success: boolean, url: string}>(createUrl({ action: 'upload' }), {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      key: APP_CONFIG.apiKey,
      requestId,
      image: imageBase64,
      type,
    }),
  })

  return res;
}

export async function fetchHistory(uid: string): Promise<HistoryRecord[]> {
  ensureApiConfig()

  const response = await request<HistoryRecord[]>(
    createUrl({ action: 'list', uid, key: APP_CONFIG.apiKey }),
    {
      method: 'GET',
    },
  )

  return response ?? []
}
