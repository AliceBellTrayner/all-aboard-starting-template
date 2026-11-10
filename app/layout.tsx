import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LaunchPad",
  description: "A mobile-first onboarding journey for new starters (mock data).",
  applicationName: "LaunchPad",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#9ee3ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
