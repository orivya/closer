import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-[100px] px-6 text-center relative z-10">
      <div className="max-w-[440px] mx-auto">
        {/* Avatar */}
        <div
          className="w-[95px] h-[85px] mx-auto mb-9 relative"
          style={{
            isolation: "isolate",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        >
          {/* Glow - Safari-safe blur */}
          <div
            className="absolute top-1/2 left-1/2 w-[85px] h-[75px] rounded-full bg-sage opacity-35"
            style={{
              transform: "translate(-50%, -50%)",
              WebkitFilter: "blur(35px)",
              filter: "blur(35px)",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
          />
          {/* Body */}
          <div
            className="absolute top-1/2 left-1/2 w-[76px] h-[66px] bg-gradient-to-br from-sage-light via-sage to-sage-dark overflow-visible"
            style={{
              transform: "translate(-50%, -50%) translateZ(0)",
              borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              outline: "none",
              border: "none",
            }}
          >
            {/* Eyes */}
            <div
              className="absolute flex items-center gap-[18px]"
              style={{
                top: "36%",
                left: "42%",
                transform: "translateX(-50%)",
                outline: "none",
                border: "none",
                background: "transparent",
              }}
            >
              <div
                className="w-1.5 h-1.5 bg-white/95 rounded-full"
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                }}
              />
              <div
                className="w-[5px] h-[5px] bg-white/95 rounded-full opacity-90"
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-[28px] font-semibold mb-3">Ready to think clearly?</h2>
        <p className="text-[15px] text-tertiary mb-8">Start a conversation. No judgment. No rush.</p>
        <Button asChild size="lg" className="bg-sage hover:bg-sage-light text-white px-[34px] py-[15px] text-sm rounded-[9px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(125,155,138,0.25)]">
          <Link to="/onboarding">Begin</Link>
        </Button>
      </div>
    </section>
  );
}
