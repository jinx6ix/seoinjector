"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import type { Site, Page, Audit, Keyword } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"

interface SiteDetailsProps {
  site: Site & {
    pages: Page[]
    audits: Audit[]
    keywords: Keyword[]
  }
}

interface Keyword {
  id: string;
  siteId: string;
  userId: string;
  keyword: string;
  volume: number | null;
  position?: number; // Add position as an optional property
}

export function SiteDetails({ site }: SiteDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{site.name}</h1>
            <Badge variant={site.status === "active" ? "default" : "secondary"}>{site.status}</Badge>
          </div>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            {site.domain}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/sites/${site.id}/settings`}>Settings</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pages Tracked</p>
          <p className="mt-2 text-3xl font-bold">{site.pages.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Audits</p>
          <p className="mt-2 text-3xl font-bold">{site.audits.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Keywords Tracked</p>
          <p className="mt-2 text-3xl font-bold">{site.keywords.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Integration</h2>
          <Badge variant="outline">{site.connector}</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <Label>API Key</Label>
            <div className="mt-1 flex gap-2">
              <Input value={site.apiKey || ""} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (site.apiKey) navigator.clipboard.writeText(site.apiKey)
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {site.connector === "script" && (
            <div>
              <Label>Script Tag</Label>
              <div className="mt-1 rounded-md bg-muted p-3">
                <code className="text-xs">
                  {`<script src="${process.env.NEXT_PUBLIC_APP_URL}/api/tracker.js" data-api-key="${site.apiKey}"></script>`}
                </code>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Pages</h2>
        {site.pages.length === 0 ? (
          <p className="text-center text-muted-foreground">No pages tracked yet</p>
        ) : (
          <div className="space-y-3">
            {site.pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{page.title || "Untitled"}</p>
                  <p className="text-sm text-muted-foreground">{page.url}</p>
                  {page.lastCrawled && (
                    <p className="text-xs text-muted-foreground">
                      Last crawled {formatDistanceToNow(page.lastCrawled, { addSuffix: true })}
                    </p>
                  )}
                </div>
                <Badge variant={page.status === 200 ? "default" : "destructive"}>{page.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Top Keywords</h2>
        {site.keywords.length === 0 ? (
          <p className="text-center text-muted-foreground">No keywords tracked yet</p>
        ) : (
          <div className="space-y-3">
            {site.keywords.map((keyword) => (
              <div key={keyword.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{keyword.keyword}</p>
                  <p className="text-sm text-muted-foreground">Volume: {keyword.volume?.toLocaleString() || "N/A"}</p>
                </div>
                {keyword.position && <Badge>#{keyword.position}</Badge>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium">{children}</p>
}

function Input({ value, readOnly, className }: { value: string; readOnly?: boolean; className?: string }) {
  return (
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  )
}
