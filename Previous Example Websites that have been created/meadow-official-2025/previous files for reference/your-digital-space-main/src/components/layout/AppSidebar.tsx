import { NavLink, useLocation } from "react-router-dom";
import { 
  MessageSquare, 
  Compass, 
  BookOpen, 
  Settings, 
  User,
  LogOut,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: BookOpen, label: "Library", path: "/library" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 flex flex-col border-r border-subtle bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-subtle">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sage">
          <Sparkles className="h-5 w-5 text-background" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-2 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "group flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                isActive 
                  ? "bg-surface text-sage" 
                  : "text-muted-foreground hover:bg-surface hover:text-foreground"
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col items-center gap-2 border-t border-subtle py-4">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "group flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                isActive 
                  ? "bg-surface text-sage" 
                  : "text-muted-foreground hover:bg-surface hover:text-foreground"
              )}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-destructive"
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
