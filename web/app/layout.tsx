import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Universo de Cantores | Kits de Ensaio e Técnica Vocal",
    template: "%s | Universo de Cantores"
  },
  // --- AQUI ESTÁ A NOVA DESCRIÇÃO ---
  description: "Aprenda a cantar com excelência. O Universo de Cantores oferece Kits de Ensaio gratuitos com divisão de vozes (Soprano, Contralto, Tenor e Baixo), clássicos da Harpa Cristã e dicas práticas de técnica vocal. Um espaço feito para impulsionar ministérios de louvor e corais.",
  
  keywords: ["Kits de Ensaio", "Corais", "Gospel", "Soprano", "Contralto", "Tenor", "Técnica Vocal", "Aula de Canto", "Harpa Cristã", "Backing Vocal"],
  authors: [{ name: "Felipe Rodrigues" }],
  openGraph: {
    title: "Universo de Cantores",
    description: "Kits de Ensaio, Harpa Cristã e Técnica Vocal para transformar seu ministério.",
    url: "https://universodecantores.com.br",
    siteName: "Universo de Cantores",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  verification: {
    // SEU CÓDIGO DO GOOGLE
    google: "uspCJ1O4-1M5HWluwl8-9iFDo1hFwFBGLK8Tie6urUk", 
  },
};

// --- A FUNÇÃO PRINCIPAL (ESSENCIAL PARA O SITE FUNCIONAR) ---
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