# Meadow Deployment Guide

## 1. Environment Setup

### Local Development
Copy `.env.example` to `.env` and fill in your Supabase credentials.
```bash
cp .env.example .env
```

### Production Secrets
Set the following secrets in your Supabase Project Dashboard (Settings > Edge Functions) or via CLI:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set RESEND_API_KEY=re_...
```

## 2. Database Migrations

Run pending migrations to ensure database schema is up to date:

```bash
supabase migration up
```

This includes:
- `20251221120000_create_decisions.sql` (Decision Lab)
- `20251221124000_update_user_settings.sql` (Settings enhancements)
- `20251221133000_add_ai_opt_out.sql` (Privacy controls)
- `20251221134500_add_performance_indexes.sql` (Performance tuning)

## 3. Edge Functions

Deploy all edge functions to production:

```bash
supabase functions deploy --no-verify-jwt
```
*Note: `--no-verify-jwt` is used if you handle auth manually or if some functions are public hooks, but usually you want default verification. For Meadow, most functions require auth.*

Specific functions:
- `ai-generate`: Core AI logic
- `export-data`: GDPR data export
- `delete-account`: GDPR account deletion

## 4. Storage Policies
Ensure `voice-memos` bucket matches the security policies defined in migration `20251220113213...`.
- Public: False
- RLS: Enabled

## 5. Frontend Build
Build the React application:
```bash
npm run build
```
Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.).
