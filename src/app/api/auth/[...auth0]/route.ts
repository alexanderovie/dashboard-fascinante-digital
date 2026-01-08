import type { NextRequest } from "next/server"
import { getAuth0Client } from "@/lib/auth/auth0-client"

const auth0 = getAuth0Client()

export async function GET(req: NextRequest) {
  return auth0.middleware(req)
}

export async function POST(req: NextRequest) {
  return auth0.middleware(req)
}

export async function PUT(req: NextRequest) {
  return auth0.middleware(req)
}

export async function DELETE(req: NextRequest) {
  return auth0.middleware(req)
}

