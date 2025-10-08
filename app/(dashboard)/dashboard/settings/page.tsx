import { requireAuth } from "@/lib/auth-utils"
import { SettingsForm } from "@/components/settings-form"

export const metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const user = await requireAuth()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and API integrations</p>
      </div>

      <SettingsForm user={user} />
    </div>
  )
}
