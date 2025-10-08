import { requireAuth } from "@/lib/auth-utils"
import { KeywordResearch } from "@/components/keyword-research"

export const metadata = {
  title: "Keyword Research",
}

export default async function KeywordsPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Research</h1>
        <p className="text-muted-foreground">Discover high-value keywords and track your rankings</p>
      </div>

      <KeywordResearch />
    </div>
  )
}
