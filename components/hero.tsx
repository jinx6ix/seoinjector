import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">AI-Powered SEO Automation</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Automated SEO Manager
            <br />
            <span className="text-primary">for Websites</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Transform your website's search rankings with AI-powered automation. Get real-time keyword research,
            automated page audits, and intelligent content generation—all in one platform.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Stop spending hours on manual SEO tasks. Our platform analyzes your site, identifies opportunities, and
            helps you implement fixes instantly. Whether you're optimizing meta tags, researching keywords, or
            generating SEO-friendly content, we've got you covered.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">No credit card required • Free 14-day trial</p>
        </div>

        <div className="mt-16 rounded-lg border bg-card p-2 shadow-2xl">
          <div className="aspect-video rounded-md bg-muted" />
        </div>
      </div>
    </section>
  )
}
