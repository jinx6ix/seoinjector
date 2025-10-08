# SEO Automation Platform

A complete, production-ready SEO automation platform built with Next.js, PostgreSQL, Redis, OpenAI, and SerpApi. Automatically optimize your website's SEO with AI-powered content generation, keyword research, page audits, and competitor analysis.

## Features

- **SEO-Optimized Landing Page** - Server-side rendered with JSON-LD schema, meta tags, and semantic HTML
- **Authentication System** - Secure user authentication with NextAuth.js
- **Dashboard** - Comprehensive overview of site performance, keywords, and audits
- **Keyword Research** - Real-time keyword data with search volume, difficulty, CPC, and SERP features
- **Page Audit** - Lighthouse-powered audits with Core Web Vitals and actionable suggestions
- **Content Generator** - AI-powered content creation with SEO optimization
- **Site Connection** - Multiple connection methods (script tag, WordPress plugin, OAuth)
- **Competitor Analysis** - Track and analyze competitor rankings
- **Sitemap Generation** - Automatic sitemap.xml and robots.txt generation
- **Search Console Integration** - Fetch performance data from Google Search Console

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis (Upstash)
- **AI**: OpenAI GPT-4
- **SEO Data**: SerpApi + Google Ads API
- **Authentication**: NextAuth.js v5
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Redis instance (Upstash recommended)
- OpenAI API key
- SerpApi key
- (Optional) Google Ads API credentials
- (Optional) Google Search Console API credentials

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### Required Variables

- \`DATABASE_URL\` - PostgreSQL connection string
- \`REDIS_URL\` - Redis URL (Upstash)
- \`REDIS_TOKEN\` - Redis token (Upstash)
- \`NEXTAUTH_URL\` - Your app URL (http://localhost:3000 for dev)
- \`NEXTAUTH_SECRET\` - Generate with: \`openssl rand -base64 32\`
- \`OPENAI_API_KEY\` - OpenAI API key
- \`SERPAPI_KEY\` - SerpApi key

### Optional Variables

- \`GOOGLE_ADS_CLIENT_ID\` - Google Ads OAuth client ID
- \`GOOGLE_ADS_CLIENT_SECRET\` - Google Ads OAuth client secret
- \`GOOGLE_ADS_DEVELOPER_TOKEN\` - Google Ads developer token
- \`GOOGLE_ADS_REFRESH_TOKEN\` - Google Ads refresh token
- \`GOOGLE_SEARCH_CONSOLE_CLIENT_ID\` - GSC OAuth client ID
- \`GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET\` - GSC OAuth client secret
- \`GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN\` - GSC refresh token
- \`SENTRY_DSN\` - Sentry error tracking DSN

## Installation

1. **Clone the repository**

\`\`\`bash
git clone <repository-url>
cd seo-automation-platform
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Setup database**

\`\`\`bash
# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
\`\`\`

4. **Run development server**

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

After seeding, you can login with:
- **Email**: demo@example.com
- **Password**: demo123

## Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables in Vercel dashboard (Settings → Environment Variables)
3. Deploy!

### 3. Setup Database & Redis

**Option A: Use Vercel Integrations**
- Add Neon (PostgreSQL) integration
- Add Upstash (Redis) integration
- Environment variables will be automatically added

**Option B: Use External Services**
- Create PostgreSQL database (Neon, Supabase, Railway, etc.)
- Create Redis instance (Upstash, Redis Cloud, etc.)
- Add connection strings to Vercel environment variables

### 4. Run Database Migration

After first deployment, run migrations:

\`\`\`bash
# In Vercel dashboard, go to Settings → Functions
# Or use Vercel CLI:
vercel env pull .env.local
npm run db:push
npm run db:seed
\`\`\`

## API Endpoints

### Scan & Audit
- \`POST /api/scan\` - Crawl and audit a URL
- \`GET /api/audits\` - List audits for a site
- \`GET /api/audits/[id]\` - Get audit details

### Keywords
- \`GET /api/keywords?q=keyword\` - Search keywords with volume, difficulty, CPC
- \`POST /api/keywords\` - Track a keyword for a site
- \`GET /api/keywords/site/[siteId]\` - List tracked keywords

### Content Generation
- \`POST /api/generate\` - Generate SEO-optimized content
- \`POST /api/generate/outline\` - Generate content outline
- \`POST /api/generate/meta\` - Generate meta tags

### Site Management
- \`GET /api/sites\` - List user's sites
- \`POST /api/sites\` - Add a new site
- \`GET /api/sitemap/[siteId]\` - Generate sitemap.xml
- \`POST /api/push-fix\` - Apply one-click fixes to site

### Search Console
- \`GET /api/search-console/[siteId]\` - Fetch GSC performance data

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Dashboard pages (protected)
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── landing/          # Landing page components
├── lib/                   # Utilities and configurations
│   ├── db.ts             # Prisma client
│   ├── redis.ts          # Redis client
│   ├── rate-limit.ts     # Rate limiting
│   └── seo/              # SEO utilities
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Seed script
└── scripts/              # Utility scripts
\`\`\`

## Security Features

- **Rate Limiting** - API endpoints protected with Redis-based rate limiting
- **Authentication** - Secure session-based auth with NextAuth.js
- **Input Validation** - Zod schemas for all API inputs
- **SQL Injection Protection** - Prisma ORM with parameterized queries
- **XSS Protection** - React's built-in XSS protection
- **CORS** - Configured for production domains only

## Performance Optimizations

- **Redis Caching** - Keyword data cached for 1 hour
- **Server Components** - Most pages use React Server Components
- **Image Optimization** - Next.js Image component with automatic optimization
- **Code Splitting** - Automatic code splitting with Next.js
- **Edge Functions** - API routes deployed to Vercel Edge Network

## Monitoring & Logging

- **Sentry Integration** - Error tracking and performance monitoring
- **Database Logging** - All actions logged to \`logs\` table
- **Job Queue** - Background jobs tracked in \`jobs\` table

## License

MIT

## Support

For issues and questions, please open a GitHub issue or contact support.
