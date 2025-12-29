import { Outlet } from "react-router-dom";

export function AppLayout() {
  // Pages handle their own navigation (NavRail or ChatSidebar)
  // AppLayout just provides the wrapper for protected routes
  return <Outlet />;
}
