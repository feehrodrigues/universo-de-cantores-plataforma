import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importando a fonte
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: {
    default: "Universo de Cantores | Kits de Ensaio e Técnica Vocal",
    template: "%s | Universo de Cantores"
  },
  description: "O espaço definitivo para sua evolução vocal. Acesse Kits de Ensaio para corais (Soprano, Contralto, Tenor), aprenda Teoria Musical descomplicada e receba dicas de Técnica Vocal. Feito para coristas, estudantes e ministérios de louvor.",
  keywords: ["Kits de Ensaio", "Corais", "Gospel", "Soprano", "Contralto", "Tenor", "Técnica Vocal", "Aula de Canto", "Harpa Cristã"],
  authors: [{ name: "Felipe Rodrigues" }],
  openGraph: {
    title: "Universo de Cantores",
    description: "Transforme sua voz com Kits de Ensaio gratuitos e dicas de técnica vocal.",
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
    // AQUI ESTÁ O SEU CÓDIGO DO GOOGLE:
    google: "uspCJ1O4-1M5HWluwl8-9iFDo1hFwFBGLK8Tie6urUk", 
  },
};