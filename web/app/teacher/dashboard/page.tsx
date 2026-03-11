import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Calendar, Users, TrendingUp, DollarSign, BookOpen, Play, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function TeacherDashboard() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    redirect('/login');
  }

  const instructor = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!instructor) {
    redirect('/login');
  }

  // Get instructor's classes
  const upcomingClasses = await prisma.class.findMany({
    where: {
      instructorId: instructor.id,
      scheduledAt: {
        gte: new Date(),
      },
    },
    include: {
      students: true,
      report: true,
      preBriefing: true,
    },
    orderBy: { scheduledAt: 'asc' },
  });

  const completedClasses = await prisma.class.findMany({
    where: {
      instructorId: instructor.id,
      scheduledAt: {
        lt: new Date(),
      },
    },
    include: {
      students: true,
      report: true,
    },
    orderBy: { scheduledAt: 'desc' },
    take: 10,
  });

  // Calculate metrics
  const totalStudents = new Set(upcomingClasses.flatMap((c) => c.students.map((s) => s.id))).size;
  const classesThisMonth = upcomingClasses.filter(
    (c) => c.scheduledAt.getMonth() === new Date().getMonth()
  ).length;

  // Get pending reports to write
  const pendingReports = upcomingClasses.filter((c) => !c.report && c.scheduledAt < new Date());

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#7732A6] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-black mb-2">Dashboard do Professor</h1>
          <p className="text-lg opacity-90">Bem-vindo, {instructor.name || 'Professor'}!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--foreground-muted)] font-bold">Alunos</p>
                <p className="text-3xl font-black text-[var(--foreground)]">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--foreground-muted)] font-bold">Aulas (Mês)</p>
                <p className="text-3xl font-black text-[var(--foreground)]">{classesThisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BookOpen className="text-yellow-600" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--foreground-muted)] font-bold">Relatórios Pendentes</p>
                <p className="text-3xl font-black text-[var(--foreground)]">{pendingReports.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-[#7732A6]" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--foreground-muted)] font-bold">Total de Aulas</p>
                <p className="text-3xl font-black text-[var(--foreground)]">{completedClasses.length + upcomingClasses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Classes */}
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-2">
                  <Calendar className="text-[#7732A6]" size={28} />
                  Próximas Aulas
                </h2>
                <Link
                  href="/teacher/schedule"
                  className="px-4 py-2 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90 transition-all"
                >
                  + Agendar
                </Link>
              </div>

              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.slice(0, 5).map((classItem) => (
                    <div key={classItem.id} className="flex items-center gap-4 p-4 border border-[var(--card-border)] rounded-xl hover:border-[#7732A6] transition-all">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Clock className="text-[#7732A6]" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[var(--foreground)]">{classItem.students[0]?.name || 'Sem alunos'}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {new Date(classItem.scheduledAt).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Link
                        href={`/teacher/classes/${classItem.id}`}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-all"
                      >
                        Detalhes
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--foreground-muted)] font-bold mb-4">Nenhuma aula agendada</p>
                  <Link
                    href="/teacher/schedule"
                    className="inline-block px-6 py-2 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90"
                  >
                    Agendar uma aula
                  </Link>
                </div>
              )}
            </div>

            {/* Pending Reports */}
            {pendingReports.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-amber-900 mb-4 flex items-center gap-2">
                  ⚠️ Relatórios Pendentes
                </h2>
                <div className="space-y-3">
                  {pendingReports.slice(0, 5).map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between bg-[var(--card-bg)] p-4 rounded-xl">
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{classItem.students[0]?.name || 'Aluno'}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {new Date(classItem.scheduledAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Link
                        href={`/teacher/classes/${classItem.id}/report`}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700"
                      >
                        Escrever Relatório
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Completed Classes */}
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
              <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-2 mb-6">
                <Play className="text-green-600" size={28} />
                Aulas Recentes
              </h2>
              {completedClasses.length > 0 ? (
                <div className="space-y-3">
                  {completedClasses.slice(0, 5).map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-4 border border-[var(--card-border)] rounded-xl">
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{classItem.students[0]?.name || 'Aluno'}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {new Date(classItem.scheduledAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {classItem.report ? (
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
                            ✓ Relatório
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-[var(--background-secondary)] text-[var(--foreground-muted)] rounded-full text-xs font-bold">
                            Sem Relatório
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--foreground-muted)] font-bold text-center py-8">Nenhuma aula concluída ainda</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
              <h3 className="text-lg font-black text-[var(--foreground)] mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link
                  href="/teacher/classes"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90 transition-all"
                >
                  <Calendar size={20} />
                  Ver Todas as Aulas
                </Link>
                <Link
                  href="/teacher/students"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                >
                  <Users size={20} />
                  Meus Alunos
                </Link>
                <Link
                  href="/teacher/earnings"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all"
                >
                  <DollarSign size={20} />
                  Ganhos
                </Link>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-[#7732A6] text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-lg font-black mb-4">Desempenho</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-80">Taxa de Conclusão</p>
                  <p className="text-3xl font-black">100%</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Avaliação Média</p>
                  <p className="text-3xl font-black">4.9 ★</p>
                </div>
                <div className="pt-4 border-t border-white border-opacity-20">
                  <p className="text-xs opacity-80">Atualizado hoje</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <p className="font-bold text-blue-900 mb-3">💡 Dúvidas?</p>
              <p className="text-sm text-blue-700 font-bold mb-4">
                Acesse nossa documentação ou entre em contato com o suporte.
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all">
                Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
