import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Compass, BookOpen, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: BookOpen, label: "Library", path: "/library" },
];

const bottomNavItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface NavRailProps {
  className?: string;
}

export function NavRail({ className }: NavRailProps) {
  const location = useLocation();

  return (
    <nav
      className={cn(
        "w-[72px] bg-elevated border-r border-subtle flex flex-col items-center py-5 flex-shrink-0",
        "md:w-[72px] max-md:w-14",
        "hidden xs:flex", // Hidden below 480px, show mobile nav instead
        className
      )}
    >
      {/* Logo */}
      <Link
        to="/"
        className="w-10 h-9 flex items-center justify-center mb-6 cursor-pointer"
      >
        <div
          className="w-8 h-7 relative animate-nav-breathe"
          style={{
            background:
              "linear-gradient(155deg, hsl(var(--sage-light)) 0%, hsl(var(--primary)) 50%, hsl(var(--sage-dark)) 100%)",
            borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
          }}
        >
          <div className="absolute top-[38%] left-[42%] -translate-x-1/2 flex gap-2">
            <div className="w-1 h-1 rounded-full bg-white/95" />
            <div className="w-[3px] h-[3px] rounded-full bg-white/90" />
          </div>
        </div>
      </Link>

      {/* Main Nav Items */}
      <div className="flex flex-col items-center gap-2">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group relative w-11 h-11 flex items-center justify-center rounded-[10px] transition-all duration-150",
                isActive
                  ? "bg-sage-subtle text-sage"
                  : "text-text-muted hover:bg-hover hover:text-foreground active:scale-95"
              )}
            >
              {isActive && (
                <div className="absolute left-[-14px] top-2.5 bottom-2.5 w-[3px] bg-sage rounded-r-sm" />
              )}
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              {/* Tooltip - hidden at 768px and below */}
              <span className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-hover border border-border rounded-sm text-xs font-medium text-foreground whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50 max-md:hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Nav Items */}
      <div className="mt-auto flex flex-col items-center gap-2">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group relative w-11 h-11 flex items-center justify-center rounded-[10px] transition-all duration-150",
                isActive
                  ? "bg-sage-subtle text-sage"
                  : "text-text-muted hover:bg-hover hover:text-foreground active:scale-95"
              )}
            >
              {isActive && (
                <div className="absolute left-[-14px] top-2.5 bottom-2.5 w-[3px] bg-sage rounded-r-sm" />
              )}
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              {/* Tooltip - hidden at 768px and below */}
              <span className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-hover border border-border rounded-sm text-xs font-medium text-foreground whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50 max-md:hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
