import { prisma } from "@/lib/db"

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

export async function generateSitemap(siteId: string): Promise<string> {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: {
      pages: {
        where: {
          status: 200,
        },
        orderBy: {
          lastCrawled: "desc",
        },
      },
    },
  })

  if (!site) {
    throw new Error("Site not found")
  }

  const urls: SitemapUrl[] = site.pages.map((page) => ({
    loc: page.url,
    lastmod: page.lastCrawled?.toISOString().split("T")[0],
    changefreq: "weekly",
    priority: page.url === site.url ? 1.0 : 0.8,
  }))

  return generateSitemapXML(urls)
}

export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`,
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return c
    }
  })
}

export function generateRobotsTxt(sitemapUrl: string): string {
  return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`
}
