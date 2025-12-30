import { readFile } from "node:fs/promises";
import path from "node:path";

import Link from "next/link";
import { notFound } from "next/navigation";

const POST_V1_ROUTES = new Set<string>(["/connect/truth-or-dare", "/connect/36-questions"]);

function extractRoutes(markdown: string): string[] {
  const matches = Array.from(markdown.matchAll(/`(\/[^`]+)`/g), (m) => m[1].trim());
  const unique = new Set<string>();
  for (const route of matches) {
    if (!route.startsWith("/")) continue;
    if (route.includes(" ")) continue;
    unique.add(route);
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

function groupKey(route: string): string {
  if (POST_V1_ROUTES.has(route)) return "Post‑V1 (Do Not Build)";
  if (route === "/") return "Core";
  if (route.startsWith("/connect")) return "Connect";
  if (route.startsWith("/messages")) return "Messages";
  if (route.startsWith("/moments")) return "Moments";
  if (route.startsWith("/gifts")) return "Gifts";
  if (route.startsWith("/us")) return "Us + Legal";
  if (route.startsWith("/onboarding")) return "Onboarding";
  if (route.startsWith("/subscription")) return "Payments";
  if (route.startsWith("/join")) return "Join";
  if (["/login", "/signup", "/verify-email", "/forgot-password", "/reset-password"].includes(route)) return "Auth";
  if (["/features", "/pricing", "/about"].includes(route)) return "Marketing";
  if (["/404", "/500", "/maintenance", "/offline"].includes(route)) return "Utility";
  return "Other";
}

export default async function RouteIndexPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const canonicalPath = path.join(process.cwd(), "..", "CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md");
  let routes: string[] = [];

  try {
    const md = await readFile(canonicalPath, "utf8");
    routes = extractRoutes(md);
  } catch {
    routes = ["/", "/connect", "/messages", "/moments", "/us"];
  }

  const grouped = new Map<string, string[]>();
  for (const route of routes) {
    const key = groupKey(route);
    const existing = grouped.get(key);
    if (existing) existing.push(route);
    else grouped.set(key, [route]);
  }

  const orderedGroups = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));

  return (
    <main id="route-index-view" className="view active" aria-label="Route Index">
      <div className="container">
        <div style={{ marginBottom: 16 }}>
          <h1 className="page-title">Route Index</h1>
          <p className="page-subtitle">Dev-only. Extracted from `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`.</p>
        </div>

        {orderedGroups.map((group) => (
          <section key={group} className="grid-section" aria-label={group}>
            <div className="section-head">{group}</div>
            <div className="games-grid">
              {(grouped.get(group) ?? []).map((route) => (
                <Link key={route} href={route} className="game-tile focus-ring" role="button">
                  <div>
                    <div className="tile-title">{route}</div>
                    <div className="tile-desc">Open route</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

