"use client";

import Link from "next/link";
import { CheckCheck, Mic, MoreHorizontal, Plus } from "lucide-react";
import { WhisperMessage } from "@/components/messages/WhisperMessage";

export default function MessagesPage() {
  return (
    <main id="messages-view" className="view active" role="tabpanel" aria-label="Messages">
      <div className="container chat-container">
        <header className="chat-header-refined" aria-label="Chat header">
          <div className="chat-info">
            <div className="chat-avatar-lg" aria-hidden="true">
              E
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--sand)", marginBottom: 4 }}>Emma</h3>
              <span className="chat-status-text">
                <span className="chat-status-dot" aria-hidden="true" />
                Online now
              </span>
            </div>
          </div>
          <Link href="/us/partner" className="icon-btn focus-ring" aria-label="Chat Settings">
            <MoreHorizontal style={{ color: "var(--stone)" }} aria-hidden="true" />
          </Link>
        </header>

        <div className="chat-list">
          <div className="date-sep">Yesterday</div>

          <div className="chat-bubble them">I was just looking at the moon and thinking of you.</div>

          <div className="chat-bubble me">
            I’m looking at it too. It’s beautiful tonight.
            <div className="read-receipt">
              Read 9:45 PM <CheckCheck style={{ width: 12 }} aria-hidden="true" />
            </div>
          </div>

          <div className="date-sep">Today</div>

          <WhisperMessage>I found that book you were looking for! Surprise!</WhisperMessage>
        </div>

        <div className="chat-input-refined" aria-label="Message input">
          <button type="button" className="icon-btn focus-ring" aria-label="Add">
            <Plus aria-hidden="true" />
          </button>
          <input type="text" className="chat-input-field" placeholder="Message Emma…" aria-label="Message" />
          <button type="button" className="icon-btn focus-ring" aria-label="Voice">
            <Mic aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  );
}
