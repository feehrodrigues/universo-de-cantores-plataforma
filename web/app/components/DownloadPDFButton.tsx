"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface DownloadPDFButtonProps {
  classId: string;
}

export default function DownloadPDFButton({ classId }: DownloadPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Abrir o HTML em uma nova janela e imprimir como PDF
      const printWindow = window.open(`/api/reports/${classId}/pdf`, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
      Baixar PDF
    </button>
  );
}
