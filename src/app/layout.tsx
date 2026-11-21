import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "BanterBox — Two Players. Zero Chill.",
  description: "Ridiculously fun mini-games for you and your favorite person. Try Guess the Number, explore upcoming games and join the BanterBox early-access list.",
  openGraph: { title: "BanterBox — Two Players. Zero Chill.", description: "Good games. Better company. Try a mini-game and join the early-access list.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body className={jakarta.variable}>{children}</body></html>;
}
