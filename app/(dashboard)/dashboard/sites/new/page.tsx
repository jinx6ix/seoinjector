import { requireAuth } from "@/lib/auth-utils"
import { AddSiteForm } from "@/components/add-site-form"

export const metadata = {
  title: "Add Site",
}

export default async function NewSitePage() {
  await requireAuth()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add a New Site</h1>
        <p className="text-muted-foreground">Connect your website to start optimizing</p>
      </div>

      <AddSiteForm />
    </div>
  )
}
