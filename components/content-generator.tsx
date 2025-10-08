"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles } from "lucide-react"

type ContentType = "meta" | "outline" | "article"

export function ContentGenerator() {
  const [keyword, setKeyword] = useState("")
  const [contentType, setContentType] = useState<ContentType>("meta")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!keyword.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          contentType,
          tone: "professional",
          wordCount: 1000,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      setResult(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">Target Keyword</Label>
            <Input
              id="keyword"
              placeholder="e.g., automated seo manager"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Content Type</Label>
            <Tabs value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                <TabsTrigger value="outline">Outline</TabsTrigger>
                <TabsTrigger value="article">Full Article</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="border-destructive p-6">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Generated Content</h2>

          {contentType === "meta" && (
            <div className="space-y-4">
              <div>
                <Label>Meta Title</Label>
                <div className="mt-1 rounded-md bg-muted p-3">
                  <p className="font-medium">{result.metaTitle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{result.metaTitle?.length || 0} characters</p>
                </div>
              </div>
              <div>
                <Label>Meta Description</Label>
                <div className="mt-1 rounded-md bg-muted p-3">
                  <p>{result.metaDescription}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{result.metaDescription?.length || 0} characters</p>
                </div>
              </div>
              <div>
                <Label>H1 Heading</Label>
                <div className="mt-1 rounded-md bg-muted p-3">
                  <p className="text-lg font-bold">{result.h1}</p>
                </div>
              </div>
            </div>
          )}

          {contentType === "outline" && (
            <div className="space-y-2">
              <div className="mb-4 rounded-md bg-muted p-3">
                <h3 className="text-xl font-bold">{result.h1}</h3>
              </div>
              <ul className="space-y-2">
                {result.outline?.map((item: string, index: number) => (
                  <li key={index} className="rounded-md bg-muted p-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentType === "article" && (
            <div className="prose max-w-none">
              <h1>{result.h1}</h1>
              <div dangerouslySetInnerHTML={{ __html: result.content }} />
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
