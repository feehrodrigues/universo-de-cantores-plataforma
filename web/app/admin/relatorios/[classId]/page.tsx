import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, Star, Target, CheckCircle2, ChevronRight, Mic2 } from "lucide-react";
import Link from "next/link";

export default async function VocalReportPage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = await params;
  
  const report = await prisma.classReport.findUnique({
    where: { classId: resolvedParams.classId },
    include: { class: true }
  }) as any;

  if (!report) redirect("/dashboard");
  
  const classData = await prisma.class.findUnique({
    where: { id: report.classId },
    include: { students: true }
  }) as any;

  return (
    <div className="min-h-screen pb-20 font-sans">
      
      {/* HEADER DO RELATÓRIO - DARK PREMIUM */}
      <div className="bg-slate-900 text-white pt-20 pb-32 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-black text-[10px] uppercase tracking-[0.2em] mb-12">
            <ArrowLeft size={16} /> Voltar à Jornada
          </Link>
          
          <span className="bg-purple-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">Análise Pedagógica</span>
          <h1 className="text-5xl md:text-6xl font-black mt-8 tracking-tighter leading-none">Análise da Voz.</h1>
          <p className="text-slate-400 mt-6 text-lg font-bold">
            Sessão de {new Date(classData?.scheduledAt || report.class.scheduledAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* CONTEÚDO DO RELATÓRIO - QUALITATIVO */}
      <main className="max-w-4xl mx-auto px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 gap-12">
          
          <section className="bg-[var(--card-bg)] rounded-[3rem] p-12 md:p-16 shadow-2xl border border-[var(--card-border)] ring-1 ring-[var(--card-border)]">
            
            <div className="mb-16">
              <h3 className="flex items-center gap-4 text-[var(--foreground)] font-black text-2xl mb-8 tracking-tight">
                <div className="p-3 bg-[var(--background-secondary)] rounded-2xl text-[#7732A6]"><Mic2 size={24} /></div>
                Estado Atual da Voz
              </h3>
              <p className="text-xl text-[var(--foreground-muted)] leading-relaxed font-medium bg-[var(--background-secondary)] p-8 rounded-[2rem] border border-[var(--card-border)] italic">
                "{report.vocalState}"
              </p>
            </div>

            <div className="h-px bg-[var(--card-border)] w-full mb-16"></div>

            <div className="mb-16">
              <h3 className="flex items-center gap-4 text-[var(--foreground)] font-black text-2xl mb-8 tracking-tight">
                <div className="p-3 bg-[var(--background-secondary)] rounded-2xl text-[#7732A6]"><CheckCircle2 size={24} /></div>
                Desenvolvimento Técnico E.M.E
              </h3>
              <div className="text-lg text-[var(--foreground-muted)] leading-relaxed whitespace-pre-line font-medium px-4">
                {report.technicalAnalysis}
              </div>
            </div>

            <div className="bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl shadow-purple-900/20">
              <h3 className="flex items-center gap-4 font-black text-2xl mb-8 tracking-tight text-purple-400">
                <Target size={28} /> Próximos Passos (Sua Meta)
              </h3>
              <div className="text-xl font-bold leading-relaxed whitespace-pre-line text-slate-200">
                {report.homework}
              </div>
              <div className="mt-12">
                <Link href="/kits" className="inline-flex items-center gap-3 bg-white text-slate-900 font-black py-4 px-8 rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest">
                  Abrir Biblioteca de Ensaio <ChevronRight size={18} />
                </Link>
              </div>
            </div>

          </section>

          <footer className="text-center py-10">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Universo de Cantores &copy; 2025</p>
          </footer>

        </div>
      </main>
    </div>
  );
}