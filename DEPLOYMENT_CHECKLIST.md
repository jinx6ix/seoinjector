# Deployment Checklist

Follow these steps to deploy your SEO Automation Platform to production.

## Pre-Deployment

### 1. Prepare Your Code

- [ ] All environment variables are in \`.env.example\` (no secrets!)
- [ ] Code is committed to Git
- [ ] \`package.json\` has correct build scripts
- [ ] TypeScript compiles without errors: \`npm run build\`
- [ ] Tests pass (if you have tests)

### 2. Create External Services

#### PostgreSQL Database

**Option A: Neon (Recommended)**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (starts with \`postgresql://\`)
4. Save as \`DATABASE_URL\`

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection pooling recommended)
5. Save as \`DATABASE_URL\`

#### Redis Cache

**Upstash Redis (Recommended)**
1. Go to [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy \`UPSTASH_REDIS_REST_URL\` → save as \`REDIS_URL\`
4. Copy \`UPSTASH_REDIS_REST_TOKEN\` → save as \`REDIS_TOKEN\`

#### OpenAI API

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Save as \`OPENAI_API_KEY\`
4. Add billing information (required for API access)

#### SerpApi

1. Go to [serpapi.com](https://serpapi.com)
2. Sign up for an account
3. Copy your API key from dashboard
4. Save as \`SERPAPI_KEY\`

## Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/seo-platform.git
git push -u origin main
\`\`\`

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: \`npm run build\`
   - **Output Directory**: .next

### 3. Add Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

#### Required Variables

\`\`\`bash
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=https://your-redis.upstash.io
REDIS_TOKEN=your-redis-token
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
OPENAI_API_KEY=sk-your-key
SERPAPI_KEY=your-serpapi-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

#### Generate NEXTAUTH_SECRET

\`\`\`bash
openssl rand -base64 32
\`\`\`

#### Optional Variables (for advanced features)

\`\`\`bash
GOOGLE_ADS_CLIENT_ID=your-client-id
GOOGLE_ADS_CLIENT_SECRET=your-client-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-dev-token
GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token
GOOGLE_SEARCH_CONSOLE_CLIENT_ID=your-gsc-client-id
GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET=your-gsc-secret
GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN=your-gsc-refresh-token
SENTRY_DSN=your-sentry-dsn
\`\`\`

### 4. Deploy

Click **Deploy** button in Vercel dashboard.

### 5. Run Database Migrations

After first deployment:

**Option A: Using Vercel CLI**

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env.local

# Run migrations
npm run db:push

# Seed database
npm run db:seed
\`\`\`

**Option B: Using Prisma Data Platform**

1. Go to [cloud.prisma.io](https://cloud.prisma.io)
2. Connect your database
3. Run migrations from the dashboard

**Option C: Manual SQL**

1. Connect to your database using a SQL client
2. Run the SQL from Prisma schema manually

### 6. Verify Deployment

- [ ] Visit your deployed URL
- [ ] Check homepage loads correctly
- [ ] Try logging in with demo credentials
- [ ] Test API endpoint: \`/api/health\` (if you created one)
- [ ] Check Vercel logs for errors

## Post-Deployment

### 1. Setup Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update \`NEXTAUTH_URL\` and \`NEXT_PUBLIC_APP_URL\` to your custom domain

### 2. Setup Monitoring

#### Vercel Analytics
1. Go to Vercel dashboard → Analytics
2. Enable Web Analytics
3. Enable Speed Insights

#### Sentry (Optional)
1. Create account at [sentry.io](https://sentry.io)
2. Create new project (Next.js)
3. Copy DSN
4. Add \`SENTRY_DSN\` to environment variables
5. Redeploy

### 3. Configure Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership (HTML file or DNS)
4. Submit sitemap: \`https://yourdomain.com/api/sitemap/[siteId]\`

### 4. Setup OAuth (Optional)

#### Google Ads API
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable Google Ads API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: \`https://yourdomain.com/api/auth/callback/google\`
6. Get refresh token using OAuth playground

#### Google Search Console API
1. Same as Google Ads, but enable Search Console API
2. Create OAuth credentials
3. Get refresh token

### 5. Test All Features

- [ ] User registration and login
- [ ] Add a new site
- [ ] Run a page scan
- [ ] Perform keyword research
- [ ] Generate content with AI
- [ ] View audit results
- [ ] Generate sitemap
- [ ] Test rate limiting (make 20+ requests quickly)

### 6. Setup Backups

#### Database Backups
- **Neon**: Automatic backups included
- **Supabase**: Automatic backups included
- **Self-hosted**: Setup pg_dump cron job

#### Redis Backups
- **Upstash**: Automatic backups included

### 7. Setup CI/CD (Optional)

Create \`.github/workflows/ci.yml\`:

\`\`\`yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run build
\`\`\`

### 8. Performance Optimization

- [ ] Enable Vercel Edge Caching
- [ ] Configure ISR for static pages
- [ ] Setup CDN for images (Vercel handles this)
- [ ] Enable compression (Vercel handles this)

## Troubleshooting

### Build Fails

**Error: Cannot find module 'prisma'**
- Solution: Add \`prisma generate\` to build command

**Error: Environment variable not found**
- Solution: Check all required env vars are set in Vercel

### Database Connection Issues

**Error: Can't reach database server**
- Check \`DATABASE_URL\` is correct
- Ensure database allows connections from Vercel IPs (0.0.0.0/0)
- For Neon/Supabase, use connection pooling URL

### Redis Connection Issues

**Error: Redis connection failed**
- Check \`REDIS_URL\` and \`REDIS_TOKEN\` are correct
- Ensure Redis instance is active
- Check Upstash dashboard for connection issues

### API Rate Limiting

**Error: Too many requests**
- Increase rate limits in \`lib/rate-limit.ts\`
- Or upgrade your Redis plan for more throughput

### OpenAI API Issues

**Error: Insufficient quota**
- Add billing information to OpenAI account
- Check usage limits in OpenAI dashboard

## Maintenance

### Regular Tasks

- [ ] Monitor error logs in Vercel dashboard
- [ ] Check database size and optimize if needed
- [ ] Review Redis cache hit rates
- [ ] Update dependencies monthly: \`npm update\`
- [ ] Review and rotate API keys quarterly
- [ ] Backup database before major updates

### Scaling

When you need to scale:

1. **Database**: Upgrade Neon/Supabase plan
2. **Redis**: Upgrade Upstash plan
3. **Vercel**: Upgrade to Pro for more bandwidth
4. **OpenAI**: Increase rate limits

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database has strong password
- [ ] Rate limiting is enabled
- [ ] CORS is configured for production domain only
- [ ] API keys have minimum required permissions
- [ ] Regular security updates: \`npm audit fix\`

## Launch Checklist

Before announcing your platform:

- [ ] All features tested in production
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics setup (Vercel Analytics)
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Sitemap submitted to Google
- [ ] robots.txt configured
- [ ] Privacy policy page added
- [ ] Terms of service page added
- [ ] Contact/support page added
- [ ] Pricing page updated with real prices
- [ ] Payment integration setup (if applicable)

## Success Metrics

Track these metrics post-launch:

- User signups
- Sites connected
- Scans performed
- Keywords tracked
- Content generated
- API response times
- Error rates
- Cache hit rates

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Upstash Docs**: [upstash.com/docs](https://upstash.com/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Congratulations!** Your SEO Automation Platform is now live! 🎉
