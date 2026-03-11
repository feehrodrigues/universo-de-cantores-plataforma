'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, Clock, AlertCircle } from 'lucide-react';

interface PaymentResponse {
  success: boolean;
  purchase: {
    id: string;
    amount: number;
    amountFormatted: string;
    plan: {
      name: string;
      lessons: number;
      duration: string;
    };
    deadline: string;
  };
  pix: {
    transactionId: string;
    qrCode: string;
    expiresAt: string;
  };
}

const PixPaymentComponent = ({ purchaseId }: { purchaseId: string }) => {
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'pending' | 'checking' | 'completed' | 'expired'>('pending');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch payment details
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(`/api/student/payment/status?purchaseId=${purchaseId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          setStatus('completed');
        } else if (data.status === 'expired') {
          setStatus('expired');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment:', error);
        setLoading(false);
      }
    };

    fetchPayment();
  }, [purchaseId]);

  // Poll payment status every 5 seconds
  useEffect(() => {
    if (status === 'completed' || status === 'expired') return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/student/payment/status?purchaseId=${purchaseId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          setStatus('completed');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [purchaseId, status]);

  // Countdown timer
  useEffect(() => {
    if (!paymentData) return;
    
    const deadline = new Date(paymentData.purchase.deadline).getTime();
    
    const calculateRemaining = () => {
      const now = new Date().getTime();
      const remaining = deadline - now;
      
      if (remaining <= 0) {
        setStatus('expired');
        setTimeRemaining(0);
        return;
      }
      
      setTimeRemaining(remaining);
    };

    calculateRemaining();
    const timer = setInterval(calculateRemaining, 1000);
    return () => clearInterval(timer);
  }, [paymentData]);

  const copyToClipboard = async () => {
    if (!paymentData?.pix.qrCode) return;
    
    try {
      await navigator.clipboard.writeText(paymentData.pix.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7732A6]"></div>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <Check className="text-green-600" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">Pagamento Confirmado! 🎉</h2>
        <p className="text-green-700 mb-6">
          Seu pagamento foi processado com sucesso. Você já pode começar suas aulas!
        </p>
        <a
          href="/dashboard"
          className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all"
        >
          Ir para Dashboard
        </a>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <AlertCircle className="text-red-600" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-red-900 mb-2">Prazo Expirado</h2>
        <p className="text-red-700 mb-6">
          O prazo para realizar este pagamento foi excedido. Gere um novo link para pagar.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
        >
          Gerar Novo Pagamento
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Payment Info Card */}
      <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)] mb-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-[var(--foreground-muted)] font-bold mb-1">PLANO</p>
            <p className="text-2xl font-black text-[var(--foreground)]">{paymentData?.purchase.plan.name}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)] font-bold mb-1">VALOR</p>
            <p className="text-2xl font-black text-[#7732A6]">{paymentData?.purchase.amountFormatted}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)] font-bold mb-1">AULAS</p>
            <p className="text-2xl font-black text-blue-600">{paymentData?.purchase.plan.lessons}</p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-gradient-to-br from-[#7732A6]/5 to-[#F252BA]/5 rounded-2xl p-8 shadow-sm border-2 border-[#7732A6]/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-[var(--foreground)] mb-2">Escaneie com o seu App do Banco</h2>
          <p className="text-[var(--foreground-muted)] font-bold mb-4">
            Use o app do seu banco para fazer a leitura do QR code abaixo
          </p>

          {/* Timer */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-full font-bold text-sm mb-6">
            <Clock size={16} />
            Expira em: {formatTime(timeRemaining)}
          </div>
        </div>

        {/* QR Code Display */}
        <div className="bg-[var(--card-bg)] rounded-xl p-6 mb-6 border-2 border-[var(--card-border)]">
          <div className="aspect-square bg-[var(--background-secondary)] rounded-lg flex items-center justify-center mb-4">
            {/* In production, replace with actual QR code image */}
            {paymentData?.pix.qrCode && (
              <div className="text-center text-[var(--foreground-muted)]">
                <p className="font-mono text-xs break-all p-4">
                  {paymentData.pix.qrCode.substring(0, 50)}...
                </p>
              </div>
            )}
          </div>

          {/* Copy to Clipboard Button */}
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90 transition-all"
          >
            {copied ? (
              <>
                <Check size={20} />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={20} />
                Copiar Código PIX
              </>
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <h3 className="font-bold text-[var(--foreground)]">Como Pagar:</h3>
          <ol className="space-y-2 text-sm text-[var(--foreground-muted)] font-bold">
            <li>1. Abra o app do seu banco</li>
            <li>2. Escolha a opção "PIX"</li>
            <li>3. Escaneie o QR code acima ou copie o código</li>
            <li>4. Confirme o pagamento de {paymentData?.purchase.amountFormatted}</li>
          </ol>
        </div>
      </div>

      {/* Support Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900 font-bold">
          💡 Dúvida? Entre em contato via WhatsApp para suporte imediato.
        </p>
      </div>
    </div>
  );
};

export default PixPaymentComponent;
