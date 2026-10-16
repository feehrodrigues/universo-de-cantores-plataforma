"use client";

import { useEffect } from "react";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  className?: string;
}

// Client ID do Google AdSense - configure no .env
// NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX

export default function AdSense({ 
  adSlot, 
  adFormat = "auto", 
  style,
  className = ""
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) {
    // Em desenvolvimento, mostrar placeholder
    if (process.env.NODE_ENV === "development") {
      return (
        <div 
          className={`bg-[var(--background-secondary)] border border-dashed border-[var(--card-border)] rounded-xl p-6 text-center ${className}`}
          style={style}
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            📢 Espaço para AdSense
          </p>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Configure NEXT_PUBLIC_ADSENSE_CLIENT_ID
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}

// Componente para anúncio no artigo (entre parágrafos)
export function InArticleAd({ adSlot }: { adSlot: string }) {
  return (
    <div className="my-8">
      <AdSense 
        adSlot={adSlot} 
        adFormat="fluid" 
        className="text-center"
      />
    </div>
  );
}

// Componente para anúncio na sidebar
export function SidebarAd({ adSlot }: { adSlot: string }) {
  return (
    <div className="sticky top-24">
      <AdSense 
        adSlot={adSlot} 
        adFormat="vertical"
        style={{ minHeight: "250px" }}
      />
    </div>
  );
}

// Componente para banner horizontal (header/footer)
export function BannerAd({ adSlot }: { adSlot: string }) {
  return (
    <div className="w-full py-4">
      <AdSense 
        adSlot={adSlot} 
        adFormat="horizontal"
        style={{ minHeight: "90px" }}
      />
    </div>
  );
}
