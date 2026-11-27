import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppShell } from "@/components/app-shell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Jay Ambe E-Rickshaw | Billing & Management System",
  description:
    "Dealership management, GST invoicing, and RTO documentation for Jay Ambe E-Rickshaw, Mau, Uttar Pradesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${outfit.variable}`}>
      <body className="font-outfit antialiased bg-slate-950 text-slate-50 min-h-screen">
        <AppShell>
          {children}
        </AppShell>
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
