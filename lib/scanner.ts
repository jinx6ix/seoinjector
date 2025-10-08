import * as cheerio from "cheerio"
import axios from "axios"

const serpApiKey = process.env.SERPAPI_KEY || ""

export interface ScanResult {
  url: string
  title?: string
  metaDescription?: string
  h1?: string
  h2s: string[]
  images: Array<{ src: string; alt?: string }>
  wordCount: number
  status: number
  issues: Array<{ type: string; message: string; priority: string }>
  suggestions: Array<{ action: string; impact: string }>
}

export async function scanPage(url: string): Promise<ScanResult> {
  let html = ""
  let status = 200

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    html = response.data
    status = response.status
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        console.warn(`[SCAN_RETRY] 429 detected, retrying after 2000ms...`)
        await new Promise((r) => setTimeout(r, 2000))
        return await scanPage(url)
      }

      if (error.response?.status === 403 && serpApiKey) {
        console.warn(`[SCAN_FALLBACK] 403 blocked, using SerpAPI for ${url}`)
        const serpData = await fetchSerpApiData(url)
        return serpData
      }

      throw new Error(`Failed to scan ${url}: ${error.response?.status || error.message}`)
    }
    throw error
  }

  return analyzeHTML(url, html, status)
}

async function fetchSerpApiData(url: string): Promise<ScanResult> {
  const apiUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(url)}&api_key=${serpApiKey}`

  const { data } = await axios.get(apiUrl)
  const meta = data.organic_results?.[0]

  return {
    url,
    title: meta?.title || "N/A",
    metaDescription: meta?.snippet || "No description available",
    h1: meta?.title || "N/A",
    h2s: [],
    images: [],
    wordCount: meta?.snippet?.split(" ").length || 0,
    status: 200,
    issues: [],
    suggestions: [],
  }
}

function analyzeHTML(url: string, html: string, status: number): ScanResult {
  const $ = cheerio.load(html)

  const title = $("title").text()
  const metaDescription = $('meta[name="description"]').attr("content")
  const h1 = $("h1").first().text()
  const h2s = $("h2")
    .map((_, el) => $(el).text())
    .get()

  const images = $("img")
    .map((_, el) => ({
      src: $(el).attr("src") || "",
      alt: $(el).attr("alt"),
    }))
    .get()

  const bodyText = $("body").text()
  const wordCount = bodyText.split(/\s+/).filter((word) => word.length > 0).length

  const issues: Array<{ type: string; message: string; priority: string }> = []
  const suggestions: Array<{ action: string; impact: string }> = []

  if (!title || title.length === 0) {
    issues.push({ type: "error", message: "Missing title tag", priority: "high" })
    suggestions.push({ action: "Add a descriptive title tag (50-60 characters)", impact: "high" })
  } else if (title.length < 30) {
    issues.push({ type: "warning", message: "Title tag too short", priority: "medium" })
    suggestions.push({ action: "Expand title to 50-60 characters", impact: "medium" })
  } else if (title.length > 60) {
    issues.push({ type: "warning", message: "Title tag too long", priority: "medium" })
    suggestions.push({ action: "Shorten title to 50-60 characters", impact: "medium" })
  }

  if (!metaDescription) {
    issues.push({ type: "error", message: "Missing meta description", priority: "high" })
    suggestions.push({ action: "Add a compelling meta description (150-160 characters)", impact: "high" })
  } else if (metaDescription.length < 120) {
    issues.push({ type: "warning", message: "Meta description too short", priority: "medium" })
    suggestions.push({ action: "Expand meta description to 150-160 characters", impact: "medium" })
  } else if (metaDescription.length > 160) {
    issues.push({ type: "warning", message: "Meta description too long", priority: "medium" })
    suggestions.push({ action: "Shorten meta description to 150-160 characters", impact: "medium" })
  }

  if (!h1) {
    issues.push({ type: "error", message: "Missing H1 tag", priority: "high" })
    suggestions.push({ action: "Add a clear H1 heading", impact: "high" })
  }

  const imagesWithoutAlt = images.filter((img) => !img.alt)
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      type: "warning",
      message: `${imagesWithoutAlt.length} images missing alt text`,
      priority: "medium",
    })
    suggestions.push({ action: "Add descriptive alt text to images", impact: "medium" })
  }

  if (wordCount < 300) {
    issues.push({ type: "warning", message: "Low word count", priority: "medium" })
    suggestions.push({ action: "Add more content (aim for 500+ words)", impact: "medium" })
  }

  return {
    url,
    title,
    metaDescription,
    h1,
    h2s,
    images,
    wordCount,
    status,
    issues,
    suggestions,
  }
}

export function calculateSEOScore(result: ScanResult): number {
  let score = 100
  if (!result.title) score -= 20
  else if (result.title.length < 30 || result.title.length > 60) score -= 10
  if (!result.metaDescription) score -= 20
  else if (result.metaDescription.length < 120 || result.metaDescription.length > 160) score -= 10
  if (!result.h1) score -= 15
  const imagesWithoutAlt = result.images.filter((img) => !img.alt).length
  if (imagesWithoutAlt > 0) score -= Math.min(15, imagesWithoutAlt * 3)
  if (result.wordCount < 300) score -= 10
  return Math.max(0, score)
}
