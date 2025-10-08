import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ContentGenerationRequest {
  keyword: string
  contentType: "article" | "meta" | "outline"
  tone?: "professional" | "casual" | "technical"
  wordCount?: number
}

export interface GeneratedContent {
  title?: string
  metaTitle?: string
  metaDescription?: string
  h1?: string
  outline?: string[]
  content?: string
  internalLinks?: Array<{ anchor: string; url: string }>
}

export async function generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
  const { keyword, contentType, tone = "professional", wordCount = 1000 } = request

  switch (contentType) {
    case "meta":
      return generateMetaTags(keyword)
    case "outline":
      return generateOutline(keyword, tone)
    case "article":
      return generateArticle(keyword, tone, wordCount)
    default:
      throw new Error("Invalid content type")
  }
}

async function generateMetaTags(keyword: string): Promise<GeneratedContent> {
  const prompt = `Generate SEO-optimized meta tags for a page targeting the keyword "${keyword}".

Requirements:
- Meta title: 50-60 characters, include the keyword naturally
- Meta description: 150-160 characters, compelling and include keyword
- H1: Clear, engaging, include keyword

Return as JSON with keys: metaTitle, metaDescription, h1`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert SEO copywriter. Return only valid JSON without markdown formatting.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error("No content generated")

  return JSON.parse(content)
}

async function generateOutline(keyword: string, tone: string): Promise<GeneratedContent> {
  const prompt = `Create a comprehensive article outline for the keyword "${keyword}".

Tone: ${tone}

Requirements:
- Main title (H1)
- 5-8 section headings (H2)
- 2-3 subheadings under each section (H3)
- Focus on user intent and SEO best practices

Return as JSON with keys: h1, outline (array of strings with H2 and H3 marked)`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert content strategist. Return only valid JSON without markdown formatting.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error("No content generated")

  return JSON.parse(content)
}

async function generateArticle(keyword: string, tone: string, wordCount: number): Promise<GeneratedContent> {
  const prompt = `Write a comprehensive, SEO-optimized article about "${keyword}".

Requirements:
- Target word count: ${wordCount} words
- Tone: ${tone}
- Include H1, multiple H2s and H3s
- Natural keyword usage (avoid keyword stuffing)
- Engaging introduction and conclusion
- Actionable insights and examples
- Use short paragraphs for readability

Return as JSON with keys: h1, content (full HTML with proper heading tags)`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert SEO content writer. Write engaging, informative content optimized for search engines and users. Return only valid JSON without markdown formatting.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error("No content generated")

  return JSON.parse(content)
}
