import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import axios from "axios";
import * as cheerio from "cheerio";

const scanSchema = z.object({
  url: z.string().url("Invalid URL"),
  siteId: z.string().optional(),
});

// Scan page with retry for 429 and SerpAPI fallback for 403
async function fetchPage(url: string, retries = 3): Promise<{ html: string; status: number }> {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CyHostBot/1.0; +https://cyhost.io/bot)",
        Accept: "text/html",
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    if (res.status === 429 && retries > 0) {
      console.log("[SCAN_RETRY] 429 detected, retrying after 2s...");
      await new Promise((r) => setTimeout(r, 2000));
      return fetchPage(url, retries - 1);
    }

    if (res.status === 403) {
      console.log("[SCAN_FALLBACK] 403 blocked, using SerpAPI...");
      const serpApiKey = process.env.SERPAPI_KEY;
      if (!serpApiKey) throw new Error("Missing SERPAPI_KEY in environment");

      const serpRes = await axios.get("https://serpapi.com/search", {
        params: { api_key: serpApiKey, engine: "google", q: `site:${url}` },
      });

      if (serpRes.status === 200 && serpRes.data) {
        return { html: JSON.stringify(serpRes.data), status: 200 };
      }
      throw new Error(`SerpAPI failed with ${serpRes.status}`);
    }

    if (res.status >= 400) throw new Error(`Failed to fetch page, status ${res.status}`);

    return { html: res.data, status: res.status };
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch page");
  }
}

// Enhanced SEO analysis
function analyzeSEO(html: string) {
  const $ = cheerio.load(html);
  const title = $("title").text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || "";
  const h1 = $("h1").first().text().trim();
  const h2s = $("h2").map((_, el) => $(el).text().trim()).get();
  const images = $("img").map((_, el) => ({ 
    src: $(el).attr("src") || "", 
    alt: $(el).attr("alt") || "" 
  })).get();
  
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  const issues: Array<{ type: string; message: string; priority: string }> = [];
  const suggestions: Array<{ action: string; impact: string }> = [];

  // Title analysis
  if (!title) {
    issues.push({ type: "error", message: "Missing title tag", priority: "high" });
    suggestions.push({ action: "Add a descriptive title tag (50-60 characters)", impact: "high" });
  } else if (title.length < 30) {
    issues.push({ type: "warning", message: "Title too short", priority: "medium" });
    suggestions.push({ action: "Increase title length to 50-60 characters", impact: "medium" });
  } else if (title.length > 60) {
    issues.push({ type: "warning", message: "Title too long", priority: "medium" });
    suggestions.push({ action: "Shorten title to under 60 characters", impact: "medium" });
  }

  // Meta description analysis
  if (!metaDescription) {
    issues.push({ type: "error", message: "Missing meta description", priority: "high" });
    suggestions.push({ action: "Add a meta description (150-160 characters)", impact: "high" });
  } else if (metaDescription.length < 120) {
    issues.push({ type: "warning", message: "Meta description too short", priority: "medium" });
    suggestions.push({ action: "Increase meta description to 150-160 characters", impact: "medium" });
  } else if (metaDescription.length > 160) {
    issues.push({ type: "warning", message: "Meta description too long", priority: "medium" });
    suggestions.push({ action: "Shorten meta description to under 160 characters", impact: "medium" });
  }

  // H1 analysis
  if (!h1) {
    issues.push({ type: "error", message: "Missing H1 heading", priority: "high" });
    suggestions.push({ action: "Add a single H1 heading to the page", impact: "high" });
  }

  // Image alt text analysis
  const imagesWithoutAlt = images.filter((img) => !img.alt);
  if (imagesWithoutAlt.length > 0) {
    issues.push({ 
      type: "warning", 
      message: `${imagesWithoutAlt.length} images missing alt text`, 
      priority: "medium" 
    });
    suggestions.push({ 
      action: "Add descriptive alt text to all images", 
      impact: "medium" 
    });
  }

  // Content analysis
  if (wordCount < 300) {
    issues.push({ 
      type: "warning", 
      message: `Low word count (${wordCount} words)`, 
      priority: "medium" 
    });
    suggestions.push({ 
      action: "Increase content to at least 300 words", 
      impact: "medium" 
    });
  }

  // Calculate score
  let score = 100;
  if (!title) score -= 20;
  else if (title.length < 30 || title.length > 60) score -= 10;
  
  if (!metaDescription) score -= 20;
  else if (metaDescription.length < 120 || metaDescription.length > 160) score -= 10;
  
  if (!h1) score -= 15;
  if (imagesWithoutAlt.length > 0) score -= Math.min(15, imagesWithoutAlt.length * 3);
  if (wordCount < 300) score -= 10;

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return { 
    title, 
    metaDescription, 
    h1, 
    h2s, 
    images, 
    wordCount, 
    score, 
    seoScore: score, 
    issues, 
    suggestions 
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const { success } = await rateLimit(`scan:${session.user.id}`, 10, 60);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { url, siteId } = scanSchema.parse(body);

    console.log(`[SCAN_REQUEST] ${session.user.email} scanning ${url}`);

    // Fetch and analyze page
    const { html, status } = await fetchPage(url);
    const result = analyzeSEO(html);

    // Handle site determination
    let targetSiteId = siteId;

    if (!targetSiteId) {
      // Extract domain from URL
      const domain = new URL(url).hostname;
      
      // Look for existing site by domain
      const existingSite = await prisma.site.findFirst({
        where: {
          userId: session.user.id,
          OR: [
            { domain: domain },
            { url: { contains: domain } }
          ]
        }
      });

      if (existingSite) {
        targetSiteId = existingSite.id;
        console.log(`[SCAN_SITE] Using existing site: ${existingSite.name}`);
      } else {
        // Create new site
        const newSite = await prisma.site.create({
          data: {
            userId: session.user.id,
            name: domain,
            url: `https://${domain}`,
            domain: domain,
            connector: "manual",
            apiKey: "", // Empty string as required by schema
          }
        });
        targetSiteId = newSite.id;
        console.log(`[SCAN_SITE] Created new site: ${newSite.name}`);
      }
    }

    // Verify site belongs to user
    const site = await prisma.site.findFirst({
      where: {
        id: targetSiteId,
        userId: session.user.id
      }
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found or access denied" }, { status: 404 });
    }

    // Create audit record
    const audit = await prisma.audit.create({
      data: {
        userId: session.user.id,
        siteId: targetSiteId,
        url: url,
        score: result.score,
        seoScore: result.seoScore,
        issues: result.issues,
        suggestions: result.suggestions,
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            url: true,
            domain: true
          }
        }
      }
    });

    // Update or create page record
    await prisma.page.upsert({
      where: { 
        siteId_url: { 
          siteId: targetSiteId, 
          url: url 
        } 
      },
      update: {
        title: result.title || "No Title",
        lastCrawled: new Date(),
        updatedAt: new Date(),
      },
      create: {
        siteId: targetSiteId,
        url: url,
        title: result.title || "No Title",
        lastCrawled: new Date(),
      },
    });

    console.log(`[SCAN_SUCCESS] Audit created: ${audit.id} with score: ${result.score}`);

    return NextResponse.json({ 
      success: true,
      audit: {
        id: audit.id,
        score: result.score,
        seoScore: result.seoScore,
        issues: result.issues,
        suggestions: result.suggestions,
        url: url,
        site: audit.site,
        scannedAt: new Date().toISOString()
      },
      analysis: {
        title: result.title,
        metaDescription: result.metaDescription,
        h1: result.h1,
        wordCount: result.wordCount,
        imagesCount: result.images.length,
        imagesWithoutAlt: result.images.filter(img => !img.alt).length
      }
    });

  } catch (error: any) {
    console.error("[SCAN_ERROR]", error.message || error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid request data", 
        details: error.errors[0].message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: error.message || "Failed to scan page" 
    }, { status: 500 });
  }
}