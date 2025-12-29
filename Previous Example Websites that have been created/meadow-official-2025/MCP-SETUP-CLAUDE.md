# MCP Setup for Claude Desktop

## Your Supabase Project Details

**Project ID:** `jyaymqmbmvmhabmhfqeg`  
**Project URL:** `https://jyaymqmbmvmhabmhfqeg.supabase.co`  
**Region:** `us-west-2`  
**Database Password:** `wTIS4Pp3G2NcOAoO`  
**Connection Type:** Session Pooler (required for IPv6 compatibility)

---

## Step 1: Find Claude Desktop Config File

**macOS:**
```
~/.config/claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/claude/claude_desktop_config.json
```

---

## Step 2: Create or Edit Config File

### Option A: If Config File Doesn't Exist

**macOS/Linux:**
```bash
mkdir -p ~/.config/claude
touch ~/.config/claude/claude_desktop_config.json
```

**Windows:**
Create the file manually at the path above.

### Option B: If Config File Exists

Open it in a text editor.

---

## Step 3: Add MCP Configuration

Add this JSON configuration to your `claude_desktop_config.json`:

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

**Important:** If you already have other MCP servers configured, add `meadow-db` to the existing `mcpServers` object. Don't replace existing config!

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

## Step 4: Restart Claude Desktop

1. **Quit Claude Desktop completely** (not just close the window)
2. **Reopen Claude Desktop**
3. The MCP connection should now be active

---

## Step 5: Verify Connection

In Claude Desktop, ask:
> "Can you query the meadow-db database to show me all tables?"

Claude should be able to:
- ✅ Query your database tables
- ✅ Check schema information
- ✅ Read data (if you have any)
- ✅ Help debug database issues

---

## Troubleshooting

### "Command not found" Error
- Make sure Node.js is installed: `node --version`
- If not installed: Download from [nodejs.org](https://nodejs.org/)

### "Connection failed" Error
- Verify the connection string is correct (copy exactly as shown)
- Check that your Supabase project is active
- Ensure you're using the session pooler format (`pooler.supabase.com:6543`)

### MCP Server Not Showing
- Make sure JSON syntax is valid (use a JSON validator)
- Restart Claude Desktop completely
- Check Claude Desktop logs for errors

---

## What Claude Can Do

Once connected, Claude can:
- ✅ Query all 30 tables in your database
- ✅ Check schema (columns, types, constraints)
- ✅ Read data (SELECT queries)
- ✅ Help debug why reflections aren't showing
- ✅ Verify migrations were applied
- ⚠️ **Full read/write access** - Claude can modify data (be careful!)

---

## Security Note

This connection uses the `postgres` superuser with **full read/write access**. 

**For read-only access**, create a read-only user first:
1. Run `create-readonly-user.sql` in Supabase SQL Editor
2. Update the connection string to use `readonly_mcp` instead of `postgres.jyaymqmbmvmhabmhfqeg`

---

## Quick Reference

**Connection String:**
```
postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**Config File Location:**
- macOS: `~/.config/claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**After Setup:**
- Restart Claude Desktop
- Test with: "Show me all tables in meadow-db"

