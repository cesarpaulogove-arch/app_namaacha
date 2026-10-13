
import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-background">
      <AppHeader />

      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-4 pb-6 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}

