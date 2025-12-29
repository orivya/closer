import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  visible?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function ContinueButton({
  onClick,
  disabled = false,
  visible = false,
  children = "Continue",
  className,
}: ContinueButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2.5 px-10 py-4 h-auto bg-sage hover:bg-sage-light rounded-full text-white text-base font-medium mt-8 transition-all duration-300",
        "hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(125,155,138,0.35)]",
        "active:translate-y-0 active:shadow-[0_4px_16px_rgba(125,155,138,0.25)]",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        "transition-[opacity,transform] duration-[600ms]",
        className
      )}
    >
      {children}
      <ArrowRight className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-1" />
    </Button>
  );
}
