import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, Mic2, Star, Target, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import DownloadPDFButton from "@/app/components/DownloadPDFButton";

export default async function StudentReportView({ params }: { params: Promise<{ classId: string }> }) {
  // A CORREÇÃO ESTÁ AQUI:
  const resolvedParams = await params;
  const classId = resolvedParams.classId;

  const report = await prisma.classReport.findUnique({
    where: { classId: classId },
    include: {
      class: true,
    }
  });

  // buscar avaliações se existirem
  const structure = await prisma.structureEvaluation.findFirst({ where: { classId } });
  const modeling = await prisma.modelingEvaluation.findFirst({ where: { classId } });
  const expression = await prisma.expressionEvaluation.findFirst({ where: { classId } });

  if (!report) redirect("/dashboard");

  return (
    <div className="min-h-screen pb-20 font-sans">
      <div className="bg-slate-900 text-white pt-16 pb-32 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600 rounded-full blur-[100px] opacity-10"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-black text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Voltar ao Dashboard
            </Link>
            <DownloadPDFButton classId={classId} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="bg-purple-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">Relatório de Evolução</span>
              <h1 className="text-4xl md:text-5xl font-black mt-6 tracking-tight">Análise Técnica Vocal</h1>
              <p className="text-slate-400 mt-2 font-bold">{new Date(report.class.scheduledAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-4">
              {/* Radar E.M.E Simplificado */}
              <div className="flex flex-col items-center bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                <span className="text-[10px] font-black text-purple-400 uppercase mb-2">Estrutura</span>
                <span className="text-2xl font-black">{structure ? structure.finalGrade : '—'}</span>
              </div>
              <div className="flex flex-col items-center bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                <span className="text-[10px] font-black text-cyan-400 uppercase mb-2">Modelagem</span>
                <span className="text-2xl font-black">{modeling ? modeling.finalGrade : '—'}</span>
              </div>
              <div className="flex flex-col items-center bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                <span className="text-[10px] font-black text-pink-400 uppercase mb-2">Expressão</span>
                <span className="text-2xl font-black">{expression ? expression.finalGrade : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 gap-8">
          
          {/* RESUMO E TÉCNICA */}
          <section className="bg-[var(--card-bg)] rounded-[3rem] p-10 md:p-14 shadow-xl border border-[var(--card-border)]">
            <div className="mb-12">
              <h3 className="flex items-center gap-3 text-[var(--foreground)] font-black text-xl mb-6">
                <div className="p-2 bg-[var(--background-secondary)] rounded-xl"><CheckCircle2 className="text-purple-600" /></div>
                Resumo da Jornada
              </h3>
              <p className="text-[var(--foreground-muted)] leading-relaxed text-lg font-medium">{report.technicalAnalysis || report.studentObservations || 'Sem análise técnica registrada.'}</p>
            </div>

            <div className="h-px bg-[var(--card-border)] w-full mb-12"></div>

            <div>
              <h3 className="flex items-center gap-3 text-[var(--foreground)] font-black text-xl mb-6">
                <div className="p-2 bg-[var(--background-secondary)] rounded-xl"><Star className="text-purple-600" /></div>
                Observações do Aluno / Tarefa
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">{report.homework || report.studentObservations || 'Sem observações registradas.'}</p>
            </div>
          </section>

          {/* PLANO DE AÇÃO (HIGHLIGHT) */}
          <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-purple-500/20">
            <h3 className="flex items-center gap-3 font-black text-2xl mb-8">
              <Target size={28} /> Plano de Ação: O que treinar?
            </h3>
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 leading-relaxed text-lg font-bold">
              {report.nextFocusAreas || 'Sem plano de ação definido.'}
            </div>
            <div className="mt-10 flex flex-col md:flex-row gap-4">
                <Link href="/biblioteca" className="flex-1 bg-white text-slate-900 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                    Acessar Biblioteca de Kits <ChevronRight size={18} />
                </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}