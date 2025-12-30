import Link from "next/link";
import { Sparkles } from "lucide-react";

import { TimezonePill } from "@/components/home/TimezonePill";

export default function HomePage() {
  return (
    <main id="home-view" className="view active" role="tabpanel" aria-label="Home">
      <div className="container">
        <TimezonePill />

        <div className="connection-visual" aria-hidden="true">
          <div className="connection-track" />
          <div className="connection-spark" />
          <div className="avatar me">M</div>
          <div className="avatar them">E</div>
        </div>

        <div className="countdown-hero">
          <div className="visit-label">Next Visit in</div>
          <div className="days-display" aria-label="Countdown">
            <span className="days-num" id="days-num">
              12
            </span>
            <span className="days-text">days</span>
          </div>
        </div>

        <Link href="/connect" className="daily-card focus-ring" role="button" aria-label="Answer daily question">
          <div className="card-label">
            <Sparkles size={14} style={{ width: 14 }} aria-hidden="true" /> Daily Question
          </div>
          <h3 className="card-question text-balance">“What’s a small moment from this week that you want to remember?”</h3>
          <div className="card-footer">
            <span className="card-cta">Tap to answer</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                aria-hidden="true"
                style={{ width: 26, height: 26, borderRadius: 999, background: "var(--clay)", border: "2px solid var(--base)", marginRight: -8 }}
              />
              <div
                aria-hidden="true"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-highlight)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 9,
                  color: "var(--stone)",
                }}
              >
                ?
              </div>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
