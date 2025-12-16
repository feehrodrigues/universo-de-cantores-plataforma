import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importando a fonte
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Universo de Cantores",
  description: "A maior biblioteca de kits vocais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  );
}