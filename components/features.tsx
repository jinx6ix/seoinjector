import { Search, FileText, Zap, BarChart3, Globe, Shield } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Keyword Research",
    description:
      "Discover high-value keywords with real-time search volume, difficulty scores, and CPC data. Track your rankings and identify content opportunities.",
  },
  {
    icon: FileText,
    title: "AI Content Generator",
    description:
      "Generate SEO-optimized articles, meta tags, and headlines with AI. Get content outlines, internal linking suggestions, and readability scores.",
  },
  {
    icon: Zap,
    title: "Automated Page Audits",
    description:
      "Run comprehensive SEO audits powered by Lighthouse. Get Core Web Vitals, accessibility scores, and prioritized fix recommendations.",
  },
  {
    icon: BarChart3,
    title: "Competitor Analysis",
    description:
      "Track competitor rankings, analyze their content strategy, and discover gaps in your SEO approach. Stay ahead of the competition.",
  },
  {
    icon: Globe,
    title: "Site Monitoring",
    description:
      "Connect your website via script tag, WordPress plugin, or OAuth. Monitor multiple sites from one dashboard with real-time updates.",
  },
  {
    icon: Shield,
    title: "One-Click Fixes",
    description:
      "Apply SEO improvements directly to your site with one click. Update meta tags, fix broken links, and optimize images automatically.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need to dominate search rankings
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Powerful SEO tools that work together to improve your visibility, traffic, and conversions.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
