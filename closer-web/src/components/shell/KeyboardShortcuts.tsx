"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const keyToRoute: Record<string, string> = {
  "1": "/",
  "2": "/moments",
  "3": "/messages",
  "4": "/connect",
  "5": "/us",
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const cmd = event.metaKey || event.ctrlKey;
      if (!cmd) return;
      if (isTypingTarget(event.target)) return;

      const target = keyToRoute[event.key];
      if (!target) return;

      event.preventDefault();
      if (pathname !== target) router.push(target);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router]);

  return null;
}

