# MCP Setup Quick Reference

## 📋 Information to Provide to Claude/Anti-Gravity

Copy and paste this information when setting up MCP:

---

## Your Supabase Connection Details

**Project ID:** `jyaymqmbmvmhabmhfqeg`  
**Project URL:** `https://jyaymqmbmvmhabmhfqeg.supabase.co`  
**Region:** `us-west-2` (AWS US West 2)  
**Database Password:** `wTIS4Pp3G2NcOAoO`  
**Connection Type:** Session Pooler (IPv6 compatible)

---

## Full Connection String

```
postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

---

## MCP Configuration JSON

### For Claude Desktop:

**Config File:** `~/.config/claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

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

### For Google Anti-Gravity:

**Config File:** Check Settings → Extensions → MCP Servers (or `~/.config/google-antigravity/mcp.json`)

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

---

## What's in Your Database

**Tables:** 30 tables total
- Core: `journal_entries`, `profiles`, `user_settings`, `threads`, `intentions`
- AI: `ai_settings`, `ai_runs`, `ai_artifacts`, etc.
- Other: `mood_logs`, `reflections`, `time_capsules`, etc.

**Storage Buckets:** 3 buckets
- `voice-memos` (public)
- `avatars` (public)
- `exports` (private)

**Current Status:** Empty database (schema migrated, no data yet)

---

## Setup Steps

1. **Find config file** (see paths above)
2. **Create/edit config file** with JSON above
3. **Restart** Claude/Anti-Gravity
4. **Test connection:** Ask "Show me all tables in meadow-db"

---

## Security Note

⚠️ **Full read/write access** - This connection uses the `postgres` superuser.

For read-only access, use the `readonly_mcp` user instead (see `create-readonly-user.sql`).

---

## Troubleshooting

- **"Command not found"** → Install Node.js from nodejs.org
- **"Connection failed"** → Verify connection string is exact copy
- **"MCP not showing"** → Restart app completely, check JSON syntax

---

## Detailed Guides

- **Claude Desktop:** See `MCP-SETUP-CLAUDE.md`
- **Google Anti-Gravity:** See `MCP-SETUP-GOOGLE-ANTIGRAVITY.md`

