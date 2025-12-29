interface SettingsToggleProps {
  active: boolean;
  onChange: (active: boolean) => void;
}

export function SettingsToggle({ active, onChange }: SettingsToggleProps) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={`w-11 h-6 rounded-xl relative cursor-pointer transition-all duration-150 ${
        active
          ? "bg-sage border-sage"
          : "bg-surface border border-border"
      }`}
    >
      <div
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-150 ${
          active ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
