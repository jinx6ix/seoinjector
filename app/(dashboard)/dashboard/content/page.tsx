import { requireAuth } from "@/lib/auth-utils"
import { ContentGenerator } from "@/components/content-generator"

export const metadata = {
  title: "Content Generator",
}

export default async function ContentPage() {
  await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Generator</h1>
        <p className="text-muted-foreground">Create SEO-optimized content with AI</p>
      </div>

      <ContentGenerator />
    </div>
  )
}
