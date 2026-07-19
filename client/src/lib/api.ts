const BASE_URL = '/api/v1'

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: { message: string; code: string }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 204) return undefined as T

  const body: ApiResponse<T> = await res.json()

  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || 'Something went wrong')
  }

  return body.data as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
