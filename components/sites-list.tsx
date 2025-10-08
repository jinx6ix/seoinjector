import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import type { Site } from "@prisma/client"

interface SitesListProps {
  sites: (Site & { _count: { pages: number; audits: number } })[]
}

export function SitesList({ sites }: SitesListProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Sites</h2>
        <Button asChild size="sm">
          <Link href="/dashboard/sites/new">Add Site</Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No sites connected yet</p>
          <Button asChild>
            <Link href="/dashboard/sites/new">Connect Your First Site</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => (
            <div key={site.id} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{site.name}</h3>
                  <Badge variant={site.status === "active" ? "default" : "secondary"}>{site.status}</Badge>
                </div>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {site.domain}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                  <span>{site._count.pages} pages</span>
                  <span>{site._count.audits} audits</span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/sites/${site.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
