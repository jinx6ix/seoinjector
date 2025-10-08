import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import type { Audit, Site } from "@prisma/client"

interface RecentAuditsProps {
  audits: (Audit & { site: Site })[]
}

export function RecentAudits({ audits }: RecentAuditsProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Audits</h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/audits">View All</Link>
        </Button>
      </div>

      {audits.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No audits yet</p>
      ) : (
        <div className="space-y-4">
          {audits.map((audit) => (
            <div key={audit.id} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div className="flex-1">
                <p className="font-medium">{audit.site.name}</p>
                <p className="text-sm text-muted-foreground">{audit.url}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(audit.createdAt, { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{audit.score || "N/A"}</div>
                <p className="text-xs text-muted-foreground">SEO Score</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
