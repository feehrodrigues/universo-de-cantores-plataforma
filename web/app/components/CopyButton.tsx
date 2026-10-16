'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label: string;
}

export default function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] hover:border-[#7732A6] transition text-sm"
    >
      {copied ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <Copy size={16} className="text-[var(--foreground-muted)] group-hover:text-[#7732A6]" />
      )}
      <span className="text-[var(--foreground)]">
        {copied ? 'Copiado!' : label}
      </span>
    </button>
  );
}
