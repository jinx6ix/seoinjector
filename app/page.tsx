import type { Metadata } from "next"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"
import { generateArticleSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Automated SEO Manager for Websites | AI-Powered SEO Optimization",
  description:
    "Transform your website's search rankings with our AI-powered SEO automation platform. Get real-time keyword research, automated audits, and content generation. Start optimizing today.",
  keywords: [
    "automated seo manager",
    "seo automation tool",
    "ai seo optimization",
    "keyword research tool",
    "seo audit",
    "content generator",
  ],
  openGraph: {
    title: "Automated SEO Manager for Websites",
    description: "AI-powered SEO automation platform for better search rankings",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Automated SEO Manager for Websites",
    description: "AI-powered SEO automation platform for better search rankings",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default function HomePage() {
  const schema = generateArticleSchema({
    headline: "Automated SEO Manager for Websites",
    description:
      "Transform your website's search rankings with our AI-powered SEO automation platform. Get real-time keyword research, automated audits, and content generation.",
    author: "SEO Automation Platform",
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
    </>
  )
}
