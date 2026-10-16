'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { TrendingUp, Calendar, Zap, Target, BarChart3 } from 'lucide-react';

export default function Evolution() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/student/evolution')
        .then((r) => r.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        });
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (!user) {
    redirect('/login');
  }

  if (!stats) {
    return <div className="p-8">Erro ao carregar evolução</div>;
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[var(--foreground)] mb-2">Sua Evolução</h1>
        <p className="text-[var(--foreground-muted)] font-bold">
          Acompanhe seu desenvolvimento vocal ao longo do tempo
        </p>
      </div>

      {/* ESTATÍSTICAS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg text-[#7732A6]">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded">
              {stats.trends.structure ? `+${stats.trends.structure}` : '+0'}
            </span>
          </div>
          <p className="text-[var(--foreground-muted)] font-bold text-sm mb-2">Aulas Frequentadas</p>
          <p className="text-3xl font-black text-[var(--foreground)]">{stats.classesCompleted}</p>
          <p className="text-xs text-slate-400 font-bold mt-2">Total de aulas concluídas</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded">
              {stats.trends.modeling ? `+${stats.trends.modeling}` : '+0'}
            </span>
          </div>
          <p className="text-[var(--foreground-muted)] font-bold text-sm mb-2">Nota Técnica</p>
          <p className="text-3xl font-black text-[var(--foreground)]">{stats.averageGrade}</p>
          <p className="text-xs text-slate-400 font-bold mt-2">Média geral</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <Zap size={20} />
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded">
              {stats.trends.structure ? `+${stats.trends.structure}` : '+0'}
            </span>
          </div>
          <p className="text-[var(--foreground-muted)] font-bold text-sm mb-2">Estrutura Vocal</p>
          <p className="text-3xl font-black text-[var(--foreground)]">{stats.averageStructure}</p>
          <p className="text-xs text-slate-400 font-bold mt-2">Média geral</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Target size={20} />
            </div>
            <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded">
              {stats.trends.expression ? `+${stats.trends.expression}` : '+0'}
            </span>
          </div>
          <p className="text-[var(--foreground-muted)] font-bold text-sm mb-2">Expressão</p>
          <p className="text-3xl font-black text-[var(--foreground)]">{stats.averageExpression}</p>
          <p className="text-xs text-slate-400 font-bold mt-2">Média geral</p>
        </div>
      </div>

      {/* GRÁFICO DE EVOLUÇÃO */}
      <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)] mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-3">
            <BarChart3 size={28} className="text-[#7732A6]" />
            Progresso ao Longo do Tempo
          </h2>
          <select className="px-4 py-2 rounded-lg border border-[var(--card-border)] font-bold text-[var(--foreground-muted)] bg-[var(--card-bg)]">
            <option>Últimos 3 meses</option>
            <option>Últimos 6 meses</option>
            <option>Últimas 12 meses</option>
          </select>
        </div>

        {/* GRÁFICO SIMULADO */}
        <div className="space-y-6">
          {[{ label: 'Estrutura', current: 7.5, previous: 6.0, color: 'bg-blue-500' },
            { label: 'Modelagem', current: 8.0, previous: 7.2, color: 'bg-green-500' },
            { label: 'Expressão', current: 8.5, previous: 7.0, color: 'bg-amber-500' },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-black text-[var(--foreground)]">{metric.label}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--foreground-muted)]">
                    {metric.previous} <span className="text-slate-400">→</span> {metric.current}
                  </span>
                  <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded">
                    +{(metric.current - metric.previous).toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                <div
                  className={`h-full ${metric.color} rounded-lg transition-all duration-500`}
                  style={{ width: `${(metric.current / 10) * 100}%` }}
                ></div>
                <div
                  className="absolute top-0 h-full border-r-2 border-slate-400 opacity-50"
                  style={{ left: `${(metric.previous / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* METAS E OBJETIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Objetivo Geral */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-[#7732A6]/30">
          <h3 className="text-xl font-black text-[var(--foreground)] mb-4">📌 Seu Objetivo Geral</h3>
          <div className="bg-[var(--card-bg)] rounded-lg p-4 mb-6 border-l-4 border-[#7732A6]">
            <p className="font-bold text-[var(--foreground-muted)] leading-relaxed">
              Dominar técnicas de belting e expressão emocional para cantar com confiança em qualquer situação
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl font-black text-[#7732A6] mt-1">✓</span>
              <div>
                <p className="font-black text-[var(--foreground)]">Técnica de Belting</p>
                <p className="text-sm text-[var(--foreground-muted)]">Progresso: 85%</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl font-black text-amber-600 mt-1">●</span>
              <div>
                <p className="font-black text-[var(--foreground)]">Expressão Emocional</p>
                <p className="text-sm text-[var(--foreground-muted)]">Progresso: 65%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
          <h3 className="text-xl font-black text-[var(--foreground)] mb-4">🎯 Próximos Passos</h3>

          <div className="space-y-4">
            <div className="bg-[var(--card-bg)] rounded-lg p-4 border-l-4 border-green-600">
              <p className="font-bold text-[var(--foreground)] mb-1">Abril</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                Aprofundar a ressonância frontal e trabalhar dinâmicas expressivas
              </p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-lg p-4 border-l-4 border-blue-300">
              <p className="font-bold text-[var(--foreground)] mb-1">Maio</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                Preparação para apresentação ao vivo
              </p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-lg p-4 border-l-4 border-slate-300">
              <p className="font-bold text-[var(--foreground)] mb-1">Junho</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                Consolidação de técnicas e recital
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMENDAÇÕES */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
        <h3 className="text-xl font-black text-[var(--foreground)] mb-4">💡 Recomendações Personalizadas</h3>
        <ul className="space-y-3 font-bold text-[var(--foreground-muted)]">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-lg">→</span>
            Continue praticando os exercícios de respiração diariamente (15 min)
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-lg">→</span>
            Aumente as aulas de expressão para potencializar seu desenvolvimento emocional
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-lg">→</span>
            Considere aulas extras de modelagem para acelerar ainda mais seu progresso
          </li>
        </ul>
      </div>
    </div>
  );
}
