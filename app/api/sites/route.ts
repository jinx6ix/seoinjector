import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const createSiteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  connector: z.enum(["script", "wordpress", "oauth"]).optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sites = await prisma.site.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { pages: true, audits: true, keywords: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ sites })
  } catch (error) {
    console.error("[SITES_GET_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, url, connector } = createSiteSchema.parse(body)

    const domain = new URL(url).hostname

    const site = await prisma.site.create({
      data: {
        userId: session.user.id,
        name,
        url,
        domain,
        connector: connector || "script",
        apiKey: Math.random().toString(36).substring(2, 15),
      },
    })

    return NextResponse.json({ site }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("[SITES_POST_ERROR]", error)
    return NextResponse.json({ error: "Failed to create site" }, { status: 500 })
  }
}
