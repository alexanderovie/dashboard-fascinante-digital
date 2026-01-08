# Fascinante Digital

A premium Shadcn admin dashboard by shadcnblocks.com

## Getting Started

Install dependencies

```bash
pnpm install
```

Start the server

```bash
pnpm run dev
```

## Tech Stack

- shadcn/ui
- TailwindCSS v4
- Next.js
- React 19
- TypeScript
- Eslint v9
- Prettier

## Auth0 integration

1. Copy `env.example` to `.env.local` and fill in your Auth0 tenant (`AUTH0_DOMAIN`/`AUTH0_ISSUER_BASE_URL`), client credentials (`AUTH0_CLIENT_ID`/`AUTH0_CLIENT_SECRET`), a secure `AUTH0_SECRET`, and the audience `https://api.fascinantedigital.com`. Make sure `AUTH0_BASE_URL` and `APP_BASE_URL` match the domain where you host the dashboard (localhost during development).
2. The App Router exposes `/api/auth/[...auth0]` using the official SDK, so `login`/`logout`/`callback` flows use Universal Login automatically.
3. Start the app (`pnpm run dev`) and use the `/login` or `/register` routes: they now redirect straight to Auth0, so you never handle credentials in the frontend.
4. The dashboard layout resolves `/v1/me` after login, attaches the proper Bearer token to every backend request, and enforces 401/403 redirects.
