"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Accent = { accent: string; glow: string };

const accentMap: Record<string, Accent> = {
  home: { accent: "var(--clay)", glow: "var(--clay-glow)" },
  moments: { accent: "var(--mist)", glow: "var(--mist-glow)" },
  messages: { accent: "var(--clay)", glow: "var(--clay-glow)" },
  connect: { accent: "var(--clay)", glow: "var(--clay-glow)" },
  us: { accent: "var(--mist)", glow: "var(--mist-glow)" },
};

function getViewName(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/dev")) return "home";
  if (pathname.startsWith("/moments")) return "moments";
  if (pathname.startsWith("/messages")) return "messages";
  if (pathname.startsWith("/connect")) return "connect";
  if (pathname.startsWith("/us")) return "us";
  return "home";
}

export function AccentController() {
  const pathname = usePathname();

  useEffect(() => {
    const viewName = getViewName(pathname);
    const entry = accentMap[viewName] ?? accentMap.home;
    document.documentElement.style.setProperty("--accent", entry.accent);
    document.documentElement.style.setProperty("--accent-glow", entry.glow);
  }, [pathname]);

  return null;
}

