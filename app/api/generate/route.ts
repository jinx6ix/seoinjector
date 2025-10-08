import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"
import { generateContent } from "@/lib/content-generator"

const generateSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  contentType: z.enum(["article", "meta", "outline"]),
  tone: z.enum(["professional", "casual", "technical"]).optional(),
  wordCount: z.number().min(300).max(5000).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const { success } = await rateLimit(`generate:${session.user.id}`, 5, 60)
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await req.json()
    const request = generateSchema.parse(body)

    const content = await generateContent(request)

    return NextResponse.json({ content })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("[GENERATE_ERROR]", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
