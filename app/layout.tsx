import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Município de Namaacha",
  description:
    "Portal digital do Município de Namaacha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}