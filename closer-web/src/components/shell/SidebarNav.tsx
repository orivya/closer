"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, Command, Home, MessageCircle, Sparkles, User } from "lucide-react";

type ViewName = "home" | "moments" | "messages" | "connect" | "us";

function getActiveView(pathname: string): ViewName {
  if (pathname === "/" || pathname.startsWith("/dev")) return "home";
  if (pathname.startsWith("/moments")) return "moments";
  if (pathname.startsWith("/messages")) return "messages";
  if (pathname.startsWith("/connect")) return "connect";
  if (pathname.startsWith("/us")) return "us";
  return "home";
}

const items: Array<{
  view: ViewName;
  href: string;
  tooltip: string;
  label: string;
  Icon: typeof Home;
}> = [
  { view: "home", href: "/", tooltip: "Home", label: "Home", Icon: Home },
  { view: "moments", href: "/moments", tooltip: "Moments", label: "Moments", Icon: Aperture },
  { view: "messages", href: "/messages", tooltip: "Messages", label: "Messages", Icon: MessageCircle },
  { view: "connect", href: "/connect", tooltip: "Connect", label: "Connect", Icon: Sparkles },
  { view: "us", href: "/us", tooltip: "Us", label: "Us", Icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();
  const activeView = getActiveView(pathname);

  return (
    <nav className="nav-sidebar" aria-label="Primary">
      <div className="nav-logo" aria-hidden="true">
        C.
      </div>

      <div className="nav-items" role="tablist" aria-label="Views">
        {items.map(({ view, href, tooltip, label, Icon }) => {
          const isActive = view === activeView;
          return (
            <Link
              key={view}
              href={href}
              className={`nav-item focus-ring${isActive ? " active" : ""}`}
              data-tooltip={tooltip}
              aria-controls={`${view}-view`}
              aria-selected={isActive}
              role="tab"
            >
              <Icon aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 0.8 }}>
        <div className="pill" aria-hidden="true" style={{ fontSize: 12 }}>
          <Command style={{ width: 14 }} aria-hidden="true" />
          <span>Switch</span>
          <span className="kbd">⌘</span>
          <span className="kbd">1–5</span>
        </div>
      </div>
    </nav>
  );
}

