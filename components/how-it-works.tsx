const steps = [
  {
    step: "1",
    title: "Connect Your Website",
    description:
      "Add your site using our script tag, WordPress plugin, or OAuth integration. Takes less than 2 minutes to set up.",
  },
  {
    step: "2",
    title: "Run Your First Audit",
    description:
      "Our AI scans your entire site, analyzing SEO performance, technical issues, and content opportunities. Get a detailed report in seconds.",
  },
  {
    step: "3",
    title: "Implement Fixes",
    description:
      "Review prioritized recommendations and apply fixes with one click. Update meta tags, optimize images, and improve page speed automatically.",
  },
  {
    step: "4",
    title: "Track & Optimize",
    description:
      "Monitor your rankings, track keyword performance, and generate new content. Watch your traffic grow with data-driven insights.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">How it works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Get started with automated SEO in four simple steps
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {steps.map((item, index) => (
            <div key={item.step} className="relative flex gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                {index < steps.length - 1 && <div className="absolute left-6 top-12 h-full w-px bg-border lg:hidden" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
