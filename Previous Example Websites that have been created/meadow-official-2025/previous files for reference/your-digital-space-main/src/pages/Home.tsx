import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { ValueSection } from "@/components/home/ValueSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ClaritySection } from "@/components/home/ClaritySection";
import { ConversationPreview } from "@/components/home/ConversationPreview";
import { PersonalitySection } from "@/components/home/PersonalitySection";
import { MobileSection } from "@/components/home/MobileSection";
import { CTASection } from "@/components/home/CTASection";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Ambient glow effect */}
      <div 
        className="fixed top-0 left-0 right-0 h-screen pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(125, 155, 138, 0.06) 0%, transparent 60%)" }}
      />

      <HomeNavbar />
      <HeroSection />
      <ValueSection />
      <FeaturesSection />
      <ClaritySection />
      <ConversationPreview />
      <PersonalitySection />
      <MobileSection />
      <CTASection />
      <HomeFooter />
    </div>
  );
}
