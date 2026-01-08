import { Auth0Client } from "@auth0/nextjs-auth0/server"

const getDomainFromIssuer = (issuer?: string) => {
  if (!issuer) {
    return process.env.AUTH0_DOMAIN
  }

  try {
    const url = new URL(issuer)
    return url.hostname
  } catch {
    return issuer
  }
}

const appBaseUrl =
  process.env.APP_BASE_URL ??
  process.env.AUTH0_BASE_URL ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000"

const domain = process.env.AUTH0_DOMAIN ?? getDomainFromIssuer(process.env.AUTH0_ISSUER_BASE_URL)
const secret = process.env.AUTH0_SECRET
const clientId = process.env.AUTH0_CLIENT_ID
const clientSecret = process.env.AUTH0_CLIENT_SECRET

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
  audience: process.env.AUTH0_AUDIENCE ?? "https://api.fascinantedigital.com",
}

let cachedClient: Auth0Client | undefined

export function getAuth0Client() {
  if (cachedClient) {
    return cachedClient
  }

  cachedClient = new Auth0Client({
    domain: domain ?? "",
    clientId: clientId ?? "",
    clientSecret,
    secret: secret ?? "",
    appBaseUrl,
    routes,
    authorizationParameters,
  })

  return cachedClient
}
