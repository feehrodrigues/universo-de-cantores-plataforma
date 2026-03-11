'use client';

import { useState, useEffect } from 'react';
import { X, Youtube, Heart, ExternalLink, CheckCircle, Gift, Copy, Check } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  itemName?: string;
}

export default function SupportModal({ isOpen, onClose, onContinue, itemName }: SupportModalProps) {
  const [step, setStep] = useState<'support' | 'thanks'>('support');
  const [copiedPix, setCopiedPix] = useState(false);

  // Reset quando abre
  useEffect(() => {
    if (isOpen) {
      setStep('support');
      setCopiedPix(false);
    }
  }, [isOpen]);

  const handleYouTubeSubscribe = () => {
    window.open('https://youtube.com/@universodecantores?sub_confirmation=1', '_blank');
  };

  const handleCopyPix = () => {
    // TODO: Colocar a chave PIX real aqui
    navigator.clipboard.writeText('universodecantores@email.com');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleContinue = () => {
    setStep('thanks');
    setTimeout(() => {
      onContinue();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--card-border)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-br from-[#7732A6] to-[#F252BA] p-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          >
            <X size={24} />
          </button>
          
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <Heart size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Ajude o Canal a Crescer! 💜
          </h2>
          <p className="text-white/80 text-sm">
            {itemName ? `Você está acessando: ${itemName}` : 'Continue ajudando nosso trabalho!'}
          </p>
        </div>

        {/* Conteúdo */}
        {step === 'support' ? (
          <div className="p-6 space-y-4">
            {/* YouTube */}
            <button
              onClick={handleYouTubeSubscribe}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-[var(--foreground)] transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <Youtube size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold">Se inscreva no YouTube</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Ajude o canal a crescer — é grátis!
                </p>
              </div>
              <ExternalLink size={18} className="text-[var(--foreground-muted)] group-hover:text-red-500 transition" />
            </button>

            {/* PIX */}
            <button
              onClick={handleCopyPix}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-[var(--foreground)] transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center flex-shrink-0">
                <Gift size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold">Apoie com PIX</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {copiedPix ? '✅ Chave copiada!' : 'Toque para copiar a chave'}
                </p>
              </div>
              {copiedPix ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-[var(--foreground-muted)] group-hover:text-cyan-500 transition" />
              )}
            </button>

            {/* Link para página de doações */}
            <a
              href="/apoie"
              className="block text-center text-sm text-[#7732A6] hover:underline py-2"
            >
              Ver outras formas de apoiar →
            </a>

            {/* Botão de continuar */}
            <div className="pt-4 border-t border-[var(--card-border)]">
              <button
                onClick={handleContinue}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#7732A6] to-[#F252BA] text-white font-bold rounded-full hover:opacity-90 transition"
              >
                Continuar para o Material
              </button>
              <p className="text-xs text-center text-[var(--foreground-muted)] mt-2">
                O acesso é gratuito, mas seu apoio faz a diferença! 💜
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
              Obrigado pelo apoio!
            </h3>
            <p className="text-[var(--foreground-muted)]">
              Redirecionando...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
