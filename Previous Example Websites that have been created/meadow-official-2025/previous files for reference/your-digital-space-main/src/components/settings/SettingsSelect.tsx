import { ChevronDown } from "lucide-react";

interface SettingsSelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function SettingsSelect({ value, options, onChange }: SettingsSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-3 py-2 pr-8 bg-surface border border-border rounded-md text-[13px] text-muted-foreground cursor-pointer transition-all duration-150 hover:border-sage-muted hover:text-foreground focus:outline-none focus:border-sage"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-elevated text-foreground">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" strokeWidth={2} />
    </div>
  );
}
