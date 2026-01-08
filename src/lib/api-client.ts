import { getAccessToken } from "@auth0/nextjs-auth0"

type ApiClientOptions = RequestInit & {
  audience?: string
  organizationId?: string
  baseUrl?: string
}

export class ApiClientError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiClientError"
  }
}

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "https://api.fascinantedigital.com"

export async function authenticatedFetch<T = unknown>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const audience =
    options.audience ?? process.env.AUTH0_AUDIENCE ?? "https://api.fascinantedigital.com"

  const accessToken = await getAccessToken({ audience })
  if (!accessToken) {
    throw new ApiClientError("No access token available", 401)
  }

  const baseUrl = options.baseUrl ?? DEFAULT_API_URL
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`
  const headers = new Headers(options.headers ?? {})
  headers.set("Authorization", `Bearer ${accessToken}`)

  if (options.organizationId) {
    headers.set("X-Organization-Id", options.organizationId)
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  })

  const payload = await response.text()
  if (!response.ok) {
    throw new ApiClientError(payload || response.statusText, response.status)
  }

  if (!payload) {
    return undefined as T
  }

  try {
    return JSON.parse(payload) as T
  } catch {
    return payload as T
  }
}

