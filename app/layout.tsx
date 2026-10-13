import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Município de Namaacha",
    template: "%s | Município de Namaacha",
  },
  description:
    "Portal digital de serviços do Município de Namaacha.",
  applicationName: "Namaacha Digital",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#087C49",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}