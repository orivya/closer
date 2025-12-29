import { ReactNode } from "react";

interface SettingsButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
}

export function SettingsButton({ children, onClick, variant = "default" }: SettingsButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md text-[13px] font-medium cursor-pointer transition-all duration-150 active:scale-[0.97]";
  
  const variantClasses = {
    default: "bg-transparent border border-border text-muted-foreground hover:bg-hover hover:text-foreground",
    primary: "bg-sage border border-sage text-white hover:bg-sage-light",
    danger: "bg-transparent border border-destructive text-destructive hover:bg-destructive/10",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
