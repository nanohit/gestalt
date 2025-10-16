import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Актуальные вопросы гештальт терапии. Конференция.",
  description: "Конференция по актуальным вопросам гештальт терапии. Терапевтическая практика. Современные реалии.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
