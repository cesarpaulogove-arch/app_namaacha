import { AppShell } from "@/components/layout/AppShell";
import { PortalGuard } from "@/components/auth/PortalGuard";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalGuard>
      <AppShell>{children}</AppShell>
    </PortalGuard>
  );
}