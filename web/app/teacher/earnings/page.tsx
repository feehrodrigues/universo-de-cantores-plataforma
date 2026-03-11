'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { DollarSign, TrendingUp, Loader, BarChart3 } from 'lucide-react';

interface MonthlyData {
  month: string;
  revenue: number;
  classCount: number;
}

interface EarningsData {
  currentMonth: {
    classes: number;
    revenue: number;
    revenueFormatted: string;
  };
  lastMonth: {
    classes: number;
    revenue: number;
    revenueFormatted: string;
  };
  totals: {
    classes: number;
    revenue: number;
    revenueFormatted: string;
    averagePerClass: number;
  };
  monthlyBreakdown: MonthlyData[];
  commissionRate: number;
}

export default function TeacherEarningsPage() {
  const { user } = useUser();
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch('/api/teacher/earnings');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEarnings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={32} />
            <h1 className="text-5xl font-black">Meus Ganhos</h1>
          </div>
          <p className="text-lg opacity-90">Acompanhe suas comissões e desempenho</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {data && (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* This Month */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-lg font-bold opacity-90 mb-2">Este Mês</h2>
                <p className="text-5xl font-black mb-4">{data.currentMonth.revenueFormatted}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white border-opacity-20">
                  <div>
                    <p className="text-sm opacity-80">Aulas Completadas</p>
                    <p className="text-2xl font-bold">{data.currentMonth.classes}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Média por Aula</p>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(
                        data.currentMonth.classes > 0
                          ? data.currentMonth.revenue / data.currentMonth.classes
                          : 0
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Month */}
              <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
                <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Mês Passado</h2>
                <p className="text-5xl font-black text-[var(--foreground)] mb-4">{data.lastMonth.revenueFormatted}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Aulas Completadas</p>
                    <p className="text-2xl font-bold text-[var(--foreground)]">{data.lastMonth.classes}</p>
                  </div>
                  <div>
                    {data.currentMonth.revenue > data.lastMonth.revenue && (
                      <div className="text-green-600 font-bold flex items-center gap-1">
                        <TrendingUp size={20} />
                        {(
                          ((data.currentMonth.revenue - data.lastMonth.revenue) /
                            data.lastMonth.revenue) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
                <p className="text-sm text-[var(--foreground-muted)] font-bold mb-2">Total Ganho</p>
                <p className="text-3xl font-black text-green-600">{data.totals.revenueFormatted}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
                <p className="text-sm text-[var(--foreground-muted)] font-bold mb-2">Total de Aulas</p>
                <p className="text-3xl font-black text-blue-600">{data.totals.classes}</p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
                <p className="text-sm text-[var(--foreground-muted)] font-bold mb-2">Média por Aula</p>
                <p className="text-3xl font-black text-[#7732A6]">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(data.totals.averagePerClass)}
                </p>
              </div>
              <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
                <p className="text-sm text-[var(--foreground-muted)] font-bold mb-2">Taxa de Comissão</p>
                <p className="text-3xl font-black text-orange-600">{data.commissionRate}%</p>
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
              <h2 className="text-2xl font-black text-[var(--foreground)] mb-6 flex items-center gap-2">
                <BarChart3 className="text-blue-600" size={28} />
                Histórico Últimos 12 Meses
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {data.monthlyBreakdown.map((month, index) => {
                  const maxRevenue = Math.max(...data.monthlyBreakdown.map((m) => m.revenue));
                  const heightPercent =
                    maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;

                  return (
                    <div key={index} className="flex flex-col items-center justify-end gap-2">
                      <div className="text-right">
                        <p className="text-xs font-bold text-[var(--foreground-muted)]">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(month.revenue)}
                        </p>
                      </div>
                      <div className="w-full bg-[var(--background-secondary)] rounded-t-lg max-h-48 relative group">
                        <div
                          className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:shadow-lg"
                          style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 group-hover:opacity-100 bg-black bg-opacity-5 rounded-t-lg flex items-center justify-center">
                          <div className="bg-gray-900 text-white px-3 py-2 rounded text-xs font-bold whitespace-nowrap">
                            {month.classCount} aulas
                          </div>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-[var(--foreground-muted)] text-center">{month.month}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Card */}
            <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
              <p className="font-bold text-blue-900 mb-3">💰 Como Funciona o Pagamento?</p>
              <ul className="space-y-2 text-blue-700 font-bold text-sm">
                <li>✓ Você recebe {data.commissionRate}% do valor de cada aula</li>
                <li>✓ Os pagamentos são processados toda semana</li>
                <li>✓ Transferências via PIX direto para sua conta</li>
                <li>✓ Acesso ao extrato completo neste painel</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
