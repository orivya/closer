# MCP Supabase Quick Start

## Quick Setup (3 Steps)

### 1. Get Supabase Credentials
- Go to: Supabase Dashboard → Settings → API
- Copy:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **Anon Key**: `eyJhbGc...` (the public one)

### 2. Configure in Cursor
- Open Settings (`Cmd/Ctrl + ,`)
- Search for "MCP" or "Model Context Protocol"
- Add Supabase server:
  ```
  URL: https://mcp.supabase.com/mcp?read_only=true&project_ref=[your-project-ref]
  ```
- Find `project_ref` in your Supabase dashboard URL or project settings

### 3. Test It
Ask me: *"Can you check if journal_entries has an is_reflection column?"*

If I can answer, it's working! 🎉

---

## What Read-Only Lets Me Do

✅ Query tables and see data  
✅ Check schemas and columns  
✅ Inspect RLS policies  
✅ Debug why things aren't working  
✅ Verify migrations worked  

❌ Can't modify data  
❌ Can't change schema  
❌ Can't delete anything  

**Perfect for debugging!** I can see what's wrong, but you stay in control.

---

## If Setup Fails

1. Check Cursor version (needs recent version for MCP)
2. Look for "MCP" in Cursor settings
3. Try manual config file (see `MCP-SUPABASE-SETUP.md`)
4. Check if Supabase MCP server exists on npm

---

## Once Connected

I can help debug issues like:
- "Why aren't reflections showing?" → I'll query the database
- "Does this column exist?" → I'll check the schema
- "What data is in this table?" → I'll show you actual rows

Much better than guessing from code! 🚀

