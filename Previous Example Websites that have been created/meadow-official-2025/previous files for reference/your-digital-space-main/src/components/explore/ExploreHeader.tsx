interface ExploreHeaderProps {
  title: string;
  subtitle: string;
}

export function ExploreHeader({ title, subtitle }: ExploreHeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border-subtle bg-elevated flex-shrink-0 max-md:px-5 max-md:py-4 max-md:flex-col max-md:items-start max-md:gap-3">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </header>
  );
}
