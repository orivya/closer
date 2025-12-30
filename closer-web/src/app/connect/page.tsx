"use client";

import Link from "next/link";
import {
  Calendar,
  Flame,
  GitPullRequest,
  Hammer,
  Heart,
  Hourglass,
  Moon,
  Smile,
  Sun,
} from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();
  const stackRef = useRef<HTMLDivElement | null>(null);
  const reduceMotionRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = mq.matches;

    function onChange() {
      reduceMotionRef.current = mq.matches;
    }

    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  function navigateToDeck() {
    router.push("/connect/intimacy-deck");
  }

  function resetTilt() {
    if (!stackRef.current) return;
    stackRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  function onHeroPointerMove(e: ReactPointerEvent<HTMLElement>) {
    if (reduceMotionRef.current) return;
    if (!stackRef.current) return;

    const hero = e.currentTarget;
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotY = (x - 0.5) * 14;
    const rotX = (0.5 - y) * 10;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!stackRef.current) return;
      stackRef.current.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    });
  }

  return (
    <main id="connect-view" className="view active" role="tabpanel" aria-label="Connect">
      <div className="container">
        <div className="connect-header">
          <div>
            <h1 className="page-title">Connect</h1>
            <p className="page-subtitle">Deepen your bond through play.</p>
          </div>
          <div className="sync-status" aria-label="Sync status">
            <div className="sync-dot" aria-hidden="true" />
            <span className="sync-text">Sync Active</span>
          </div>
        </div>

        <section
          className="featured-hero"
          id="featured-hero"
          aria-label="Featured experience"
          onPointerMove={onHeroPointerMove}
          onPointerLeave={resetTilt}
          onPointerUp={resetTilt}
          onClick={navigateToDeck}
          style={{ cursor: "pointer" }}
        >
          <div className="featured-content">
            <div className="featured-badge">Featured Experience</div>
            <h2 className="featured-title">The Intimacy Deck</h2>
            <p className="featured-desc">
              150 questions designed to spark conversation, reignite passion, and deepen your understanding.
            </p>

            <button type="button" className="draw-btn focus-ring pressable" tabIndex={-1}>
              Draw Card
            </button>
          </div>

          <div className="featured-visual" aria-hidden="true">
            <div className="rising-hearts-container">
              <svg className="rising-heart rh-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
              </svg>
              <svg className="rising-heart rh-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
              </svg>
              <svg className="rising-heart rh-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
              </svg>
              <svg className="rising-heart rh-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
              </svg>
              <svg className="rising-heart rh-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
              </svg>
            </div>

            <div
              className="card-stack"
              id="card-stack"
              title="Tap to draw"
              role="button"
              tabIndex={0}
              ref={stackRef}
            >
              <div className="stacked-card bottom" />
              <div className="stacked-card middle" />
              <div className="stacked-card top">
                <div className="card-back-pattern" />
                <div style={{ display: "flex", height: "100%" }}>
                  <div className="deck-spine">
                    <span className="deck-label-vertical">INTIMACY</span>
                  </div>
                  <div className="deck-visual-area">
                    <div className="card-hearts-visual">
                      <svg className="heart-svg" viewBox="0 0 24 24" fill="rgba(224,159,125,0.22)">
                        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
                      </svg>
                      <svg className="heart-lg" viewBox="0 0 24 24" fill="var(--clay)">
                        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
                      </svg>
                      <svg className="heart-svg" viewBox="0 0 24 24" fill="rgba(224,159,125,0.22)">
                        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid-section" aria-label="Play together">
          <div className="section-head">Play Together</div>
          <div className="games-grid">
            <Link href="/connect/hot-takes" className="game-tile focus-ring" role="button">
              <div className="game-icon icon-clay">
                <Flame aria-hidden="true" />
              </div>
              <div>
                <div className="tile-title">Hot Takes</div>
                <div className="tile-desc">Spicy debates</div>
              </div>
            </Link>
            <Link href="/connect/would-you-rather" className="game-tile focus-ring" role="button">
              <div className="game-icon icon-mist">
                <GitPullRequest aria-hidden="true" />
              </div>
              <div>
                <div className="tile-title">Would You Rather</div>
                <div className="tile-desc">Tough choices</div>
              </div>
            </Link>
            <Link href="/connect/time-capsule" className="game-tile focus-ring" role="button">
              <div className="game-icon icon-gold">
                <Hourglass aria-hidden="true" />
              </div>
              <div>
                <div className="tile-title">Time Capsule</div>
                <div className="tile-desc">Lock a message</div>
              </div>
            </Link>
            <Link href="/connect/dream-builder" className="game-tile focus-ring" role="button">
              <div className="game-icon icon-sage">
                <Hammer aria-hidden="true" />
              </div>
              <div>
                <div className="tile-title">Dream Builder</div>
                <div className="tile-desc">Future plans</div>
              </div>
            </Link>
          </div>
        </section>

        <section className="grid-section" aria-label="Rituals">
          <div className="section-head">Rituals</div>
          <div className="rituals-list no-scrollbar">
            <Link href="/connect/rituals/morning" className="ritual-pill focus-ring" role="button">
              <Sun size={16} style={{ width: 16, color: "var(--clay)" }} aria-hidden="true" />
              <span className="ritual-name">Morning Hello</span>
            </Link>
            <Link href="/connect/rituals/gratitude" className="ritual-pill focus-ring" role="button">
              <Smile size={16} style={{ width: 16, color: "var(--mist)" }} aria-hidden="true" />
              <span className="ritual-name">Gratitude</span>
            </Link>
            <Link href="/connect/rituals/goodnight" className="ritual-pill focus-ring" role="button">
              <Moon size={16} style={{ width: 16, color: "var(--mist)" }} aria-hidden="true" />
              <span className="ritual-name">Goodnight</span>
            </Link>
            <Link href="/connect/rituals/thinking" className="ritual-pill focus-ring" role="button">
              <Heart size={16} style={{ width: 16, color: "var(--clay)" }} aria-hidden="true" />
              <span className="ritual-name">Thinking of You</span>
            </Link>
            <Link href="/connect/rituals/weekly" className="ritual-pill focus-ring" role="button">
              <Calendar size={16} style={{ width: 16, color: "var(--sand)" }} aria-hidden="true" />
              <span className="ritual-name">Weekly Check‑in</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
