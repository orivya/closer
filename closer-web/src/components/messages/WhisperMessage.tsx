"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

export function WhisperMessage({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-2">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="relative overflow-hidden rounded-2xl rounded-bl-sm group focus:outline-none focus:ring-2 focus:ring-[var(--mist)] focus:ring-offset-2 focus:ring-offset-[var(--base)] transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(196, 181, 253, 0.15), rgba(196, 181, 253, 0.05))",
            border: "1px solid rgba(196, 181, 253, 0.2)",
            padding: "12px 20px",
            minWidth: "200px",
            textAlign: "left"
          }}
        >
          {/* Creating the 'blurred text' illusion behind */}
          <div className="filter blur-[8px] opacity-40 select-none text-[var(--sand)] text-[15px] leading-relaxed">
            {children}
          </div>

          {/* Overlay UI */}
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--base)]/10 backdrop-blur-[12px] group-hover:backdrop-blur-[8px] transition-all duration-500">
            <div className="flex items-center gap-2 text-[var(--mist)] font-medium text-xs tracking-widest uppercase">
              <Sparkles size={14} className="animate-pulse" />
              Tap to Whisper
            </div>
          </div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[rgba(196,181,253,0.1)] to-transparent" />
        </button>
      ) : (
        <div
          className="relative rounded-2xl rounded-bl-sm animate-in fade-in zoom-in-95 duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(196, 181, 253, 0.2), rgba(196, 181, 253, 0.05))",
            border: "1px solid rgba(196, 181, 253, 0.3)",
            padding: "12px 20px"
          }}
        >
          <div className="text-[var(--sand)] text-[15px] leading-relaxed shadow-sm">
            {children}
          </div>
          <div className="absolute -top-2 -right-2 bg-[var(--base)] rounded-full p-1 border border-[var(--border-subtle)]">
            <Sparkles size={12} className="text-[var(--mist)]" />
          </div>
        </div>
      )}
    </div>
  );
}
