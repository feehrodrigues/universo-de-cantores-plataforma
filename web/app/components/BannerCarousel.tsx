'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProcessedBanner {
  nome: string;
  desktopUrl: string;
  mobileUrl: string;
  link?: string;
  abrirNovaAba?: boolean;
  altText?: string;
}

interface BannerCarouselProps {
  banners: ProcessedBanner[];
  autoplay?: boolean;
  intervalo?: number; // em segundos
}

export default function BannerCarousel({ 
  banners, 
  autoplay = true, 
  intervalo = 5
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (!autoplay || banners.length <= 1 || isHovered) return;

    const timer = setInterval(goToNext, intervalo * 1000);
    return () => clearInterval(timer);
  }, [autoplay, intervalo, banners.length, isHovered, goToNext]);

  // Se não há banners, não renderiza nada
  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const isExternal = currentBanner.abrirNovaAba || currentBanner.link?.startsWith('http');

  const BannerContent = () => (
    <>
      {/* Formato Medium Rectangle (300x250) - mesmo em desktop e mobile */}
      <div className="relative w-[300px] h-[250px]">
        <Image 
          src={currentBanner.desktopUrl}
          alt={currentBanner.altText || currentBanner.nome || 'Banner promocional'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority={currentIndex === 0}
        />
      </div>
    </>
  );

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner principal */}
      {isExternal ? (
        <a 
          href={currentBanner.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden group"
        >
          <BannerContent />
        </a>
      ) : (
        <Link 
          href={currentBanner.link || '/aulas'}
          className="block overflow-hidden group"
        >
          <BannerContent />
        </Link>
      )}

      {/* Controles de navegação - só aparece se tem mais de 1 banner */}
      {banners.length > 1 && (
        <>
          {/* Setas */}
          <button
            onClick={(e) => { e.preventDefault(); goToPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all opacity-70 hover:opacity-100"
            aria-label="Banner anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); goToNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 hover:scale-110 transition-all opacity-70 hover:opacity-100"
            aria-label="Próximo banner"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicadores (bolinhas) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
