"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface SettingsFormProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user.name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email || ""} disabled />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">API Integrations</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serpapi">SerpApi Key</Label>
            <Input id="serpapi" type="password" placeholder="Enter your SerpApi key" />
            <p className="text-xs text-muted-foreground">Used for keyword research and SERP analysis</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="openai">OpenAI API Key</Label>
            <Input id="openai" type="password" placeholder="Enter your OpenAI API key" />
            <p className="text-xs text-muted-foreground">Used for AI content generation</p>
          </div>
          <Button>Save API Keys</Button>
        </div>
      </Card>
    </div>
  )
}
