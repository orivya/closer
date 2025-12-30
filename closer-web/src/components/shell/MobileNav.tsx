"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, Home, MessageCircle, Sparkles, User } from "lucide-react";

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
  label: string;
  Icon: typeof Home;
}> = [
  { view: "home", href: "/", label: "Home", Icon: Home },
  { view: "moments", href: "/moments", label: "Moments", Icon: Aperture },
  { view: "messages", href: "/messages", label: "Messages", Icon: MessageCircle },
  { view: "connect", href: "/connect", label: "Connect", Icon: Sparkles },
  { view: "us", href: "/us", label: "Us", Icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const activeView = getActiveView(pathname);

  return (
    <nav className="nav-mobile" aria-label="Primary mobile">
      <div className="nav-mobile-inner" role="tablist" aria-label="Views">
        {items.map(({ view, href, label, Icon }) => {
          const isActive = view === activeView;
          return (
            <Link
              key={view}
              href={href}
              className={`nav-mobile-item focus-ring${isActive ? " active" : ""}`}
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
    </nav>
  );
}

