interface SettingsHeaderProps {
  title: string;
  subtitle: string;
}

export function SettingsHeader({ title, subtitle }: SettingsHeaderProps) {
  return (
    <header className="px-8 py-5 border-b border-border-subtle bg-elevated flex-shrink-0 max-md:px-6 max-sm:px-4">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>
    </header>
  );
}
