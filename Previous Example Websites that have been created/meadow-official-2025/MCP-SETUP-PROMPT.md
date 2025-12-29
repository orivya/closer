# Ready-to-Use MCP Setup Prompts

Copy and paste these prompts directly into Claude Desktop or Google Anti-Gravity.

---

## 📋 Prompt for Claude Desktop

```
I need to set up MCP (Model Context Protocol) to connect to my Supabase database. Here are my connection details:

Project ID: jyaymqmbmvmhabmhfqeg
Region: us-west-2
Database Password: wTIS4Pp3G2NcOAoO

Connection String:
postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres

Please help me:
1. Find or create the Claude Desktop config file (~/.config/claude/claude_desktop_config.json on macOS)
2. Add the MCP server configuration for this database
3. Verify the setup is correct

The MCP server should use:
- Command: npx
- Args: ["-y", "@modelcontextprotocol/server-postgres", "CONNECTION_STRING_ABOVE"]
- Server name: meadow-db

After setup, I'll restart Claude Desktop. Can you help me configure this?
```

---

## 📋 Prompt for Google Anti-Gravity

```
I need to set up MCP (Model Context Protocol) to connect to my Supabase database. Here are my connection details:

Project ID: jyaymqmbmvmhabmhfqeg
Region: us-west-2
Database Password: wTIS4Pp3G2NcOAoO

Connection String:
postgresql://postgres.jyaymqmbmvmhabmhfqeg:wTIS4Pp3G2NcOAoO@aws-0-us-west-2.pooler.supabase.com:6543/postgres

Please help me:
1. Find where Anti-Gravity stores its MCP configuration (check Settings → Extensions → MCP Servers)
2. Add the MCP server configuration for this database
3. Verify the setup is correct

The MCP server should use:
- Command: npx
- Args: ["-y", "@modelcontextprotocol/server-postgres", "CONNECTION_STRING_ABOVE"]
- Server name: meadow-db

After setup, I'll restart Anti-Gravity. Can you help me configure this?
```

---

## 📋 Alternative: Simple Copy-Paste Version

If the AI tools can configure it directly, just paste this:

```
Add this MCP server configuration:

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

Project details:
- Project ID: jyaymqmbmvmhabmhfqeg
- Region: us-west-2
- Database: postgres
- Connection type: Session pooler (IPv6 compatible)
```

---

## 📋 What to Say After Setup

Once configured, test the connection with:

```
Can you query the meadow-db database to show me all tables? I want to verify the MCP connection is working.
```

Or:

```
Show me the schema of the journal_entries table in meadow-db.
```

---

## 📋 If They Ask for More Details

**Database Info:**
- 30 tables total
- Currently empty (schema migrated, no data)
- Storage buckets: voice-memos, avatars, exports

**Connection Details:**
- Uses session pooler (required for IPv6)
- Full read/write access (postgres superuser)
- Region: AWS US West 2

**What You Want:**
- Read database tables and schemas
- Help debug database issues
- Verify migrations were applied correctly

