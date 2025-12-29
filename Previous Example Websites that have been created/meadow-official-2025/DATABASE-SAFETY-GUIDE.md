# Database Safety & Backup Guide

## Quick Answer: Automatic Backups?

**Does Supabase automatically backup databases?**

- **Free Tier:** ❌ **NO** - Manual backups only (you must click "Create Backup")
- **Pro Tier ($25/month):** ✅ **YES** - Automatic daily backups + 7 days point-in-time recovery
- **Team/Enterprise:** ✅ **YES** - More frequent backups + extended retention

**To check if you have automatic backups:**
1. Go to Supabase Dashboard → Settings → Database → Backups tab
2. If you see "Point-in-time recovery enabled" → ✅ You have automatic backups!
3. If you only see a "Create Backup" button → ❌ Manual backups only

---

## Current Access Level

**⚠️ IMPORTANT:** You're currently connected as the `postgres` superuser, which has **FULL read/write access** to your database. This means I can:
- ✅ Read all data
- ✅ Insert, update, delete records
- ✅ Create, alter, drop tables
- ✅ Modify schema

**I CANNOT:**
- ❌ Manage storage buckets (requires Supabase Dashboard or API)
- ❌ Deploy edge functions (requires Supabase CLI or Dashboard)
- ❌ Manage auth users (requires Supabase Dashboard or Auth API)

---

## Safety Recommendations

### Option 1: Use Read-Only Access (Recommended for Debugging)

**Best for:** When you just need me to inspect data and debug issues.

1. **Create a read-only user:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL in `create-readonly-user.sql`
   - Change the password in the SQL file before running

2. **Update MCP config** to use the read-only user:
   ```json
   {
     "mcpServers": {
       "meadow-db": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://readonly_mcp:YOUR_PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres"]
       }
     }
   }
   ```

3. **Restart Cursor** to apply changes

**Benefits:**
- ✅ I can still help debug by reading data
- ✅ Zero risk of accidental deletions
- ✅ Can see all tables and schemas
- ❌ Cannot make changes (you'll need to do those manually)

---

### Option 2: Keep Full Access with Safety Practices (Current Setup)

**Best for:** When you need me to make database changes.

**Safety Practices:**

1. **Always Backup Before Major Changes**
   - Use Supabase Dashboard → Database → Backups
   - Or use `pg_dump` via CLI

2. **Ask Me to Confirm Before Destructive Operations**
   - I'll always ask before running `DROP TABLE`, `DELETE`, or `TRUNCATE`
   - I'll show you the SQL before executing

3. **Use Transactions**
   - I can wrap changes in transactions so you can rollback if needed

4. **Test Changes on a Copy First**
   - Create a test database to verify changes

---

## Backup Strategies

### Method 1: Supabase Dashboard Backups (Easiest)

**How Automatic Backups Work:**

Supabase offers different backup options based on your plan:

#### **Free Tier:**
- ❌ **No automatic backups**
- ✅ **Manual backups only** - You must click "Create Backup" yourself
- ⚠️ **No point-in-time recovery** - Can only restore to manual backup points

#### **Pro Tier ($25/month) and Above:**
- ✅ **Automatic daily backups** - Created automatically every 24 hours
- ✅ **Point-in-time recovery (PITR)** - Restore to any point in the last 7 days
- ✅ **Backup retention:** 7 days of automatic backups
- ✅ **Manual backups** - Still available for longer-term storage

#### **Team/Enterprise Tiers:**
- ✅ **Extended retention** - Up to 30 days of point-in-time recovery
- ✅ **More frequent backups** - Every 6-12 hours
- ✅ **Custom retention policies**

**How to Check Your Backup Status:**

1. **Go to:** Supabase Dashboard → Settings → Database
2. **Click:** "Backups" tab
3. **Look for:**
   - "Point-in-time recovery" section (if available)
   - List of automatic backups (if on Pro+)
   - "Create Backup" button (always available)

**If You See:**
- ✅ **"Point-in-time recovery enabled"** → You have automatic backups!
- ✅ **List of daily backups** → Automatic backups are working
- ❌ **Only "Create Backup" button** → You're on Free tier (manual only)

**Manual Backup:**
- Click "Create Backup" before major changes
- These are stored indefinitely (until you delete them)

**Restore:**
- Go to Backups tab
- Click "Restore" on any backup point
- For PITR: Select a specific time point to restore to

**How to Enable Automatic Backups (If Not Already Enabled):**

1. **Check your plan:**
   - Go to Supabase Dashboard → Settings → Billing
   - See if you're on Free, Pro, Team, or Enterprise

2. **If on Free tier:**
   - Upgrade to Pro ($25/month) for automatic backups
   - Or use Method 2/3 below for manual automated backups

3. **If on Pro+ but backups aren't showing:**
   - Contact Supabase support
   - Backups should be enabled automatically on Pro plans

**What Gets Backed Up:**
- ✅ All database tables and data
- ✅ Schema (tables, columns, indexes, constraints)
- ✅ Functions and triggers
- ❌ Storage buckets (backed up separately)
- ❌ Edge functions (backed up via Git/CLI)

---

### Method 2: SQL Dump via CLI

```bash
# Install PostgreSQL client tools
brew install postgresql  # macOS
# or
sudo apt-get install postgresql-client  # Linux

# Create a backup
pg_dump "postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres" > backup_$(date +%Y%m%d).sql

# Restore from backup
psql "postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres" < backup_20250101.sql
```

---

### Method 3: Automated Daily Backups

**Using Supabase CLI:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref jyaymqmbmvmhabmhfqeg

# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump "postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres" > backups/backup_$DATE.sql
echo "Backup created: backup_$DATE.sql"
EOF

chmod +x backup.sh
mkdir backups

# Run daily via cron (macOS/Linux)
# Add to crontab: 0 2 * * * /path/to/backup.sh
```

---

## What I Can See Right Now

**All Tables in Your Database:**
- `ai_artifacts`, `ai_cache`, `ai_cues`, `ai_features`, `ai_feedback`
- `ai_output_events`, `ai_prompt_templates`, `ai_redaction_events`
- `ai_resurface_queue`, `ai_runs`, `ai_safety_events`
- `ai_schema_registry`, `ai_settings`, `ai_user_avoidance`
- `ai_voice_policy`, `ai_week_theme`
- `embedding_jobs`, `entry_chunks`
- `intentions`, `journal_entries`, `mood_logs`
- `profiles`, `reflections`, `thread_rollups`, `threads`
- `time_capsules`, `user_settings`, `user_state`, `user_state_history`
- `user_subscriptions`

**I can query any of these tables to:**
- Debug why reflections aren't showing
- Check if data is being saved correctly
- Verify migrations were applied
- Inspect user data (for debugging)

---

## Best Practices When Working Together

1. **Before I Make Changes:**
   - I'll show you the SQL I plan to run
   - You can review it first
   - I'll ask for confirmation on destructive operations

2. **For Debugging:**
   - I'll use SELECT queries only
   - I'll show you the results
   - No data will be modified

3. **For Schema Changes:**
   - I'll create migration files
   - You can review them
   - You run them manually in Supabase SQL Editor

4. **For Data Fixes:**
   - I'll wrap in transactions
   - Show you the before/after
   - You can rollback if needed

---

## Recommended Setup

**For Maximum Safety:**

1. ✅ Create read-only user (`create-readonly-user.sql`)
2. ✅ Update MCP config to use read-only user
3. ✅ Enable Supabase backups (Dashboard → Database → Backups)
4. ✅ Create manual backup before any major changes
5. ✅ Use Supabase Dashboard for destructive operations

**For Development Speed:**

1. ✅ Keep current full-access setup
2. ✅ Always backup before major changes
3. ✅ Review SQL before I execute
4. ✅ Use transactions for risky operations

---

## Questions?

- **Want read-only access?** → Run `create-readonly-user.sql` and update MCP config
- **Need a backup?** → Use Supabase Dashboard → Database → Backups
- **Want to see current data?** → Just ask me to query any table
- **Need to make changes?** → I'll show you the SQL first for approval

