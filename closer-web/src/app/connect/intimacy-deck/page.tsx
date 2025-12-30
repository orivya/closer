"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Share2, History, RotateCw, PenTool } from "lucide-react";
import { useState } from "react";

type CardData = {
  id: string;
  category: "Intimacy" | "Deep" | "Fun" | "Spicy";
  question: string;
};

const SAMPLE_cards: CardData[] = [
  { id: "c1", category: "Intimacy", question: "When do you feel most connected to me?" },
  { id: "c2", category: "Deep", question: "What’s a memory of us that you hope you never forget?" },
  { id: "c3", category: "Fun", question: "If we could teleport anywhere right now for 1 hour, where would we go?" },
  { id: "c4", category: "Spicy", question: "What is one thing you’ve been wanting to try in the bedroom?" },
  { id: "c5", category: "Intimacy", question: "What is your favorite non-physical attribute of mine?" },
];

export default function IntimacyDeckPage() {
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deckCount, setDeckCount] = useState(SAMPLE_cards.length);
  const [isDrawing, setIsDrawing] = useState(false);

  function drawCard() {
    if (isDrawing) return;
    setIsDrawing(true);

    // Simulate draw delay/animation
    setTimeout(() => {
      const randomCard = SAMPLE_cards[Math.floor(Math.random() * SAMPLE_cards.length)];
      setActiveCard(randomCard);
      setIsFlipped(false);
      setIsDrawing(false);
      setDeckCount(c => Math.max(0, c - 1));
    }, 600);
  }

  return (
    <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
      {/* Header */}
      <header style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--base)'
      }}>
        <Link href="/connect" className="icon-btn focus-ring" aria-label="Back to Connect">
          <ArrowLeft aria-hidden="true" />
        </Link>

        <Link href="/connect/intimacy-deck/categories" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Intimacy Deck</h1>
          <div style={{ fontSize: 11, color: 'var(--stone)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {deckCount} Cards • <span style={{ textDecoration: 'underline' }}>Change</span>
          </div>
        </Link>

        <Link href="/connect/intimacy-deck/history" className="icon-btn focus-ring" aria-label="History">
          <History aria-hidden="true" size={18} />
        </Link>
      </header>

      {/* Main Stage */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
        padding: '20px',
        position: 'relative'
      }}>

        {!activeCard ? (
          /* The Deck (Draw State) */
          <button
            onClick={drawCard}
            className="card-stack focus-ring"
            aria-label="Draw a card"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              width: 280,
              height: 400
            }}
          >
            <div className={`stacked-card bottom ${isDrawing ? 'drawing' : ''}`} />
            <div className={`stacked-card middle ${isDrawing ? 'drawing' : ''}`} />
            <div className={`stacked-card top ${isDrawing ? 'drawing' : ''}`}>
              <div className="card-back-pattern" />
              <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                <div className="deck-spine">
                  <span className="deck-label-vertical">INTIMACY</span>
                </div>
                <div className="deck-visual-area">
                  <div className="card-hearts-visual">
                    <Heart style={{ width: 24, fill: 'var(--clay-glow)', color: 'transparent' }} />
                    <Heart style={{ width: 40, fill: 'var(--clay)', color: 'transparent' }} />
                    <Heart style={{ width: 24, fill: 'var(--clay-glow)', color: 'transparent' }} />
                  </div>
                  <div style={{
                    marginTop: 32,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--stone)'
                  }}>
                    Tap to Draw
                  </div>
                </div>
              </div>
            </div>
          </button>
        ) : (
          /* The Active Card (Reveal State) */
          <div
            className="active-card-container"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              width: 300,
              height: 440,
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              cursor: 'pointer'
            }}
          >
            {/* Front (Back of card design) */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              background: '#0a0a0a', borderRadius: 24, border: '1px solid var(--border-highlight)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div className="card-back-pattern" />
              <div style={{ textAlign: 'center' }}>
                <div className="card-hearts-visual" style={{ marginBottom: 16 }}>
                  <Heart style={{ width: 48, fill: 'var(--clay)', color: 'transparent' }} />
                </div>
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--stone)' }}>
                  {activeCard.category}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>Tap to Reveal</div>
              </div>
            </div>

            {/* Back (Question) */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #1a1a1a, #0e0e0e)',
              borderRadius: 24, border: '1px solid var(--border-highlight)',
              padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
                color: 'var(--clay)', marginBottom: 24, padding: '4px 12px',
                border: '1px solid rgba(224,159,125,0.2)', borderRadius: 100
              }}>
                {activeCard.category}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: 28, lineHeight: 1.4,
                textAlign: 'center', color: 'var(--sand)'
              }}>
                {activeCard.question}
              </h2>
              <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); /* Favorite logic */ }}
                  className="icon-btn" style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.03)' }}
                >
                  <Heart />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); /* Share logic */ }}
                  className="icon-btn" style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.03)' }}
                >
                  <Share2 />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
          {activeCard ? (
            <Link
              href={{
                pathname: '/connect/intimacy-deck/answer',
                query: { q: activeCard.question, c: activeCard.category }
              }}
              className="btn btn-primary focus-ring pressable"
              style={{ width: '100%', maxWidth: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
            >
              <PenTool style={{ width: 16 }} /> Answer Card
            </Link>
          ) : (
            <div style={{ height: 48 }} />
          )}

          <Link href="/connect/intimacy-deck/custom" style={{ fontSize: 12, color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: 6, opacity: 0.7 }}>
            <span style={{ color: '#D4AF37' }}>♛</span> Create Custom Card
          </Link>
        </div>
      </div>
    </main>
  );
}
