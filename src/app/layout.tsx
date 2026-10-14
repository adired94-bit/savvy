import type { Metadata, Viewport } from "next";
import { Heebo, Inter } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { QueryProvider } from "@/components/providers/query-provider";
import { ACTIVE_MARKET } from "@/config/market";
import "./globals.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Savvy · הסנגור הפיננסי שלך",
  description: "Savvy סורק חשבונות, מזהה חיובי יתר ומנהל משא ומתן בשמך כדי להחזיר לך כסף.",
};

export const viewport: Viewport = {
  themeColor: "#0B0F17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = ACTIVE_MARKET.locale.split("-")[0];
  return (
    <html lang={lang} dir={ACTIVE_MARKET.dir} className={`${heebo.variable} ${inter.variable}`}>
      <body className="font-sans">
        <QueryProvider>
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
