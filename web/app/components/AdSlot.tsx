'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  // Formatos padrão do Google Ads
  format?: 'leaderboard' | 'rectangle' | 'skyscraper' | 'responsive';
  // ID do slot (para quando tiver múltiplos ads na página)
  slotId?: string;
  // Mostrar placeholder quando não tiver ad real (desenvolvimento)
  showPlaceholder?: boolean;
  // Classe adicional
  className?: string;
}

// Dimensões dos formatos padrão
const AD_SIZES = {
  leaderboard: { width: 728, height: 90, label: '728×90' },
  rectangle: { width: 300, height: 250, label: '300×250' },
  skyscraper: { width: 160, height: 600, label: '160×600' },
  responsive: { width: '100%', height: 'auto', label: 'Responsivo' },
};

export default function AdSlot({ 
  format = 'rectangle', 
  slotId = 'default',
  showPlaceholder = true,
  className = ''
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const size = AD_SIZES[format];

  useEffect(() => {
    // Aqui você pode adicionar o código do Google AdSense quando tiver
    // window.adsbygoogle = window.adsbygoogle || [];
    // window.adsbygoogle.push({});
  }, []);

  // Em produção, isso seria substituído pelo código real do Google Ads
  // Por enquanto, mostra um placeholder profissional
  if (showPlaceholder) {
    return (
      <div 
        ref={adRef}
        className={`relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg overflow-hidden ${className}`}
        style={{ 
          width: typeof size.width === 'number' ? `${size.width}px` : size.width,
          height: typeof size.height === 'number' ? `${size.height}px` : 'auto',
          minHeight: format === 'responsive' ? '90px' : undefined,
          maxWidth: '100%',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <div className="flex items-center gap-2 text-xs font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span>Google Ads</span>
          </div>
          <span className="text-[10px] mt-1 opacity-60">{size.label}</span>
        </div>
        
        {/* Borda sutil indicando área de anúncio */}
        <div className="absolute inset-0 border border-dashed border-gray-300 rounded-lg pointer-events-none opacity-50"></div>
      </div>
    );
  }

  // Container para o ad real do Google
  return (
    <div 
      ref={adRef}
      id={`ad-slot-${slotId}`}
      className={`ad-container ${className}`}
      style={{ 
        width: typeof size.width === 'number' ? `${size.width}px` : size.width,
        height: typeof size.height === 'number' ? `${size.height}px` : 'auto',
        maxWidth: '100%',
      }}
    >
      {/* Aqui será injetado o código do Google AdSense */}
      {/* 
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
    </div>
  );
}

// Componente wrapper para área de anúncios com label
export function AdSection({ 
  children, 
  className = '',
  showLabel = true,
  labelPosition = 'top' as 'top' | 'bottom'
}: { 
  children: React.ReactNode; 
  className?: string;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom';
}) {
  const Label = () => (
    <div className="flex items-center justify-center gap-2">
      <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium select-none">
        Publicidade
      </span>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {showLabel && labelPosition === 'top' && (
        <div className="mb-2">
          <Label />
        </div>
      )}
      
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {children}
      </div>
      
      {showLabel && labelPosition === 'bottom' && (
        <div className="mt-2">
          <Label />
        </div>
      )}
    </div>
  );
}
