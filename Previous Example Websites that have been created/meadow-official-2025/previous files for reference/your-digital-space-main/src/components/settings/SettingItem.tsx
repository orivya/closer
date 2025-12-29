import { ReactNode } from "react";

interface SettingItemProps {
  label: string;
  description: string;
  children: ReactNode;
  isLast?: boolean;
}

export function SettingItem({ label, description, children, isLast = false }: SettingItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-5 transition-colors duration-150 hover:bg-surface ${
        !isLast ? "border-b border-border-subtle" : ""
      }`}
    >
      <div className="flex-1 mr-4">
        <div className="text-sm font-medium text-foreground mb-0.5">{label}</div>
        <div className="text-[13px] text-tertiary-foreground">{description}</div>
      </div>
      {children}
    </div>
  );
}
