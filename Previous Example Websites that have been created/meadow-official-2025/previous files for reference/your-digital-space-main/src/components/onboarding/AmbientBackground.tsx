import { cn } from "@/lib/utils";

interface AmbientBackgroundProps {
  visible?: boolean;
}

export function AmbientBackground({ visible = false }: AmbientBackgroundProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-0 transition-opacity duration-[2000ms]",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className="absolute w-[800px] h-[800px] bg-sage rounded-full blur-[100px] opacity-[0.08] -top-[300px] -left-[300px] animate-drift-1"
      />
      <div
        className="absolute w-[500px] h-[500px] bg-sage-dark rounded-full blur-[100px] opacity-[0.08] -bottom-[150px] -right-[150px] animate-drift-2"
      />
    </div>
  );
}
