# Setting Up Supabase MCP in Cursor

## What is MCP?
Model Context Protocol (MCP) allows AI assistants like me to connect to external services (like Supabase) to query data, check schemas, and debug issues.

## Is Read-Only Access Sufficient?

**YES! Read-only access is perfect for debugging.** Here's what I can do with read-only:

### ✅ What Read-Only Enables:
1. **Query tables** - Check what data exists
2. **Inspect schemas** - See columns, types, constraints
3. **Check RLS policies** - Understand security rules
4. **Run SELECT queries** - See actual data
5. **Debug issues** - Find why reflections aren't showing, check data integrity
6. **Verify migrations** - Confirm columns exist after migrations
7. **Analyze data patterns** - Understand user behavior, entry counts, etc.

### ❌ What Read-Only Doesn't Allow:
1. **INSERT/UPDATE/DELETE** - Can't modify data
2. **Schema changes** - Can't create/modify tables
3. **Migration execution** - Can't run migrations

**This is perfect!** I can diagnose issues, but you maintain control over data changes.

---

## Setup Instructions

### Step 1: Find Your Supabase Credentials

You'll need:
1. **Project URL**: `https://your-project-id.supabase.co`
2. **Anon/Public Key**: Found in Supabase Dashboard → Settings → API
3. **Service Role Key** (optional, for bypassing RLS): Same location

**Important**: For read-only access, the **Anon Key** is sufficient. Only use Service Role Key if you need to bypass RLS (not recommended for production).

### Step 2: Install Supabase MCP Server (if needed)

Check if a Supabase MCP server exists:
- Search for "supabase-mcp" or "mcp-server-supabase" on npm
- Or check Cursor's built-in MCP servers

### Step 3: Configure MCP in Cursor

1. **Open Cursor Settings**:
   - `Cmd/Ctrl + ,` (Settings)
   - Or: Cursor → Preferences → Settings

2. **Navigate to MCP Settings**:
   - Search for "MCP" in settings
   - Or go to: Extensions → MCP Servers

3. **Add Supabase MCP Server**:
   
   **Official Supabase MCP Server** (Recommended):
   
   Supabase provides an official MCP server. Configure it in Cursor:
   
   ```json
   {
     "mcpServers": {
       "supabase": {
         "url": "https://mcp.supabase.com/mcp?read_only=true&project_ref=your-project-ref"
       }
     }
   }
   ```
   
   Or if Cursor uses environment variables:
   ```json
   {
     "mcpServers": {
       "supabase": {
         "url": "https://mcp.supabase.com/mcp",
         "params": {
           "read_only": "true",
           "project_ref": "your-project-ref"
         }
       }
     }
   }
   ```
   
   **Find your project_ref**: 
   - It's in your Supabase project URL: `https://app.supabase.com/project/[project_ref]`
   - Or in your project settings
   
   **For read-only access**, include `read_only=true` in the URL parameters.

4. **Set Read-Only Mode**:
   - Most MCP servers default to read-only
   - If there's a `READ_ONLY` or `PERMISSIONS` setting, set it to `true` or `read-only`

### Step 4: Verify Connection

After setup, I should be able to:
- Query your database tables
- Check schema information
- See actual data

Test by asking me: "Can you check if the `journal_entries` table has an `is_reflection` column?"

---

## Alternative: Manual Configuration File

If Cursor uses a config file, it might be located at:

**macOS**: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
**Windows**: `%APPDATA%\Cursor\User\globalStorage\mcp.json`
**Linux**: `~/.config/Cursor/User/globalStorage/mcp.json`

Create or edit this file:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?read_only=true&project_ref=your-project-ref"
    }
  }
}
```

**Replace `your-project-ref`** with your actual Supabase project reference ID.

---

## What I Can Do With Read-Only Access

Once connected, I can help you:

1. **Debug Database Issues**:
   - "Why aren't reflections showing?" → I query `journal_entries` to see if `is_reflection` is set
   - "Check if the `intention_id` column exists" → I inspect the schema
   - "Show me the last 5 entries" → I query actual data

2. **Verify Migrations**:
   - "Did the migration add the `is_reflection` column?" → I check schema
   - "Are RLS policies blocking access?" → I inspect policies

3. **Data Analysis**:
   - "How many entries does user X have?" → I query counts
   - "What tags are most common?" → I analyze tag data
   - "Are there any orphaned threads?" → I check relationships

4. **Troubleshooting**:
   - "Why is this query failing?" → I can see the actual data structure
   - "Is this data correct?" → I verify against schema

---

## Security Notes

### Read-Only is Safe Because:
- ✅ Can't modify data
- ✅ Can't delete records
- ✅ Can't change schema
- ✅ Respects RLS policies (if using Anon key)
- ✅ Can only read what your RLS allows

### Best Practices:
1. **Use Anon Key** (not Service Role) for read-only
2. **RLS policies** will still apply, so I can only see what the user can see
3. **No sensitive operations** - I can't accidentally delete or modify data

---

## Troubleshooting

### "MCP server not found"
- Check if `@modelcontextprotocol/server-supabase` exists on npm
- Try alternative MCP servers
- Check Cursor's documentation for supported MCP servers

### "Connection failed"
- Verify your Supabase URL and key are correct
- Check if your Supabase project is active
- Ensure network access is allowed

### "Permission denied"
- This is expected with read-only + RLS
- I can only see data your RLS policies allow
- This is a security feature, not a bug

---

## Next Steps

1. **Set up MCP** using the instructions above
2. **Test connection** by asking me to query your database
3. **Start debugging** - I can now see actual data, not just code!

Once set up, I'll be able to help debug issues like the reflections problem much more effectively because I can see what's actually in your database.

