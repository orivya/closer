import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OrivyaAvatar } from "@/components/OrivyaAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

export function HomeNavbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] px-6 md:px-12 py-3.5 flex items-center justify-between bg-background/90 backdrop-blur-[20px] border-b border-subtle">
      <Link to="/" className="flex items-center gap-[11px]">
        <OrivyaAvatar size="nav" />
        <span className="text-[15px] font-semibold tracking-[0.3px]">ORIVYA</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-[13px] font-[450] text-tertiary hover:text-foreground transition-colors">
          Features
        </a>
        <a href="#" className="text-[13px] font-[450] text-tertiary hover:text-foreground transition-colors">
          Pricing
        </a>
        <a href="#" className="text-[13px] font-[450] text-tertiary hover:text-foreground transition-colors">
          About
        </a>
      </div>

      <div className="flex items-center gap-2.5">
        {user ? (
          <Button asChild className="bg-sage hover:bg-sage-light text-white px-[18px] py-[9px] text-[13px] font-medium rounded-[7px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(125,155,138,0.25)]">
            <Link to="/chat">
              Open App <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="ghost" className="text-tertiary hover:text-foreground text-[13px] font-medium px-[18px] py-[9px]">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild className="bg-sage hover:bg-sage-light text-white px-[18px] py-[9px] text-[13px] font-medium rounded-[7px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(125,155,138,0.25)]">
              <Link to="/onboarding">Get Started</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
