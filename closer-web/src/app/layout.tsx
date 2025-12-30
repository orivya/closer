import "./globals.css";
import type { Metadata, Viewport } from "next";

import { AccentController } from "@/components/shell/AccentController";
import { KeyboardShortcuts } from "@/components/shell/KeyboardShortcuts";
import { MobileNav } from "@/components/shell/MobileNav";
import { SidebarNav } from "@/components/shell/SidebarNav";

export const metadata: Metadata = {
  title: "Closer — Digital Sanctuary",
  description: "Closer — a digital sanctuary for connection.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,200;1,9..144,300;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <div className="ambient-bg" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
        </div>

        <div id="app" role="application" aria-label="Closer dashboard">
          <AccentController />
          <KeyboardShortcuts />

          <SidebarNav />
          <MobileNav />

          {children}
        </div>
      </body>
    </html>
  );
}
