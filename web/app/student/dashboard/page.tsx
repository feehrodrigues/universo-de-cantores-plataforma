'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Mic2, BookOpen, TrendingUp, Calendar, Plus, ArrowRight, Star, Zap, Loader, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const loadAllData = async () => {
        try {
          const [dashRes, classRes] = await Promise.all([
            fetch('/api/student/dashboard'),
            fetch('/api/student/classes'),
          ]);

          const dashJson = await dashRes.json();
          const classJson = await classRes.json();

          // BLINDAGEM CONTRA ERROS DE API
          setDashboardData(dashJson || {});
          setClasses(Array.isArray(classJson) ? classJson : []);
        } catch (error) {
          console.error("Falha ao carregar dados do Universo:", error);
          setClasses([]); // Evita que classes seja undefined
        } finally {
          setLoading(false); // GARANTE QUE O GIF SUMA
        }
      };
      loadAllData();
    } else if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)]">
        <Loader className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)]">Sincronizando Dados...</p>
      </div>
    );
  }

  // RESOLUÇÃO DOS ERROS DE RUNTIME (Passo Certeiro)
  const lessonsRemaining = dashboardData?.lessonsRemaining ?? 0;
  const totalLessons = dashboardData?.totalLessons ?? 0;
  const studentGoal = dashboardData?.studentProfile?.goal || "Defina sua meta com o professor";
  const vocalLevel = dashboardData?.vocalLevel || "Análise Pendente";

  // Busca segura de aulas
  const nextClass = classes.length > 0 ? classes.find((c) => new Date(c.scheduledAt) > new Date()) : null;
  const recentClass = classes.length > 0 ? classes.find((c) => c.completedAt) : null;

  return (
    <div className="p-8 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
      
      {/* HEADER */}
      <div className="mb-12">
        <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] mb-2">Universo de Cantores</p>
        <h1 className="text-5xl font-black tracking-tighter">
          Olá, {session?.user?.name?.split(' ')[0]}.
        </h1>
      </div>

      {/* GRID DE FUNCIONALIDADES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-[var(--card-bg)] rounded-[2rem] p-8 shadow-sm border border-[var(--card-border)]">
          <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase mb-4">Aulas Disponíveis</p>
          <p className="text-5xl font-black">{lessonsRemaining}</p>
          <p className="text-xs font-bold text-[var(--foreground-muted)] mt-2">De {totalLessons} contratadas</p>
        </div>

        <div className="bg-[var(--card-bg)] rounded-[2rem] p-8 shadow-sm border border-[var(--card-border)]">
          <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase mb-4">Média E.M.E</p>
          <p className="text-5xl font-black text-purple-600">{vocalLevel}</p>
        </div>

        {/* CARD DE COMPRA (Importante para o negócio) */}
        <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl text-white col-span-1 md:col-span-2 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-black uppercase mb-2">Acelere sua Evolução</h3>
            <p className="text-sm opacity-70 mb-6">Adquira novos pacotes de aula e mantenha o ritmo.</p>
            <Link href="/aulas" className="inline-flex items-center gap-2 bg-purple-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 transition-all">
              <Plus size={16} /> Comprar Aulas
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black tracking-tight">Sua Linha do Tempo</h2>
          
          {nextClass ? (
            <div className="bg-[var(--card-bg)] p-10 rounded-[2.5rem] border-2 border-purple-100 shadow-xl shadow-purple-500/5">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase">Próxima Aula</span>
                <p className="text-sm font-bold text-[var(--foreground-muted)]">{new Date(nextClass.scheduledAt).toLocaleDateString()}</p>
              </div>
              <h3 className="text-2xl font-black mb-4">{nextClass.title}</h3>
              <p className="text-[var(--foreground-muted)] mb-10 font-bold italic">"{nextClass.description || 'Foco a definir no briefing.'}"</p>
              <div className="flex gap-4">
                <Link href={`/sala/${nextClass.jitsiRoomId || nextClass.id}`} className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center">Entrar no Estúdio</Link>
                <Link href={`/student/classes/${nextClass.id}/briefing`} className="flex-1 border border-[var(--card-border)] py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center text-[var(--foreground-muted)]">Preencher Briefing</Link>
              </div>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed border-[var(--card-border)] rounded-[2.5rem] text-center">
              <p className="text-[var(--foreground-muted)]">Nenhuma aula agendada para os próximos dias.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-[var(--card-bg)] p-8 rounded-[2rem] border border-[var(--card-border)] shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--foreground)] mb-6 flex items-center gap-2">
                 <Zap size={18} className="text-purple-600" /> Meta Técnica
              </h3>
              <p className="text-sm font-bold text-[var(--foreground-muted)] italic">"{studentGoal}"</p>
           </div>

           <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-start gap-3">
              <ShieldCheck className="text-orange-600 shrink-0" size={20} />
              <p className="text-[11px] font-bold text-orange-900 leading-tight">
                Lembrete: O pagamento via PIX deve ser realizado até 24h antes da aula para liberação do sistema.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}