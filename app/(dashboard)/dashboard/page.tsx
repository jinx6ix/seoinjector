import { requireAuth } from "@/lib/auth-utils"
import { prisma } from "../../../lib/db"
import { StatsCards } from "@/components/stats-cards"
import { RecentAudits } from "@/components/recent-audits"
import { TopKeywords } from "@/components/top-keywords"
import { SitesList } from "@/components/sites-list"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await requireAuth()

  const [sites, audits, keywords] = await Promise.all([
    prisma.site.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { pages: true, audits: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.audit.findMany({
      where: { userId: user.id },
      include: { site: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.keyword.findMany({
      where: { userId: user.id },
      include: { site: true },
      orderBy: { volume: "desc" },
      take: 10,
    }),
  ])

  const totalSites = sites.length
  const totalPages = sites.reduce((acc, site) => acc + site._count.pages, 0)
  const avgScore =
    audits.length > 0 ? Math.round(audits.reduce((acc, a) => acc + (a.score || 0), 0) / audits.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <StatsCards totalSites={totalSites} totalPages={totalPages} avgScore={avgScore} totalKeywords={keywords.length} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentAudits audits={audits} />
        <TopKeywords keywords={keywords} />
      </div>

      <SitesList sites={sites} />
    </div>
  )
}
