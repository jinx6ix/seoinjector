import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import type { Audit, Site, Page } from "@prisma/client"

interface AuditDetailsProps {
  audit: Audit & { site: Site | null; page: Page | null }
}

export function AuditDetails({ audit }: AuditDetailsProps) {
  const issues = audit.issues as Array<{ type: string; message: string; priority: string }>
  const suggestions = audit.suggestions as Array<{ action: string; impact: string }>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Details</h1>
        <p className="text-muted-foreground">{audit.url}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Overall Score</p>
          <p className="mt-2 text-3xl font-bold">{audit.score || "N/A"}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Performance</p>
          <p className="mt-2 text-3xl font-bold">{audit.performanceScore || "N/A"}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">SEO</p>
          <p className="mt-2 text-3xl font-bold">{audit.seoScore || "N/A"}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Accessibility</p>
          <p className="mt-2 text-3xl font-bold">{audit.accessibilityScore || "N/A"}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Issues Found</h2>
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p>No issues found!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg border p-4">
                {issue.type === "error" ? (
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                ) : (
                  <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{issue.message}</p>
                    <Badge variant={issue.priority === "high" ? "destructive" : "secondary"}>{issue.priority}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Recommendations</h2>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg border p-4">
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">{suggestion.action}</p>
                <Badge variant="outline" className="mt-1">
                  {suggestion.impact} impact
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
