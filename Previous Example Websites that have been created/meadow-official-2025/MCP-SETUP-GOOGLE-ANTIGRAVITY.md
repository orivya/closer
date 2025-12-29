# MCP Setup for Google Anti-Gravity

## Your Supabase Project Details

**Project ID:** `jyaymqmbmvmhabmhfqeg`  
**Project URL:** `https://jyaymqmbmvmhabmhfqeg.supabase.co`  
**Region:** `us-west-2`  
**Database Password:** `wTIS4Pp3G2NcOAoO`  
**Connection Type:** Session Pooler (required for IPv6 compatibility)

---

## Step 1: Find Anti-Gravity Config File

Google Anti-Gravity uses VS Code's configuration system. The MCP config location depends on your setup:

**macOS:**
```
~/Library/Application Support/Google Anti-Gravity/User/globalStorage/mcp.json
```
OR
```
~/.config/google-antigravity/mcp.json
```

**Windows:**
```
%APPDATA%\Google Anti-Gravity\User\globalStorage\mcp.json
```

**Linux:**
```
~/.config/google-antigravity/mcp.json
```

**Alternative:** Check Anti-Gravity Settings → Extensions → MCP Servers

---

## Step 2: Create or Edit Config File

### Option A: Via Anti-Gravity UI (Recommended)

1. Open **Google Anti-Gravity**
2. Go to **Settings** (gear icon)
3. Navigate to **Extensions** → **MCP Servers**
4. Click **Add Server** or **Edit Configuration**

### Option B: Manual File Edit

Create or edit the config file at the path above.

---

## Step 3: Add MCP Configuration

Add this JSON configuration:

```json
{
  "mcpServers": {
    "meadow-db": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres"
      ]
    }
  }
}
```

**Important:** If you already have other MCP servers, add `meadow-db` to the existing `mcpServers` object.

**Example with multiple servers:**
```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": [...]
    },
    "meadow-db": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres"
      ]
    }
  }
}
```

---

## Step 4: Restart Anti-Gravity

1. **Quit Anti-Gravity completely**
2. **Reopen Anti-Gravity**
3. The MCP connection should now be active

---

## Step 5: Verify Connection

In Anti-Gravity, ask the AI:
> "Can you query the meadow-db database to show me all tables?"

Or use the MCP panel (if available):
- Look for **MCP Servers** in the sidebar
- You should see `meadow-db` listed
- Click to test the connection

---

## Alternative: Supabase MCP Server (If Available)

If Anti-Gravity supports the official Supabase MCP server, you can use:

```json
{
  "mcpServers": {
    "meadow-db": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server",
        "--project-ref",
        "jyaymqmbmvmhabmhfqeg"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

**To get access token:**
1. Go to https://supabase.com/dashboard/account/tokens
2. Click **Generate New Token**
3. Copy the token (starts with `sbp_`)
4. Replace `YOUR_ACCESS_TOKEN_HERE` above

**Note:** This method uses the Supabase Management API instead of direct Postgres, which may have different capabilities.

---

## Troubleshooting

### "Command not found" Error
- Make sure Node.js is installed: `node --version`
- Install from [nodejs.org](https://nodejs.org/) if needed

### "Connection failed" Error
- Verify the connection string is correct
- Check that your Supabase project is active
- Ensure you're using the session pooler format

### Can't Find Config File
- Check Anti-Gravity Settings → Extensions → MCP
- Look for "MCP Configuration" or "Model Context Protocol" settings
- Anti-Gravity may use a different config location - check their documentation

### MCP Server Not Showing
- Make sure JSON syntax is valid
- Restart Anti-Gravity completely
- Check if Anti-Gravity requires a specific MCP server format

---

## What Anti-Gravity Can Do

Once connected, Anti-Gravity can:
- ✅ Query all 30 tables in your database
- ✅ Check schema (columns, types, constraints)
- ✅ Read data (SELECT queries)
- ✅ Help debug database issues
- ✅ Verify migrations were applied
- ⚠️ **Full read/write access** - Can modify data (be careful!)

---

## Security Note

This connection uses the `postgres` superuser with **full read/write access**.

**For read-only access:**
1. Run `create-readonly-user.sql` in Supabase SQL Editor
2. Update the connection string to use `readonly_mcp` instead of `postgres.jyaymqmbmvmhabmhfqeg`

---

## Quick Reference

**Connection String:**
```
postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**Project Details:**
- Project ID: `jyaymqmbmvmhabmhfqeg`
- Region: `us-west-2`
- Database: `postgres`
- User: `postgres.jyaymqmbmvmhabmhfqeg`

**After Setup:**
- Restart Anti-Gravity
- Test with: "Show me all tables in meadow-db"

---

## Need Help?

If Anti-Gravity uses a different MCP configuration format:
1. Check Anti-Gravity's official documentation
2. Look for "MCP" or "Model Context Protocol" in settings
3. The connection string format should be the same, but the config structure might differ

