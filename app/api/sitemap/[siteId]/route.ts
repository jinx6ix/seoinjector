import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSitemap } from "@/lib/sitemap";

export async function GET(req: Request, { params }: { params: Promise<{ siteId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params; // Resolve the params Promise
    const sitemap = await generateSitemap(resolvedParams.siteId);

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[SITEMAP_ERROR]", error);
    return new NextResponse("Failed to generate sitemap", { status: 500 });
  }
}