import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, MessageSquare, Video, Users, Clock, ArrowRight, CheckCircle2, AlertCircle, Music2, FileText, BookOpen, CreditCard, TrendingUp, Star } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import TeacherActions from "@/app/components/teacher/TeacherActions";

export default async function TeacherHub() {
  // Verificar se o usuário é admin ou teacher
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const userRole = (session.user as any).role;
  if (userRole !== 'admin' && userRole !== 'teacher') {
    redirect('/dashboard');
  }

  // Buscar dados
  const [agenda, students, pendingPayments, recentReports] = await Promise.all([
    prisma.class.findMany({
      include: { 
        students: { select: { id: true, name: true, email: true } }, 
        preBriefing: true,
        instructor: { select: { name: true } }
      },
      orderBy: { scheduledAt: 'asc' }
    }),
    prisma.user.findMany({
      where: {
        studentProfile: { isNot: null }
      },
      include: {
        studentProfile: {
          include: { vocalProfile: true }
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.classPurchase.findMany({
      where: { paymentStatus: 'pending' },
      include: { user: { select: { name: true, email: true } } },
      take: 5,
      orderBy: { paymentDeadline: 'asc' }
    }),
    prisma.classReport.findMany({
      include: { 
        class: { 
          include: { students: { select: { name: true } } } 
        } 
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const today = new Date();
  const upcomingClasses = agenda.filter((aula: any) => new Date(aula.scheduledAt) >= today);
  const pastClasses = agenda.filter((aula: any) => new Date(aula.scheduledAt) < today);
  const todayClasses = upcomingClasses.filter((aula: any) => {
    const aulaDate = new Date(aula.scheduledAt);
    return aulaDate.toDateString() === today.toDateString();
  });

  // Calcular receita do mês
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const paidThisMonth = await prisma.classPurchase.count({
    where: {
      paymentStatus: 'paid',
      paymentDate: { gte: startOfMonth }
    }
  });

  return (
    <PageLayout >
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7732A6] to-[#5B21B6] text-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Bem-vindo de volta,</p>
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Professor {session.user?.name?.split(' ')[0] || ''}
                </h1>
              </div>
              {todayClasses.length > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-sm font-bold">{todayClasses.length} aula(s) hoje</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CalendarDays size={18} className="text-[#7732A6]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{upcomingClasses.length}</p>
              <p className="text-xs text-[var(--foreground-muted)]">Aulas agendadas</p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CreditCard size={18} className="text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{paidThisMonth}</p>
              <p className="text-xs text-[var(--foreground-muted)]">Pagos este mês</p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <AlertCircle size={18} className="text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{pendingPayments.length}</p>
              <p className="text-xs text-[var(--foreground-muted)]">Pagamentos pendentes</p>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users size={18} className="text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{students.length}</p>
              <p className="text-xs text-[var(--foreground-muted)]">Alunos ativos</p>
            </div>
          </div>

          {/* Ações do Professor - Criar Aula, Relatório, Exportar */}
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Ações Rápidas
            </h2>
            <TeacherActions />
          </div>

          {/* Acesso Rápido - Admin */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin" className="bg-gradient-to-br from-[#7732A6] to-[#5B21B6] text-white rounded-2xl p-5 hover:shadow-lg transition-all">
              <TrendingUp size={24} className="mb-3 opacity-80" />
              <p className="font-bold">Admin Dashboard</p>
              <p className="text-xs opacity-80">Gerenciamento completo</p>
            </Link>
            <Link href="/kits" className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:shadow-lg transition-all">
              <Music2 size={24} className="mb-3 text-[#F252BA]" />
              <p className="font-bold text-[var(--foreground)]">Kits Vocais</p>
              <p className="text-xs text-[var(--foreground-muted)]">Gerenciar biblioteca</p>
            </Link>
            <Link href="/blog" className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:shadow-lg transition-all">
              <BookOpen size={24} className="mb-3 text-cyan-500" />
              <p className="font-bold text-[var(--foreground)]">Blog</p>
              <p className="text-xs text-[var(--foreground-muted)]">Conteúdo educativo</p>
            </Link>
            <a href={`${process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio'}`} target="_blank" className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 hover:shadow-lg transition-all">
              <FileText size={24} className="mb-3 text-orange-500" />
              <p className="font-bold text-[var(--foreground)]">Sanity Studio</p>
              <p className="text-xs text-[var(--foreground-muted)]">Gerenciar conteúdo</p>
            </a>
          </div>

          {/* Próximas Aulas */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                <Clock size={20} className="text-[#7732A6]" />
                Próximas Aulas
              </h2>
            </div>

            {upcomingClasses.length === 0 ? (
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-[var(--background-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={28} className="text-[var(--foreground-muted)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Nenhuma aula agendada</h3>
                <p className="text-[var(--foreground-muted)]">Quando alunos agendarem aulas, elas aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.slice(0, 5).map((aula: any) => (
                  <div key={aula.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            aula.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {aula.paymentStatus === 'paid' ? '✓ Pago' : '⏳ Pendente'}
                          </span>
                          {aula.preBriefing && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                              Briefing enviado
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[var(--foreground)]">
                          {aula.students?.[0]?.name || 'Aluno'}
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {new Date(aula.scheduledAt).toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {aula.jitsiRoomId && aula.paymentStatus === 'paid' && (
                          <Link 
                            href={`/sala/${aula.jitsiRoomId}`}
                            className="bg-[#7732A6] hover:bg-[#5B21B6] text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                          >
                            <Video size={16} />
                            Entrar
                          </Link>
                        )}
                        <Link 
                          href={`/admin/relatorios/${aula.id}`}
                          className="bg-[var(--background-secondary)] hover:bg-[var(--card-border)] text-[var(--foreground)] font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                        >
                          <FileText size={16} />
                          Relatório
                        </Link>
                      </div>
                    </div>
                    
                    {/* Briefing preview */}
                    {aula.preBriefing?.specificGoals && (
                      <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                        <p className="text-xs font-bold text-[#7732A6] uppercase tracking-wide mb-1">Objetivo do Aluno:</p>
                        <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                          {aula.preBriefing.specificGoals}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid: Alunos Recentes + Pagamentos Pendentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alunos Recentes */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
              <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Users size={18} className="text-[#7732A6]" />
                Alunos Recentes
              </h3>
              {students.length === 0 ? (
                <p className="text-[var(--foreground-muted)] text-sm">Nenhum aluno cadastrado.</p>
              ) : (
                <div className="space-y-3">
                  {students.map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7732A6] to-[#F252BA] flex items-center justify-center text-white font-bold">
                          {student.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--foreground)]">{student.name || 'Aluno'}</p>
                          <p className="text-xs text-[var(--foreground-muted)]">
                            {student.studentProfile?.vocalProfile?.totalClassesTaken || 0} aulas
                          </p>
                        </div>
                      </div>
                      {student.studentProfile?.vocalProfile?.overallGrade ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Star size={14} className="text-amber-500" />
                          <span className="font-bold text-[var(--foreground)]">
                            {student.studentProfile.vocalProfile.overallGrade.toFixed(1)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagamentos Pendentes */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
              <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-amber-600" />
                Pagamentos Pendentes
              </h3>
              {pendingPayments.length === 0 ? (
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 size={20} />
                  <p className="font-medium">Todos os pagamentos em dia!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{payment.user?.name || 'Aluno'}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          Vence em {new Date(payment.paymentDeadline).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Pendente
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
