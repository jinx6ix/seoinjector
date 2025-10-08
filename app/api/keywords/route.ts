import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import { searchKeywords } from "@/lib/keywords"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const { success } = await rateLimit(`keywords:${session.user.id}`, 20, 60)
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    const keywords = await searchKeywords(query)

    return NextResponse.json({ keywords })
  } catch (error) {
    console.error("[KEYWORDS_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch keywords" }, { status: 500 })
  }
}
