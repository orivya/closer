import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Compass, BookOpen, User, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navItems = [
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: BookOpen, label: "Library", path: "/library" },
];

const bottomNavItems = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function ProfileSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="w-[72px] bg-elevated border-r border-border-subtle flex flex-col items-center py-5 flex-shrink-0 max-md:w-14 max-sm:hidden">
      {/* Logo */}
      <Link to="/" className="w-10 h-9 flex items-center justify-center mb-6 group">
        <div className="w-8 h-7 bg-gradient-to-br from-sage-light via-sage to-sage-dark rounded-[75%_25%_65%_35%/60%_40%_60%_40%] relative animate-[breathe_5s_ease-in-out_infinite]">
          <div className="absolute top-[38%] left-[42%] -translate-x-1/2 flex gap-2">
            <div className="w-1 h-1 bg-white/95 rounded-full" />
            <div className="w-0.75 h-0.75 bg-white/90 rounded-full opacity-90" style={{ width: "3px", height: "3px" }} />
          </div>
        </div>
      </Link>

      {/* Main Nav Items */}
      <div className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative w-11 h-11 flex items-center justify-center rounded-[10px] transition-all duration-150 group ${
                isActive
                  ? "bg-sage-subtle text-sage"
                  : "text-text-muted hover:bg-hover hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-[-14px] top-2.5 bottom-2.5 w-[3px] bg-sage rounded-r-sm" />
              )}
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-hover border border-border rounded-md text-xs font-medium text-foreground whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50">
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
              className={`relative w-11 h-11 flex items-center justify-center rounded-[10px] transition-all duration-150 group ${
                isActive
                  ? "bg-sage-subtle text-sage"
                  : "text-text-muted hover:bg-hover hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-[-14px] top-2.5 bottom-2.5 w-[3px] bg-sage rounded-r-sm" />
              )}
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-hover border border-border rounded-md text-xs font-medium text-foreground whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="relative w-11 h-11 flex items-center justify-center rounded-[10px] text-text-muted hover:bg-hover hover:text-foreground transition-all duration-150 group"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-hover border border-border rounded-md text-xs font-medium text-foreground whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-50">
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}
