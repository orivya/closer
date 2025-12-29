# Data Migration Guide: Old → New Database

## Current Status

- ✅ **Schema migrated**: All tables exist in new database
- ❌ **Data NOT migrated**: New database is empty
- ⚠️ **Frontend**: May be using old database (check `.env.local`)

---

## Step 1: Verify Which Database Frontend Uses

**Check your browser console:**
1. Open DevTools (F12)
2. Go to Console tab
3. Type: `import.meta.env.VITE_SUPABASE_URL`
4. Should show: `https://jyaymqmbmvmhabmhfqeg.supabase.co` (NEW)

**If it shows the old URL**, the frontend is still using the old database.

---

## Step 2: Export Data from Old Database

You need to export data from the **OLD database** (`rchglxmrudwfdwglbuft`).

### Option A: Use Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/rchglxmrudwfdwglbuft
2. Go to **SQL Editor**
3. Run this query to export users:

```sql
-- Export users (from auth schema - requires special access)
-- Note: You may need to use Supabase CLI or API for auth.users
```

### Option B: Use Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already
npm install -g supabase

# Login
supabase login

# Link to OLD project
supabase link --project-ref rchglxmrudwfdwglbuft

# Export data
supabase db dump --data-only -f old-database-export.sql
```

### Option C: Manual SQL Export (If you have access)

I can create SQL scripts to export each table, but you'll need:
- Access to the old database
- Ability to run SQL queries

---

## Step 3: Import Data into New Database

Once you have the data export:

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg
2. Go to **SQL Editor**
3. Paste and run the export SQL

**Important:** You'll need to:
- Update user IDs (auth.users IDs will be different)
- Update foreign key references
- Handle auth.users separately (requires special permissions)

---

## Step 4: Update Frontend Configuration

Make sure `.env.local` has the NEW database:

```env
VITE_SUPABASE_URL=https://jyaymqmbmvmhabmhfqeg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YXltcW1ibXZtaGFibWhmcWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjAzNzIsImV4cCI6MjA4MTc5NjM3Mn0.N-JQEnuIs0mPEcjVC_Kf1lioB1jseERUT1FA2EWD0Eo
VITE_SUPABASE_PROJECT_ID=jyaymqmbmvmhabmhfqeg
```

Then **restart your dev server**:
```bash
npm run dev
```

---

## Step 5: Test Migration

1. Clear browser localStorage (old auth tokens)
2. Try logging in with `sample3@gmail.com`
3. Check if your journal entries appear
4. Verify all data is there

---

## Quick Check: Which Database Am I Using?

**In browser console:**
```javascript
// Check which Supabase URL is being used
console.log(import.meta.env.VITE_SUPABASE_URL);

// Check current user
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user?.email);
```

---

## Need Help?

**If you can't access the old database:**
- Contact Lovable support to export your data
- Or use Supabase API to export via service role key

**If you need me to create export scripts:**
- I can create SQL queries for each table
- But you'll need access to run them on the old database

---

## Alternative: Start Fresh (If Data Loss is Acceptable)

If you don't need the old data:
1. ✅ New database is already set up
2. ✅ Just need to update `.env.local` (already done)
3. ✅ Users can sign up fresh
4. ✅ All new data goes to new database

**This is fine if:**
- You're okay losing old journal entries
- You're in early development
- You want a clean slate

