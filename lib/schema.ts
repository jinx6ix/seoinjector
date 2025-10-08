export type SchemaType = "Article" | "FAQ" | "Product" | "BreadcrumbList" | "Organization" | "WebSite"

interface SchemaBase {
  "@context": string
  "@type": string
}

interface ArticleSchema extends SchemaBase {
  "@type": "Article"
  headline: string
  description?: string
  author?: {
    "@type": "Person" | "Organization"
    name: string
  }
  datePublished?: string
  dateModified?: string
  image?: string[]
}

interface FAQSchema extends SchemaBase {
  "@type": "FAQPage"
  mainEntity: Array<{
    "@type": "Question"
    name: string
    acceptedAnswer: {
      "@type": "Answer"
      text: string
    }
  }>
}

interface ProductSchema extends SchemaBase {
  "@type": "Product"
  name: string
  description?: string
  image?: string[]
  offers?: {
    "@type": "Offer"
    price: string
    priceCurrency: string
    availability?: string
  }
}

interface BreadcrumbSchema extends SchemaBase {
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item?: string
  }>
}

export type Schema = ArticleSchema | FAQSchema | ProductSchema | BreadcrumbSchema

export function generateArticleSchema(data: {
  headline: string
  description?: string
  author?: string
  datePublished?: string
  dateModified?: string
  image?: string[]
}): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description,
    author: data.author
      ? {
          "@type": "Person",
          name: data.author,
        }
      : undefined,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    image: data.image,
  }
}

export function generateFAQSchema(questions: Array<{ question: string; answer: string }>): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }
}

export function generateProductSchema(data: {
  name: string
  description?: string
  image?: string[]
  price?: string
  currency?: string
  availability?: string
}): ProductSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.image,
    offers: data.price
      ? {
          "@type": "Offer",
          price: data.price,
          priceCurrency: data.currency || "USD",
          availability: data.availability || "https://schema.org/InStock",
        }
      : undefined,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
