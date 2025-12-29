# Google Anti-Gravity Capabilities Inquiry Prompt

Copy and paste this prompt into Google Anti-Gravity:

---

**Question: Does Google Anti-Gravity support the following debugging and development capabilities, and if so, how do I enable/use them?**

I'm evaluating development tools and want to understand Anti-Gravity's capabilities compared to tools like Lovable. Specifically, I need to know if Anti-Gravity can:

## 1. Database Access & Querying
- **Direct Supabase database access**: Can Anti-Gravity query my Supabase PostgreSQL tables directly?
- **Schema inspection**: Can it check table schemas, columns, data types, and constraints?
- **RLS policy inspection**: Can it view and analyze Row Level Security policies?
- **Data querying**: Can it run SELECT queries to inspect actual data (not just code)?
- **Real-time database state**: Can it see the current state of data in tables?
- **MCP integration**: Does Anti-Gravity support Model Context Protocol (MCP) servers, specifically for Supabase?

## 2. Console & Browser Logs
- **Browser console access**: Can Anti-Gravity access browser console logs (errors, warnings, console.log statements)?
- **Real-time log streaming**: Can it see console output in real-time as I develop?
- **Error capture**: Can it automatically capture JavaScript errors, React errors, and stack traces?
- **Network request logging**: Can it see network requests/responses (API calls, Supabase queries)?
- **Custom log analysis**: Can it analyze logs I've added to my code (e.g., debug statements)?

## 3. Network & API Debugging
- **HTTP request inspection**: Can Anti-Gravity see HTTP requests (method, URL, headers, body)?
- **Response inspection**: Can it see API responses (status codes, response data, errors)?
- **Supabase API calls**: Can it monitor Supabase REST API calls and responses?
- **Edge function calls**: Can it see calls to Supabase Edge Functions and their responses?
- **Request/response timing**: Can it see how long API calls take?

## 4. Edge Function & Backend Debugging
- **Edge function logs**: Can Anti-Gravity access Supabase Edge Function execution logs?
- **Server-side error capture**: Can it see errors that occur in Edge Functions?
- **Backend debugging**: Can it debug server-side code execution?
- **Function deployment**: Can it automatically deploy Edge Functions to Supabase?

## 5. Session Replay & Visual Debugging
- **Session replay**: Can Anti-Gravity replay what happened on screen before an error occurred?
- **Visual state capture**: Can it see the UI state at the time of an error?
- **User interaction tracking**: Can it see what actions led to an error?

## 6. Live Preview & Instant Feedback
- **Live preview**: Does Anti-Gravity have a built-in live preview that updates as I code?
- **Hot reload**: Does it support hot module replacement (HMR)?
- **Instant visual feedback**: Can I see changes immediately without manual refresh?

## 7. File System & Codebase Awareness
- **Full codebase search**: Can Anti-Gravity search across the entire codebase?
- **Cross-referencing**: Can it understand relationships between files and functions?
- **Type awareness**: Does it understand TypeScript types and can it trace type definitions?
- **Import/export tracking**: Can it follow imports and exports across files?

## 8. Integration & Workflow
- **Git integration**: Does Anti-Gravity integrate with Git/GitHub?
- **Supabase integration**: Does it have native Supabase integration beyond basic setup?
- **MCP server support**: Can I add custom MCP servers to extend capabilities?
- **Extension ecosystem**: Is there an extension system for additional functionality?

## 9. Automated Fixes & Suggestions
- **"Try to fix" workflow**: Can Anti-Gravity automatically attempt to fix errors it identifies?
- **Database-aware fixes**: If it finds a database schema issue, can it suggest/create migrations?
- **Context-aware suggestions**: Can it provide fixes based on actual database state, not just code?

## 10. Comparison Context
For reference, I'm comparing against Lovable which offers:
- Direct Supabase database querying
- Real-time browser console/network log access
- Session replay of user interactions
- Edge function log access
- Live preview with instant deploys
- Integrated debugging workflow

**Questions:**
1. Which of these capabilities does Anti-Gravity currently support?
2. Which require additional setup/configuration?
3. Which are planned but not yet available?
4. Are there MCP servers available for Supabase integration?
5. What's the recommended workflow for debugging database issues?
6. How does Anti-Gravity compare to Lovable for full-stack debugging?

Please provide specific details on how to enable and use each supported capability.

---

**End of Prompt**




