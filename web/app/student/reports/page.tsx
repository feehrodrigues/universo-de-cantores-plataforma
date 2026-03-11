'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Download, Share2, ChevronLeft, Loader } from 'lucide-react';

export default function Reports() {
  const { user, isLoaded } = useUser();
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/student/reports')
        .then((r) => r.json())
        .then((data) => {
          setReports(data);
          if (data.length > 0) setSelectedReport(data[0]);
          setLoading(false);
        });
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <Loader className="animate-spin text-[#7732A6]" size={40} />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <Loader className="animate-spin text-[#7732A6]" size={40} />
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  if (reports.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-5xl font-black text-[var(--foreground)] mb-2">Relatórios</h1>
        <p className="text-[var(--foreground-muted)] font-bold text-lg mb-8">
          Seus relatórios detalhados aparecerão aqui após cada aula
        </p>
        <div className="bg-slate-50 rounded-2xl p-12 text-center border border-[var(--card-border)]">
          <Calendar size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-[var(--foreground)] mb-2">Nenhum relatório ainda</h3>
          <p className="text-[var(--foreground-muted)] font-bold">Complete suas aulas para receber feedback detalhado</p>
        </div>
      </div>
    );
  }

  const report = selectedReport;
  const structureGrade = report?.structureEvaluation?.grade || 0;
  const modelingGrade = report?.modelingEvaluation?.grade || 0;
  const expressionGrade = report?.expressionEvaluation?.grade || 0;
  const avgGrade = (structureGrade + modelingGrade + expressionGrade) / 3;

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl font-black text-[var(--foreground)] mb-2">Relatórios E.M.E</h1>
        <p className="text-[var(--foreground-muted)] font-bold text-lg">
          Análise detalhada da sua evolução vocal
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* LISTA */}
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)] mb-4">Seus Relatórios</h2>
          <div className="space-y-2">
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedReport?.id === r.id
                    ? 'bg-purple-100 border-[#7732A6]/30'
                    : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[#7732A6]/30'
                }`}
              >
                <p className="font-black text-[var(--foreground)] text-sm">{r.class.title}</p>
                <p className="text-xs text-[var(--foreground-muted)] font-bold">
                  {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* DETALHES */}
        <div className="col-span-2 space-y-6">
          {/* HEADER */}
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-[var(--foreground)] mb-2">{report?.class.title}</h2>
              <p className="text-[var(--foreground-muted)] font-bold">
                com {report?.class.instructor?.name} • {new Date(report?.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* NOTAS E.M.E */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Estrutura', grade: structureGrade, color: 'purple' },
                { label: 'Modelagem', grade: modelingGrade, color: 'blue' },
                { label: 'Expressão', grade: expressionGrade, color: 'pink' },
              ].map((item) => (
                <div key={item.label} className="p-6 bg-slate-50 rounded-xl text-center">
                  <p className="text-sm font-black text-[var(--foreground-muted)] mb-2">{item.label}</p>
                  <div className={`text-4xl font-black text-${item.color}-600 mb-2`}>
                    {item.grade.toFixed(1)}
                  </div>
                  <div className="w-full bg-slate-300 rounded-full h-2">
                    <div
                      className={`bg-${item.color}-600 h-2 rounded-full`}
                      style={{ width: `${(item.grade / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* MÉDIA */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
              <p className="text-sm font-black text-[var(--foreground-muted)] mb-1">Média Geral</p>
              <p className="text-3xl font-black text-[var(--foreground)]">{avgGrade.toFixed(1)} / 10</p>
            </div>
          </div>

          {/* ANÁLISE TÉCNICA */}
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
            <h3 className="text-2xl font-black text-[var(--foreground)] mb-6">📊 Análise Técnica</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-black text-[var(--foreground)] mb-3">Pontos Fortes</h4>
                <ul className="space-y-2">
                  {(report?.structureEvaluation?.strengths || 'Evolução contínua').split(',').map((s: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-[var(--foreground-muted)] font-bold text-sm">
                      <span className="text-green-600">✓</span> {s.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-[var(--foreground)] mb-3">Pontos a Melhorar</h4>
                <ul className="space-y-2">
                  {(report?.structureEvaluation?.areasForImprovement || 'Trabalhar ressonância').split(',').map((a: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-[var(--foreground-muted)] font-bold text-sm">
                      <span className="text-amber-600">→</span> {a.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notas Rápidas */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-black text-blue-600 mb-1">ESTRUTURA</p>
                  <p className="text-2xl font-black text-blue-700">{report.vocalTechnique.structure}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-black text-green-600 mb-1">MODELAGEM</p>
                  <p className="text-2xl font-black text-green-700">{report.vocalTechnique.modeling}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs font-black text-amber-600 mb-1">EXPRESSÃO</p>
                  <p className="text-2xl font-black text-amber-700">{report.vocalTechnique.expression}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs font-black text-purple-600 mb-1">GERAL</p>
                  <p className="text-2xl font-black text-purple-700">{report.vocalTechnique.overall}</p>
                </div>
              </div>

              <div className="text-right">
                <button className="text-[#7732A6] hover:opacity-80 font-bold text-sm">
                  Ver Completo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
