import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 10)
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: hashedPassword,
      role: "user",
    },
  })

  console.log("Created demo user:", user.email)

  // Create demo site
  const site = await prisma.site.upsert({
    where: { id: "demo-site-1" },
    update: {},
    create: {
      id: "demo-site-1",
      userId: user.id,
      name: "Demo Website",
      url: "https://example.com",
      domain: "example.com",
      connector: "script",
      status: "active",
    },
  })

  console.log("Created demo site:", site.name)

  // Create sample pages
  const pages = await Promise.all([
    prisma.page.upsert({
      where: { siteId_url: { siteId: site.id, url: "https://example.com" } },
      update: {},
      create: {
        siteId: site.id,
        url: "https://example.com",
        title: "Home - Example Website",
        metaDesc: "Welcome to our example website",
        h1: "Welcome to Example",
        status: 200,
        wordCount: 500,
        lastCrawled: new Date(),
      },
    }),
    prisma.page.upsert({
      where: { siteId_url: { siteId: site.id, url: "https://example.com/about" } },
      update: {},
      create: {
        siteId: site.id,
        url: "https://example.com/about",
        title: "About Us - Example Website",
        metaDesc: "Learn more about our company",
        h1: "About Us",
        status: 200,
        wordCount: 350,
        lastCrawled: new Date(),
      },
    }),
  ])

  console.log("Created sample pages:", pages.length)

  // Create sample keywords
  const keywords = await Promise.all([
    prisma.keyword.upsert({
      where: { siteId_keyword: { siteId: site.id, keyword: "automated seo manager" } },
      update: {},
      create: {
        siteId: site.id,
        userId: user.id,
        keyword: "automated seo manager",
        volume: 1200,
        difficulty: 45,
        cpc: 3.5,
        competition: "medium",
        position: 15,
      },
    }),
    prisma.keyword.upsert({
      where: { siteId_keyword: { siteId: site.id, keyword: "seo automation tool" } },
      update: {},
      create: {
        siteId: site.id,
        userId: user.id,
        keyword: "seo automation tool",
        volume: 2400,
        difficulty: 52,
        cpc: 4.2,
        competition: "high",
        position: 8,
      },
    }),
  ])

  console.log("Created sample keywords:", keywords.length)

  // Create sample audit
  const audit = await prisma.audit.create({
    data: {
      siteId: site.id,
      pageId: pages[0].id,
      userId: user.id,
      url: pages[0].url,
      score: 78,
      performanceScore: 85,
      seoScore: 92,
      accessibilityScore: 88,
      bestPracticesScore: 79,
      issues: [
        { type: "warning", message: "Missing alt text on 2 images", priority: "medium" },
        { type: "error", message: "Meta description too short", priority: "high" },
      ],
      suggestions: [
        { action: "Add descriptive alt text to all images", impact: "medium" },
        { action: "Expand meta description to 150-160 characters", impact: "high" },
      ],
      metrics: {
        fcp: 1.2,
        lcp: 2.1,
        cls: 0.05,
        fid: 45,
      },
    },
  })

  console.log("Created sample audit:", audit.id)

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
