import { requireAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { AuditsList } from "@/components/audits-list"
import { PageScanner } from "@/components/page-scanner"

export const metadata = {
  title: "Page Audits",
}

export default async function AuditsPage() {
  const user = await requireAuth()

  const audits = await prisma.audit.findMany({
    where: { userId: user.id },
    include: { site: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Audits</h1>
        <p className="text-muted-foreground">Scan and optimize your pages for SEO</p>
      </div>

      <PageScanner />
      <AuditsList audits={audits} />
    </div>
  )
}
