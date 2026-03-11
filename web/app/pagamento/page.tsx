'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CreditCard, Loader } from 'lucide-react';
import PixPaymentComponent from '@/app/components/PixPaymentComponent';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  lessonsIncluded: number;
  description?: string;
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentPurchaseId, setCurrentPurchaseId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Fetch payment plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // In real scenario, create an API endpoint to get active plans
        // For now, showing sample plans matching the seed data
        setPlans([
          {
            id: 'plan-1',
            name: 'Aula Avulsa Online',
            price: 50,
            duration: '1 aula',
            lessonsIncluded: 1,
            description: 'Uma aula individual online com 60 minutos',
          },
          {
            id: 'plan-2',
            name: 'Plano Mensal Online',
            price: 160,
            duration: 'Mensal',
            lessonsIncluded: 4,
            description: '4 aulas de 60 min/mês com plano personalizado',
          },
          {
            id: 'plan-3',
            name: 'Programa Belting 3M',
            price: 450,
            duration: '3 meses',
            lessonsIncluded: 12,
            description: '12 aulas em 3 meses com especialista em belting',
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError('Erro ao carregar planos');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const initiatePurchase = async (planId: string) => {
    if (status !== 'authenticated') {
      window.location.href = '/login';
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/student/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentPlanId: planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar pagamento');
      }

      // Show PIX payment component
      setCurrentPurchaseId(data.purchase.id);
      setSelectedPlan(null); // Hide plan selection
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--background)]">
        <h1 className="text-3xl font-black text-[var(--foreground)]">Acesso Restrito</h1>
        <p className="text-lg text-[var(--foreground-muted)]">Faça login para comprar aulas</p>
        <Link
          href="/login"
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  // Show PIX payment if purchase initiated
  if (currentPurchaseId) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setCurrentPurchaseId(null);
              setSelectedPlan(null);
            }}
            className="mb-6 px-4 py-2 text-[#7732A6] font-bold hover:opacity-80"
          >
            ← Voltar
          </button>
          <PixPaymentComponent purchaseId={currentPurchaseId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-lg text-[var(--foreground-muted)] font-bold">
            Aulas personalizadas de técnica vocal
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-bold">
            {error}
          </div>
        )}

        {/* Plans Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)] hover:shadow-lg hover:border-purple-300 transition-all flex flex-col"
              >
                {/* Plan Info */}
                <div className="mb-8 flex-1">
                  <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{plan.name}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] font-bold mb-6">{plan.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-muted)] font-bold">Valor:</span>
                      <span className="text-3xl font-black text-purple-600">
                        R$ {plan.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-muted)] font-bold">Aulas:</span>
                      <span className="text-2xl font-black text-blue-600">
                        {plan.lessonsIncluded}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-muted)] font-bold">Duração:</span>
                      <span className="font-bold text-[var(--foreground)]">{plan.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => initiatePurchase(plan.id)}
                  disabled={processing && selectedPlan === plan.id}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-black transition-all ${
                    selectedPlan === plan.id && processing
                      ? 'bg-gray-400 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {processing && selectedPlan === plan.id ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Comprar Agora
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
          <p className="text-lg font-bold text-blue-900 mb-4">
            💳 Pagamento 100% Seguro via PIX
          </p>
          <p className="text-sm text-blue-700 font-bold">
            Seu pagamento é processado instantaneamente.
            <br />
            Acesso às aulas é liberado imediatamente após confirmação.
          </p>
        </div>
      </div>
    </div>
  );
}
