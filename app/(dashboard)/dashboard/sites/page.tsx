import { requireAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { SitesList } from "@/components/sites-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Sites",
}

export default async function SitesPage() {
  const user = await requireAuth()

  const sites = await prisma.site.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { pages: true, audits: true, keywords: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Sites</h1>
          <p className="text-muted-foreground">Manage and monitor your connected websites</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sites/new">Add Site</Link>
        </Button>
      </div>

      <SitesList sites={sites} />
    </div>
  )
}
