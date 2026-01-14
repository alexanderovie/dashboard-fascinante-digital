import { Auth0Client } from "@auth0/nextjs-auth0/server"

const requireEnv = (name: string) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

const appBaseUrl =
  process.env.APP_BASE_URL ??
  process.env.AUTH0_BASE_URL ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000"

const domain = requireEnv("AUTH0_DOMAIN")
const secret = requireEnv("AUTH0_SECRET")
const clientId = requireEnv("AUTH0_CLIENT_ID")
const clientSecret = requireEnv("AUTH0_CLIENT_SECRET")

const routes = {
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  callback: "/api/auth/callback",
  backChannelLogout: "/api/auth/backchannel-logout",
  profile: "/api/auth/profile",
  accessToken: "/api/auth/access-token",
  connectAccount: "/api/auth/connect",
}

const authorizationParameters = {
  audience: requireEnv("AUTH0_AUDIENCE"),
}

let cachedClient: Auth0Client | undefined

export function getAuth0Client() {
  if (cachedClient) {
    return cachedClient
  }

  cachedClient = new Auth0Client({
    domain,
    clientId,
    clientSecret,
    secret,
    appBaseUrl,
    routes,
    authorizationParameters,
  })

  return cachedClient
}
