import { cn } from "@/lib/utils";

interface LensToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function LensToggle({ isOpen, onClick }: LensToggleProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center w-9 h-9 bg-transparent border border-subtle rounded-md transition-all duration-150",
        "hover:bg-hover hover:border-border",
        isOpen && "bg-sage-subtle border-sage-muted text-sage"
      )}
      onClick={onClick}
      aria-label={isOpen ? "Hide Lens" : "Show Lens"}
    >
      <svg
        className="w-[18px] h-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M15 3v18" />
      </svg>
    </button>
  );
}
