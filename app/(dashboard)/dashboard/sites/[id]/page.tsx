import { requireAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { SiteDetails } from "@/components/site-details"

export const metadata = {
  title: "Site Details",
}

export default async function SiteDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAuth()

  const site = await prisma.site.findUnique({
    where: { id: params.id },
    include: {
      pages: {
        orderBy: { lastCrawled: "desc" },
        take: 10,
      },
      audits: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      keywords: {
        orderBy: { volume: "desc" },
        take: 10,
      },
    },
  })

  if (!site || site.userId !== user.id) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <SiteDetails site={site} />
    </div>
  )
}
