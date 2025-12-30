"use client";

import Link from "next/link";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  Info,
  LogOut,
  Lock,
  Palette,
  Sparkles,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SettingsItem = {
  href: string;
  title: string;
  description: string;
  Icon: typeof User;
};

const primaryItems: SettingsItem[] = [
  { href: "/us/edit-profile", title: "Edit Profile", description: "Avatar, name, timezone", Icon: User },
  { href: "/us/partner", title: "Partner Settings", description: "Anniversary, next visit", Icon: Heart },
  { href: "/us/notifications", title: "Notifications", description: "Push, email, quiet hours", Icon: Bell },
  { href: "/us/privacy", title: "Privacy", description: "Visibility, exports, safety", Icon: Lock },
  { href: "/us/subscription", title: "Subscription", description: "Plan, billing, upgrades", Icon: CreditCard },
  { href: "/us/theme", title: "Theme", description: "Presets and custom colors", Icon: Palette },
];

const secondaryItems: SettingsItem[] = [
  { href: "/us/achievements", title: "Achievements", description: "Badges and milestones", Icon: Trophy },
  { href: "/us/help", title: "Help & Support", description: "FAQ, contact", Icon: HelpCircle },
  { href: "/us/about", title: "About", description: "Version and credits", Icon: Info },
];

export default function UsPage() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const logoutBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isLogoutOpen) {
        e.preventDefault();
        setIsLogoutOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLogoutOpen]);

  useEffect(() => {
    if (!isLogoutOpen) return;
    modalCloseRef.current?.focus();
  }, [isLogoutOpen]);

  return (
    <main id="us-view" className="view active" role="tabpanel" aria-label="Us">
      <div className="container">
        <div className="us-stack">
          <div style={{ marginBottom: 12 }}>
            <h1 className="page-title">Us</h1>
            <p className="page-subtitle">Your shared rhythm, captured.</p>
          </div>

          <section className="us-summary" aria-label="Couple overview">
            <div className="us-summary-top">
              <div>
                <div className="us-chip">Couple</div>
                <div className="us-couple-title">Maya + Emma</div>
                <div className="us-couple-sub">A small sanctuary for the two of you. Keep it light, keep it real, keep showing up.</div>
              </div>

              <Link href="/us/subscription" className="us-plan-pill pill focus-ring pressable" aria-label="Subscription">
                <Sparkles style={{ width: 14 }} aria-hidden="true" />
                <span>Free</span>
                <span className="us-plan-divider" aria-hidden="true" />
                <span className="us-plan-cta">Upgrade</span>
              </Link>
            </div>

            <div className="connection-visual us-connection" aria-hidden="true">
              <div className="connection-track" />
              <div className="connection-spark" />
              <div className="avatar me">M</div>
              <div className="avatar them">E</div>
            </div>

            <div className="us-actions" aria-label="Quick actions">
              <Link href="/us/edit-profile" className="pill focus-ring pressable us-action-pill" aria-label="Edit profile">
                <User style={{ width: 14 }} aria-hidden="true" />
                <span>Edit</span>
              </Link>
              <Link href="/us/partner" className="pill focus-ring pressable us-action-pill" aria-label="Partner settings">
                <Heart style={{ width: 14 }} aria-hidden="true" />
                <span>Partner</span>
              </Link>
              <Link href="/us/achievements" className="pill focus-ring pressable us-action-pill" aria-label="Achievements">
                <Trophy style={{ width: 14 }} aria-hidden="true" />
                <span>Achievements</span>
              </Link>
            </div>
          </section>

          <div className="profile-stats" aria-label="Stats">
            <div className="stat-box">
              <span className="stat-num">14</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">452</span>
              <span className="stat-label">Answers</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">89</span>
              <span className="stat-label">Days Together</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">156</span>
              <span className="stat-label">Moments</span>
            </div>
          </div>

          <div className="us-section-title">Settings</div>
          <nav className="settings-list" aria-label="Settings">
            {primaryItems.map(({ href, title, description, Icon }) => (
              <Link key={href} href={href} className="settings-item focus-ring">
                <span className="settings-left">
                  <span className="settings-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="settings-text">
                    <span className="settings-title">{title}</span>
                    <span className="settings-sub">{description}</span>
                  </span>
                </span>
                <ChevronRight aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="us-section-title">More</div>
          <nav className="settings-list" aria-label="More settings">
            {secondaryItems.map(({ href, title, description, Icon }) => (
              <Link key={href} href={href} className="settings-item focus-ring">
                <span className="settings-left">
                  <span className="settings-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="settings-text">
                    <span className="settings-title">{title}</span>
                    <span className="settings-sub">{description}</span>
                  </span>
                </span>
                <ChevronRight aria-hidden="true" />
              </Link>
            ))}

            <button
              ref={logoutBtnRef}
              type="button"
              className="settings-item focus-ring settings-danger"
              onClick={() => setIsLogoutOpen(true)}
            >
              <span className="settings-left">
                <span className="settings-icon" aria-hidden="true">
                  <LogOut />
                </span>
                <span className="settings-text">
                  <span className="settings-title">Log Out</span>
                  <span className="settings-sub">Sign out on this device</span>
                </span>
              </span>
              <ChevronRight aria-hidden="true" />
            </button>
          </nav>

          <div className="us-footnote">
            <span style={{ color: "var(--stone)" }}>Closer</span> • Premium dashboard prototype • Next.js build
          </div>
        </div>
      </div>

      <div className={`modal${isLogoutOpen ? " active" : ""}`} role="dialog" aria-modal="true" aria-label="Log out confirmation">
        <div className="modal-card" role="document">
          <div className="modal-top">
            <div className="modal-title">
              <LogOut style={{ width: 14 }} aria-hidden="true" /> Log Out
            </div>
            <button
              ref={modalCloseRef}
              type="button"
              className="modal-close focus-ring"
              aria-label="Close"
              onClick={() => {
                setIsLogoutOpen(false);
                logoutBtnRef.current?.focus();
              }}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <div className="modal-body">
            <div className="modal-question" style={{ fontSize: 20 }}>
              Step away for a bit?
            </div>
            <div className="modal-sub">This is just a prototype UI right now — the real auth flow will be wired later.</div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn focus-ring pressable"
                onClick={() => {
                  setIsLogoutOpen(false);
                  logoutBtnRef.current?.focus();
                }}
              >
                Cancel
              </button>
              <Link
                href="/login"
                className="btn btn-primary focus-ring pressable"
                onClick={() => setIsLogoutOpen(false)}
              >
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
