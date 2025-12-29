import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.06] -top-[200px] -left-[200px] bg-sage animate-[drift-1_30s_ease-in-out_infinite]"
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.06] -bottom-[100px] -right-[100px] bg-sage-dark animate-[drift-2_35s_ease-in-out_infinite]"
        />
      </div>

      <div className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6">
        {/* Confused Avatar */}
        <div className="relative w-[120px] h-[105px] mb-10">
          {/* Glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[140px] blur-[40px] opacity-40 animate-[glow-pulse_3s_ease-in-out_infinite]"
            style={{ background: 'radial-gradient(ellipse, hsl(var(--sage-glow)) 0%, transparent 70%)' }}
          />
          
          {/* Body */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[88px] rounded-[75%_25%_65%_35%_/_60%_40%_60%_40%] shadow-[0_12px_40px_rgba(125,155,138,0.3)] animate-[confused-sway_4s_ease-in-out_infinite]"
            style={{ background: 'linear-gradient(155deg, hsl(var(--sage-light)) 0%, hsl(var(--sage)) 50%, hsl(var(--sage-dark)) 100%)' }}
          >
            {/* Eyes */}
            <div className="absolute top-[40%] left-[42%] -translate-x-1/2 flex gap-5">
              <div className="w-2 h-2 bg-white/95 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-[confused-blink_3s_ease-in-out_infinite]" />
              <div className="w-1.5 h-1.5 bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-[confused-blink_3s_ease-in-out_infinite]" />
            </div>
          </div>
          
          {/* Floating question marks */}
          <span className="absolute right-[-20px] top-[10px] text-2xl text-sage opacity-0 animate-[float-up_2s_ease-out_infinite]">?</span>
          <span className="absolute right-[-30px] top-[30px] text-2xl text-sage opacity-0 animate-[float-up_2s_ease-out_infinite_0.7s]">?</span>
          <span className="absolute right-[-10px] top-[50px] text-2xl text-sage opacity-0 animate-[float-up_2s_ease-out_infinite_1.4s]">?</span>
        </div>

        {/* Error Code */}
        <div className="font-mono text-[80px] sm:text-[80px] text-[60px] font-bold text-sage tracking-[-4px] mb-4 opacity-15">
          404
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-[28px] font-semibold text-foreground mb-3">
          This path doesn't exist
        </h1>

        {/* Message */}
        <p className="text-base text-muted-foreground max-w-[400px] leading-relaxed mb-10">
          The page you're looking for seems to have wandered off. Let's get you back to clarity.
        </p>

        {/* Actions */}
        <div className="flex gap-4 flex-wrap justify-center max-sm:flex-col max-sm:w-full max-sm:max-w-[280px]">
          <Button asChild className="bg-sage hover:bg-sage-light text-white px-7 py-3.5 h-auto hover:-translate-y-0.5 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(125,155,138,0.3)]">
            <Link to="/chat">Go to Chat</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent border-border text-muted-foreground hover:bg-surface hover:text-foreground px-7 py-3.5 h-auto transition-all duration-200">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>

        {/* Footer Note */}
        <p className="absolute bottom-8 text-[13px] text-muted-foreground/60">
          Need help?{" "}
          <a 
            href="mailto:support@orivya.com" 
            className="text-sage hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
