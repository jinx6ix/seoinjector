import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Keyword, Site } from "@prisma/client"

interface TopKeywordsProps {
  keywords: (Keyword & { site: Site })[]
}

export function TopKeywords({ keywords }: TopKeywordsProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Top Keywords</h2>

      {keywords.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No keywords tracked yet</p>
      ) : (
        <div className="space-y-3">
          {keywords.map((keyword) => (
            <div key={keyword.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="flex-1">
                <p className="font-medium">{keyword.keyword}</p>
                <p className="text-xs text-muted-foreground">{keyword.site.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{keyword.volume?.toLocaleString() || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Volume</p>
                </div>
                {keyword.position && (
                  <Badge variant={keyword.position <= 10 ? "default" : "secondary"}>#{keyword.position}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
