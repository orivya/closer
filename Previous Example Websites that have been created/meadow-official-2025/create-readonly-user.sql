-- Create a read-only user for MCP access
-- Run this in Supabase SQL Editor

-- Create the role
CREATE ROLE readonly_mcp WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD';

-- Grant connection to database
GRANT CONNECT ON DATABASE postgres TO readonly_mcp;

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO readonly_mcp;

-- Grant SELECT on all existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_mcp;

-- Grant SELECT on all existing sequences (for viewing IDs)
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly_mcp;

-- Set default privileges for future tables (so new tables are automatically readable)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT SELECT ON TABLES TO readonly_mcp;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT SELECT ON SEQUENCES TO readonly_mcp;

-- Grant access to information_schema for introspection
GRANT USAGE ON SCHEMA information_schema TO readonly_mcp;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO readonly_mcp;

-- Comment explaining the role
COMMENT ON ROLE readonly_mcp IS 'Read-only user for MCP access. Can only SELECT, no modifications allowed.';

