import { requireAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { AuditDetails } from "@/components/audit-details"

export const metadata = {
  title: "Audit Details",
}

export default async function AuditDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAuth()

  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
    include: { site: true, page: true },
  })

  if (!audit || audit.userId !== user.id) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AuditDetails audit={audit} />
    </div>
  )
}
