import type { Metadata, Viewport } from "next";
import "./globals.css";
import ViewportScaler from "./ViewportScaler";

export const metadata: Metadata = {
  title: "Актуальные вопросы гештальт терапии. Конференция.",
  description: "Конференция по актуальным вопросам гештальт терапии. Терапевтическая практика. Современные реалии.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ViewportScaler />
        {children}
      </body>
    </html>
  );
}
