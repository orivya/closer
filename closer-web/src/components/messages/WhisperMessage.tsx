"use client";

import { EyeOff } from "lucide-react";
import { useState } from "react";

export function WhisperMessage({ children }: { children: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div
      className={`whisper-container focus-ring${isRevealed ? " reveal" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Whisper message. Hold to reveal."
      onPointerDown={(e) => {
        e.preventDefault();
        setIsRevealed(true);
        (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerUp={() => setIsRevealed(false)}
      onPointerCancel={() => setIsRevealed(false)}
      onPointerLeave={() => setIsRevealed(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsRevealed((v) => !v);
        }
        if (e.key === "Escape") setIsRevealed(false);
      }}
    >
      <div className="whisper-label">
        <EyeOff size={12} style={{ width: 12, marginRight: 8 }} aria-hidden="true" />
        Hold to Reveal
      </div>
      <div className="whisper-content">{children}</div>
    </div>
  );
}
