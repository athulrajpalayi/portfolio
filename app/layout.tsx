import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";
import { ClientEffects } from "@/components/motion/client-effects";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Athulraj Palayi | Systems Modernization Portfolio",
  description:
    "Premium portfolio platform for Athulraj Palayi, focused on enterprise operations, systems modernization, cyber-aware delivery, and AI-enabled workflow design.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ClientEffects />
        {children}
      </body>
    </html>
  );
}
