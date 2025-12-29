import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface RailToggleMobileProps {
  onClick: () => void;
}

export function RailToggleMobile({ onClick }: RailToggleMobileProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-5 w-12 h-12 bg-sage rounded-full flex items-center justify-center shadow-lg hover:bg-sage-light hover:scale-105 active:scale-95 transition-all duration-150 z-40 lg:hidden"
      style={{ boxShadow: "0 4px 20px hsla(var(--primary), 0.4)" }}
    >
      <Layers className="w-5 h-5 text-white" strokeWidth={1.5} />
    </button>
  );
}
