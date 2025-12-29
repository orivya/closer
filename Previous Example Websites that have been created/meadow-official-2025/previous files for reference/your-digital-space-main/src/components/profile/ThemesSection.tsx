import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Theme {
  name: string;
  count: number;
}

interface ThemesSectionProps {
  themes: Theme[];
}

export function ThemesSection({ themes }: ThemesSectionProps) {
  const handleThemeClick = (theme: string) => {
    toast.success(`Exploring: ${theme}`);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Your Top Themes</h2>
        <Link
          to="/explore"
          className="text-[13px] text-sage hover:opacity-80 hover:underline transition-all duration-150"
        >
          View all →
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {themes.map((theme, index) => (
          <button
            key={index}
            onClick={() => handleThemeClick(theme.name)}
            className="px-4 py-2 bg-elevated border border-border-subtle rounded-full text-[13px] text-muted-foreground transition-all duration-150 hover:border-sage-muted hover:text-sage hover:bg-sage-subtle cursor-pointer"
          >
            {theme.name}
            <span className="font-mono text-[11px] text-text-muted ml-1.5">{theme.count}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
