'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Download, FolderOpen, Lock, LogIn } from 'lucide-react';
import SupportModal from './SupportModal';
import Link from 'next/link';

interface ProtectedDownloadButtonProps {
  type: 'drive' | 'sheet';
  url?: string;
  itemName?: string;
  className?: string;
}

export default function ProtectedDownloadButton({ 
  type, 
  url, 
  itemName,
  className = ''
}: ProtectedDownloadButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  if (!url) return null;

  const handleClick = () => {
    if (!isSignedIn) {
      // Redirecionar para login
      return;
    }
    // Mostrar modal de apoio
    setPendingUrl(url);
    setShowModal(true);
  };

  const handleContinue = () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank');
    }
    setPendingUrl(null);
  };

  const buttonConfig = {
    drive: {
      icon: FolderOpen,
      label: 'Acessar Drive',
      bgClass: 'bg-[#7732A6] hover:bg-[#5f2787]',
    },
    sheet: {
      icon: Download,
      label: 'Baixar Partitura',
      bgClass: 'bg-cyan-500 hover:bg-cyan-600',
    },
  };

  const config = buttonConfig[type];
  const Icon = config.icon;

  // Ainda carregando info do usuário
  if (!isLoaded) {
    return (
      <button 
        disabled
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold opacity-50 ${config.bgClass} ${className}`}
      >
        <Icon size={20} />
        {config.label}
      </button>
    );
  }

  // Usuário não logado
  if (!isSignedIn) {
    return (
      <Link
        href="/login"
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-semibold transition ${className}`}
      >
        <Lock size={18} />
        Faça login para acessar
      </Link>
    );
  }

  // Usuário logado
  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition ${config.bgClass} ${className}`}
      >
        <Icon size={20} />
        {config.label}
      </button>

      <SupportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onContinue={handleContinue}
        itemName={itemName}
      />
    </>
  );
}
