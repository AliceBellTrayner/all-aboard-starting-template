import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Lloyds Banking Group's own typeface is proprietary, so this is a freely
// licensed humanist sans in a similar style.
const brandFont = Nunito_Sans({ subsets: ["latin"], variable: "--font-brand", display: "swap" });

export const metadata: Metadata = {
  title: "HorseShoe by Lloyds Banking Group",
  description: "A welcoming home screen and onboarding journey for new starters.",
  applicationName: "HorseShoe",
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
    <html lang="en-GB" className={brandFont.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
