import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import usePathname from "@/stores/usePathname";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  const location = useLocation();
  const setPathname = usePathname((s) => s.setPathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname, setPathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster position="top-center" />
      <main>
        <SidebarTrigger
          className={`md:hidden absolute bottom-3 left-3 p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 hover:text-white size-10`}
        />
        <div className="m-2 p-2">
          <Header />
        </div>
        <div className="m-2 p-2 w-[calc(100dvw-2rem)] md:w-[calc(100dvw-19rem)] *:h-[calc(100dvh-8rem)] overflow-auto flex flex-col">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
