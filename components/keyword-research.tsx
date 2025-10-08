"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"

interface KeywordData {
  keyword: string
  volume: number
  difficulty: number
  cpc: number
  competition: string
  serpFeatures: string[]
}

export function KeywordResearch() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<KeywordData[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/keywords?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch keywords")
      }

      setResults(data.keywords || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Enter a keyword or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </form>
      </Card>

      {error && (
        <Card className="border-destructive p-6">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {results.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Keyword Results</h2>
          <div className="space-y-4">
            {results.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{keyword.keyword}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {keyword.serpFeatures?.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">{keyword.volume.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Volume</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{keyword.difficulty}/100</p>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${keyword.cpc.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">CPC</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={keyword.competition === "high" ? "destructive" : "secondary"}>
                      {keyword.competition}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
