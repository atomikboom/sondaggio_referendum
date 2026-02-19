import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "@/components/QuizProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Referendum Giustizia 2026 - Quiz",
  description: "Scopri la tua propensione sulla riforma della giustizia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
