import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-5 md:px-6 pt-[100px] md:pt-[110px] pb-[60px] md:pb-20 relative z-10">
      {/* Hero Avatar Wrapper - matches HTML reference exactly */}
      <div
        className="hero-avatar-wrapper w-[140px] h-[130px] md:w-[180px] md:h-[165px] relative mb-10 md:mb-[52px] group cursor-default"
        style={{
          isolation: "isolate",
          background: "transparent",
          border: "none",
          outline: "none",
        }}
      >
        {/* Hero Avatar Container - Safari fixes applied */}
        <div
          className="hero-avatar absolute inset-0"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            boxShadow: "none",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {/* Glow - Safari-safe blur */}
          <div
            className="absolute top-1/2 left-1/2 w-[120px] h-[110px] md:w-[150px] md:h-[140px] rounded-full bg-sage opacity-40 transition-opacity duration-500 group-hover:opacity-55"
            style={{
              transform: "translate(-50%, -50%)",
              WebkitFilter: "blur(60px)",
              filter: "blur(60px)",
              border: "none",
              outline: "none",
              willChange: "opacity",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Body - the iconic seed shape */}
          <div
            className="hero-avatar-body absolute top-1/2 left-1/2 w-[115px] h-[100px] md:w-[145px] md:h-[125px] bg-gradient-to-br from-sage-light via-sage to-sage-dark overflow-visible"
            style={{
              borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
              boxShadow: "0 15px 50px rgba(125, 155, 138, 0.35), inset 0 -12px 28px rgba(0,0,0,0.1), inset 0 12px 28px rgba(255,255,255,0.1)",
              transition: "transform 0.4s ease, border-radius 0.4s ease",
              border: "none",
              outline: "none",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Eyes Container */}
            <div
              className="absolute flex items-center gap-[26px] md:gap-8"
              style={{
                top: "40%",
                left: "42%",
                transform: "translateX(-50%)",
                transition: "gap 0.3s ease",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            >
              {/* Left eye - slightly larger */}
              <div
                className="hero-eye hero-eye-left bg-white/95 rounded-full relative"
                style={{
                  boxShadow: "0 0 12px rgba(255, 255, 255, 0.35)",
                }}
              >
                <span className="absolute top-0.5 left-0.5 w-[3px] h-[3px] bg-white/60 rounded-full" />
              </div>
              {/* Right eye - slightly smaller */}
              <div
                className="hero-eye hero-eye-right bg-white/95 rounded-full relative opacity-90"
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                }}
              >
                <span className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/60 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-[600px]">
        <h1 className="text-[clamp(38px,5vw,58px)] font-bold leading-[1.1] mb-[22px] tracking-[-0.02em]">
          See yourself{" "}
          <span className="bg-gradient-to-r from-sage-light to-sage bg-clip-text text-transparent">
            clearly
          </span>
        </h1>
        <p className="text-[17px] font-normal text-secondary leading-relaxed mb-11">
          Not advice. Not noise. Just the questions that unlock what you already know.
        </p>
        <div className="flex flex-col items-center gap-3.5">
          <Button asChild size="lg" className="bg-sage hover:bg-sage-light text-white px-[34px] py-[15px] text-sm rounded-[9px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(125,155,138,0.25)]">
            <Link to="/onboarding">Begin</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
