-- Create a role that can only see schema metadata, no data access
CREATE ROLE schema_inspector WITH LOGIN PASSWORD 'meadow_schema_readonly_2024';

-- Grant connection to database
GRANT CONNECT ON DATABASE postgres TO schema_inspector;

-- Grant usage on public schema (to see objects)
GRANT USAGE ON SCHEMA public TO schema_inspector;

-- Revoke all default privileges on tables (no SELECT, INSERT, UPDATE, DELETE)
-- By not granting any table permissions, they can't read data

-- Grant access to information_schema for introspection
GRANT USAGE ON SCHEMA information_schema TO schema_inspector;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO schema_inspector;

-- Grant access to pg_catalog for system catalog queries
GRANT USAGE ON SCHEMA pg_catalog TO schema_inspector;

-- Comment explaining the role
COMMENT ON ROLE schema_inspector IS 'Read-only schema inspector for AI coding tools. Cannot read any table data.';