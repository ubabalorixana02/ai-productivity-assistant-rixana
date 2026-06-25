import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-background px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="text-sm font-medium text-muted-foreground">AI Workplace Productivity Assistant</div>
          </header>
          <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
