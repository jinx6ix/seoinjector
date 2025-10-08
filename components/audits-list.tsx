import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { Audit, Site } from "@prisma/client"

interface AuditsListProps {
  audits: (Audit & { site: Site | null })[]
}

export function AuditsList({ audits }: AuditsListProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Recent Audits</h2>

      {audits.length === 0 ? (
        <p className="text-center text-muted-foreground">No audits yet. Scan a page to get started.</p>
      ) : (
        <div className="space-y-4">
          {audits.map((audit) => (
            <div key={audit.id} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{audit.site?.name || "Unknown Site"}</p>
                  <Badge variant={audit.score && audit.score >= 80 ? "default" : "secondary"}>
                    Score: {audit.score || "N/A"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{audit.url}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(audit.createdAt, { addSuffix: true })}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/audits/${audit.id}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
