# 🥚 Egglu by Home Farms

Farm-fresh eggs from Home Farms, delivered across Hyderabad. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Drizzle ORM (PostgreSQL).

---

## 🚀 Deploying to Vercel (Quick 2-Minute Guide)

### 1. Import Repository
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select and import the `syedsujafali/egglu` GitHub repository.
3. Framework Preset will be automatically detected as **Next.js**.

### 2. Configure Environment Variables
In the Vercel project deployment settings, add the following environment variable under **Environment Variables**:

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | Optional / Recommended | PostgreSQL connection URL (Neon, Supabase, Vercel Postgres) | `postgresql://user:pass@host/db?sslmode=require` |

*(If `DATABASE_URL` is omitted, the app still builds and runs with safe fallbacks)*.

### 3. Initialize Database Schema
If connecting a live Postgres database (e.g. Neon, Supabase, Vercel Postgres), push the schema tables:
```bash
npm run db:push
```

### 4. Deploy!
Click **Deploy**. Your Egglu website will be live with full SSL, global CDN edge caching, and serverless API routes.

---

## 💻 Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Run TypeScript check & production build:
```bash
npm run typecheck
npm run build
```
