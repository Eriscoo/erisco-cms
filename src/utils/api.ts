import { ENV } from '../constants/env'

export interface ApiError extends Error {
  status: number
  retryAfterSeconds?: number
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${ENV.API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(body?.error || res.statusText) as ApiError
    err.status = res.status
    if (res.status === 429 && typeof body?.retry_after_seconds === 'number') {
      err.retryAfterSeconds = body.retry_after_seconds
    }
    throw err
  }

  if (body && typeof body === 'object' && 'error' in body) {
    const err = new Error(String(body.error)) as Error & { status: number }
    err.status = 404
    throw err
  }

  return body
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data: unknown, init?: RequestInit) =>
    request<T>(path, { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data), ...init }),
  put: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
