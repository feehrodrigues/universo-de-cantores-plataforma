import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import "./globals.css";
import { Providers } from "./providers";
import GlobalBackground from "./components/GlobalBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://universodecantores.com.br'),
  title: {
    default: "Universo de Cantores | Kits de Ensaio e Técnica Vocal",
    template: "%s | Universo de Cantores"
  },
  // --- AQUI ESTÁ A NOVA DESCRIÇÃO ---
  description: "Aprenda a cantar com excelência. O Universo de Cantores oferece Kits de Ensaio gratuitos com divisão de vozes (Soprano, Contralto, Tenor e Baixo), clássicos da Harpa Cristã e dicas práticas de técnica vocal. Um espaço feito para impulsionar ministérios de louvor e corais.",
  
  keywords: ["Kits de Ensaio", "Corais", "Gospel", "Soprano", "Contralto", "Tenor", "Técnica Vocal", "Aula de Canto", "Harpa Cristã", "Backing Vocal", "Cantatas de Natal", "Cantatas de Páscoa"],
  authors: [{ name: "Felipe Rodrigues" }],
  creator: "Felipe Rodrigues",
  publisher: "Universo de Cantores",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        alt: "Universo de Cantores - Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universo de Cantores',
    description: 'Kits de Ensaio, Harpa Cristã e Técnica Vocal para transformar seu ministério.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://universodecantores.com.br',
  },
  verification: {
    // SEU CÓDIGO DO GOOGLE
    google: "uspCJ1O4-1M5HWluwl8-9iFDo1hFwFBGLK8Tie6urUk", 
  },
};

// --- A FUNÇÃO PRINCIPAL (ESSENCIAL PARA O SITE FUNCIONAR) ---
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <ClerkProvider
      localization={ptBR}
      appearance={{
        variables: {
          colorPrimary: "#7732A6",
          colorText: "#1a1a1a",
          colorTextSecondary: "#64748b",
          borderRadius: "1rem",
        },
      }}
    >
      <html lang="pt-br" suppressHydrationWarning>
        <head>
          {/* Google AdSense Script */}
          {adsenseClientId && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3303012659819695`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
        
          {/* Structured Data - Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Universo de Cantores",
                "url": "https://universodecantores.com.br",
                "logo": "https://universodecantores.com.br/logo.png",
                "description": "Kits de Ensaio, Harpa Cristã e Técnica Vocal para transformar seu ministério.",
                "sameAs": [
                  "https://www.youtube.com/@universodecantores",
                  "https://www.instagram.com/universodecantores"
                ],
                "founder": {
                  "@type": "Person",
                  "name": "Felipe Rodrigues"
                }
            })
          }}
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <Providers>
          <GlobalBackground />
          {children}
        </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}
