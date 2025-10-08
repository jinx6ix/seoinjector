"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert } from "@/components/ui/alert"
import { Code, Loader2 } from "lucide-react"

export function AddSiteForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [connector, setConnector] = useState<"script" | "wordpress" | "oauth">("script")
  const [isLoading, setIsLoading] = useState(false)
  const [_error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, connector }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add site")
      }

      setApiKey(data.site.apiKey)

      // Redirect after showing API key
      setTimeout(() => {
        router.push(`/dashboard/sites/${data.site.id}`)
        router.refresh()
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (apiKey) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Alert>
            <h3 className="font-semibold">Site Added Successfully!</h3>
            <p className="mt-2 text-sm">Follow the instructions below to complete the integration.</p>
          </Alert>

          <div className="space-y-2">
            <Label>Your API Key</Label>
            <div className="flex gap-2">
              <Input value={apiKey} readOnly />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey)
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Save this key securely. You&apos;ll need it for integration.</p>
          </div>

          {connector === "script" && (
            <div className="space-y-2">
              <Label>Installation Script</Label>
              <div className="rounded-md bg-muted p-4">
                <code className="text-sm">
                  {`<script src="${process.env.NEXT_PUBLIC_APP_URL}/api/tracker.js" data-api-key="${apiKey}"></script>`}
                </code>
              </div>
              <p className="text-sm text-muted-foreground">
                Add this script tag to your website&apos;s {"<head>"} section to enable automatic tracking.
              </p>
            </div>
          )}

          {connector === "wordpress" && (
            <div className="space-y-2">
              <Label>WordPress Plugin Setup</Label>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                <li>Download the SEO Platform WordPress plugin</li>
                <li>Upload and activate it in your WordPress admin</li>
                <li>Go to Settings → SEO Platform</li>
                <li>Enter your API key: {apiKey}</li>
                <li>Save settings</li>
              </ol>
            </div>
          )}

          <p className="text-sm text-muted-foreground">Redirecting to site details...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name</Label>
          <Input
            id="name"
            placeholder="My Awesome Website"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label>Connection Method</Label>
          <Tabs value={connector} onValueChange={(v) => setConnector(v as typeof connector)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="script">Script Tag</TabsTrigger>
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="oauth">OAuth</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-medium">Script Tag Integration</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add a simple script tag to your website&apos;s HTML. Works with any platform or CMS.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wordpress" className="space-y-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-medium">WordPress Plugin</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Install our WordPress plugin for seamless integration and one-click fixes.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="oauth" className="space-y-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-medium">OAuth Connection</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Connect via OAuth for supported platforms (coming soon).
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {_error && <Alert variant="destructive">{_error}</Alert>}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Site...
            </>
          ) : (
            "Add Site"
          )}
        </Button>
      </form>
    </Card>
  )
}