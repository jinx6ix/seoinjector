import { Card } from "@/components/ui/card"
import { Globe, FileText, TrendingUp, Search } from "lucide-react"

interface StatsCardsProps {
  totalSites: number
  totalPages: number
  avgScore: number
  totalKeywords: number
}

export function StatsCards({ totalSites, totalPages, avgScore, totalKeywords }: StatsCardsProps) {
  const stats = [
    { label: "Total Sites", value: totalSites, icon: Globe, color: "text-blue-500" },
    { label: "Pages Tracked", value: totalPages, icon: FileText, color: "text-green-500" },
    { label: "Avg SEO Score", value: avgScore, icon: TrendingUp, color: "text-orange-500" },
    { label: "Keywords", value: totalKeywords, icon: Search, color: "text-purple-500" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
              <Icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
