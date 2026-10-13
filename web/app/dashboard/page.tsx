import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Music2, BookOpen, Calendar, Heart, ArrowRight, Settings, FileText, CreditCard, TrendingUp, Clock, Video, AlertCircle, CheckCircle, Loader2, MapPin, ChevronRight } from "lucide-react";
import { Fragment } from "react";
// Utilitário para agrupar aulas por data (YYYY-MM-DD)
function groupClassesByDate(classes: any[]) {
  const grouped: Record<string, any[]> = {};
  classes.forEach((cls) => {
    const date = cls.scheduledAt ? new Date(cls.scheduledAt).toISOString().slice(0, 10) : 'Sem data';
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(cls);
  });
  return grouped;
}
import PageLayout from "@/app/components/PageLayout";
import LogoutButton from "@/app/components/LogoutButton";
import { prisma } from "@/lib/prisma";
import EvolucaoVocalChart from "@/app/components/EvolucaoVocalChart";

async function getOrCreateUser(clerkUserId: string, email: string, name: string, image: string | null) {
  try {
    // Primeiro tenta encontrar por email
    let user = await prisma.user.findUnique({
      where: { email },
      include: { 
        adminProfile: true,
        studentProfile: {
          include: { vocalProfile: true }
        },
        classesEnrolled: {
          where: { scheduledAt: { gte: new Date() } },
          orderBy: { scheduledAt: 'asc' },
          take: 1,
          include: {
            instructor: { select: { name: true } },
            preBriefing: true
          }
        },
        contractsSigned: {
          where: { signedAt: { not: null } },
          select: { type: true }
        },
        purchaseHistory: {
          where: { paymentStatus: 'pending' },
          take: 3,
          orderBy: { paymentDeadline: 'asc' }
        }
      }
    });

    // Se não existe, cria
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: clerkUserId,
          email,
          name,
          image,
        },
        include: { 
          adminProfile: true,
          studentProfile: {
            include: { vocalProfile: true }
          },
          classesEnrolled: {
            where: { scheduledAt: { gte: new Date() } },
            orderBy: { scheduledAt: 'asc' },
            take: 1,
            include: {
              instructor: { select: { name: true } },
              preBriefing: true
            }
          },
          contractsSigned: {
            where: { signedAt: { not: null } },
            select: { type: true }
          },
          purchaseHistory: {
            where: { paymentStatus: 'pending' },
            take: 3,
            orderBy: { paymentDeadline: 'asc' }
          }
        }
      });
    }

    return user;
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    return null;
  }
}

export default async function DashboardPage() {
  // Verificar autenticação do Clerk
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/login");
  }

  // Obter dados do usuário do Clerk
  const clerkUser = await currentUser();
  
  if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
    // Usuário sem email - mostrar página de erro (NÃO redirecionar)
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Email não encontrado</h1>
            <p className="text-gray-600 mb-6">
              Sua conta não tem um email verificado. Por favor, adicione um email na sua conta.
            </p>
            <Link href="/setup" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-500 transition-colors inline-block">
              Ir para Configuração
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const email = clerkUser.emailAddresses[0].emailAddress;
  const name = clerkUser.firstName 
    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() 
    : "Usuário";

  // Buscar ou criar usuário no banco
  const dbUser = await getOrCreateUser(userId, email, name, clerkUser.imageUrl || null);

  if (!dbUser) {
    // Erro no banco - mostrar página de erro (NÃO redirecionar)
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro temporário</h1>
            <p className="text-gray-600 mb-6">
              Não foi possível carregar seus dados. Tente novamente em alguns segundos.
            </p>
            <Link 
              href="/dashboard"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-500 transition-colors inline-block"
            >
              Tentar novamente
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Verificar se é admin/teacher
  const role = dbUser.adminProfile?.role;
  if (role === 'admin' || role === 'teacher') {
    redirect("/teacher");
  }

  // Dados do estudante
  const studentProfile = dbUser.studentProfile;
  const vocalProfile = studentProfile?.vocalProfile;
  const nextClass = dbUser.classesEnrolled[0];
  const signedContracts = dbUser.contractsSigned?.map((c: { type: string }) => c.type) || [];
  const pendingPayments = dbUser.purchaseHistory || [];

  const hasSignedTerms = signedContracts.includes('terms');
  const hasSignedImage = signedContracts.includes('image');

  // Buscar todas as aulas do aluno (não só a próxima)
  const allClasses = await prisma.class.findMany({
    where: {
      students: { some: { id: dbUser.id } },
    },
    orderBy: { scheduledAt: 'asc' },
    include: {
      instructor: { select: { name: true } },
    },
  });
  const groupedByDate = groupClassesByDate(allClasses);

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7732A6] to-[#5B21B6] text-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Bem-vindo(a) de volta,</p>
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  {dbUser.name || 'Visitante'}
                </h1>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Alertas / Pendências */}
          {(!hasSignedTerms || !hasSignedImage || pendingPayments.length > 0) && (
            <div className="mb-8 space-y-3">
              {!hasSignedTerms && (
                <Link href="/contratos" className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                  <AlertCircle className="text-amber-600" size={20} />
                  <span className="text-amber-800 dark:text-amber-200 font-medium">Você precisa assinar os Termos de Uso para continuar.</span>
                  <ArrowRight className="text-amber-600 ml-auto" size={16} />
                </Link>
              )}
              {!hasSignedImage && (
                <Link href="/contratos?type=image" className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <FileText className="text-purple-600" size={20} />
                  <span className="text-purple-800 dark:text-purple-200 font-medium">Autorização de uso de imagem pendente.</span>
                  <ArrowRight className="text-purple-600 ml-auto" size={16} />
                </Link>
              )}
              {pendingPayments.length > 0 && (
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <CreditCard className="text-red-600" size={20} />
                  <span className="text-red-800 dark:text-red-200 font-medium">
                    Você tem {pendingPayments.length} pagamento(s) pendente(s).
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Cards de Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <span className="text-sm text-[var(--foreground-muted)]">Saldo de Aulas</span>
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {studentProfile?.lessonBalance || 0}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                aulas disponíveis
              </p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="text-purple-600" size={20} />
                </div>
                <span className="text-sm text-[var(--foreground-muted)]">Nota Geral</span>
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {vocalProfile?.overallGrade?.toFixed(1) || '—'}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                média de evolução
              </p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <span className="text-sm text-[var(--foreground-muted)]">Aulas Feitas</span>
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {vocalProfile?.totalClassesTaken || 0}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                aulas concluídas
              </p>
            </div>
          </div>

          {/* Próxima Aula */}
          {nextClass && (
            <div className="bg-gradient-to-r from-[#7732A6] to-[#F252BA] rounded-3xl p-6 md:p-8 text-white mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1 flex items-center gap-2">
                    <Clock size={14} />
                    Sua próxima aula
                  </p>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    {nextClass.title}
                  </h3>
                  <p className="text-white/90">
                    {new Date(nextClass.scheduledAt).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {nextClass.instructor?.name && (
                    <p className="text-white/70 text-sm mt-1">
                      com {nextClass.instructor.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {!nextClass.preBriefing && (
                    <Link
                      href={`/briefing/${nextClass.id}`}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <FileText size={18} />
                      Preencher Briefing
                    </Link>
                  )}
                  {nextClass.jitsiRoomId && (
                    <Link
                      href={`/sala/${nextClass.jitsiRoomId}`}
                      className="bg-white text-[#7732A6] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                    >
                      <Video size={18} />
                      Entrar na Sala
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cards de Acesso Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <DashboardCard 
              href="/kits"
              icon={<Music2 size={28} />}
              title="Kits Vocais"
              description="Acesse a biblioteca completa de kits de ensaio com divisão de vozes."
              color="bg-[#7732A6]"
            />
            <DashboardCard 
              href="/cantatas"
              icon={<BookOpen size={28} />}
              title="Cantatas"
              description="Explore coleções completas para seu ministério ou coral."
              color="bg-[#F252BA]"
            />
            <DashboardCard 
              href="/aulas"
              icon={<Calendar size={28} />}
              title="Aulas de Canto"
              description="Agende aulas individuais e acompanhe sua evolução vocal."
              color="bg-[#5B21B6]"
            />
          </div>


          {/* FEED VISUAL DE AULAS AGRUPADAS POR DATA */}
          <div className="mb-12">
            <h2 className="text-2xl font-black mb-4 text-[var(--foreground)]">Minhas Aulas</h2>
            <div className="space-y-8">
              {Object.keys(groupedByDate).length > 0 ? (
                Object.entries(groupedByDate).map(([date, group]) => (
                  <Fragment key={date}>
                    <div className="mb-2 mt-6 flex items-center gap-2">
                      <Calendar size={20} className="text-purple-600" />
                      <span className="font-black text-lg text-purple-700">
                        {date === 'Sem data' ? 'Aulas sem data' : new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {group.map((cls) => {
                        const now = new Date();
                        const scheduledAt = cls.scheduledAt ? new Date(cls.scheduledAt) : null;
                        let status = 'pending';
                        if (cls.completedAt) status = 'completed';
                        else if (scheduledAt && scheduledAt > now) status = 'upcoming';
                        const statusColors = {
                          upcoming: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'PRÓXIMA' },
                          completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'CONCLUÍDA' },
                          pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'PENDENTE' },
                        };
                        const colors = statusColors[status as keyof typeof statusColors];
                        return (
                          <div
                            key={cls.id}
                            className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)] hover:shadow-lg transition-all flex flex-col justify-between min-h-[200px]"
                          >
                            <div>
                              <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-black mb-2`}>
                                {colors.label}
                              </span>
                              <h3 className="text-xl font-black text-[var(--foreground)]">{cls.title}</h3>
                              <div className="flex gap-4 text-sm text-[var(--foreground-muted)] font-bold mt-2 flex-wrap">
                                {scheduledAt && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {scheduledAt.toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                                {scheduledAt && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {scheduledAt.toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <MapPin size={16} />
                                  {cls.type || 'Online'}
                                </span>
                                {/* Status de pagamento */}
                                <span className={`flex items-center gap-1 ${cls.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                  {cls.paymentStatus === 'paid' ? '💸 Pago' : '⏳ Pagamento Pendente'}
                                </span>
                              </div>
                              <p className="text-[var(--foreground-muted)] mb-4 font-bold mt-2">{cls.description || 'Aula marcada'}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Link href={`/student/classes/${cls.id}/briefing`} className="text-purple-600 font-bold text-sm hover:text-purple-700 flex items-center gap-1">
                                📋 Briefing <ChevronRight size={14} />
                              </Link>
                              {status === 'upcoming' && (
                                <Link
                                  href={cls.jitsiLink || '#'}
                                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-all whitespace-nowrap"
                                >
                                  Entrar
                                </Link>
                              )}
                              {status === 'completed' && (
                                <Link
                                  href={`/student/classes/${cls.id}/report`}
                                  className="px-4 py-2 bg-slate-100 text-[var(--foreground)] rounded-lg font-bold text-sm hover:bg-slate-200 transition-all whitespace-nowrap"
                                >
                                  Ver Relatório
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Fragment>
                ))
              ) : (
                <div className="text-center text-[var(--foreground-muted)] font-bold py-12">Nenhuma aula encontrada.</div>
              )}
            </div>
          </div>

          {/* Evolução Vocal EME - Gráfico Dinâmico */}
          {vocalProfile && (vocalProfile.avgStructureGrade > 0 || vocalProfile.avgModelingGrade > 0 || vocalProfile.avgExpressionGrade > 0) ? (
            <div className="mb-8">
              <EvolucaoVocalChart />
            </div>
          ) : (
            <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl p-8 border border-[var(--card-border)] shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <TrendingUp size={20} className="text-[#7732A6]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Sua Evolução Vocal
                </h2>
              </div>
              <p className="text-[var(--foreground-muted)]">
                Você ainda não possui avaliações registradas. Após suas primeiras aulas, 
                seu professor irá avaliar sua evolução em Estrutura, Modelagem e Expressão, 
                e você poderá acompanhar seu progresso aqui com gráficos dinâmicos.
              </p>
            </div>
          )}

          {/* Links Rápidos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/student/settings" className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 hover:shadow-md transition-all text-center">
              <Settings size={24} className="mx-auto mb-2 text-[var(--foreground-muted)]" />
              <span className="text-sm font-bold text-[var(--foreground)]">Configurações</span>
            </Link>
            <Link href="/contratos" className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 hover:shadow-md transition-all text-center">
              <FileText size={24} className="mx-auto mb-2 text-[var(--foreground-muted)]" />
              <span className="text-sm font-bold text-[var(--foreground)]">Contratos</span>
            </Link>
            <Link href="/blog" className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 hover:shadow-md transition-all text-center">
              <BookOpen size={24} className="mx-auto mb-2 text-[var(--foreground-muted)]" />
              <span className="text-sm font-bold text-[var(--foreground)]">Blog</span>
            </Link>
            <Link href="/sobre" className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 hover:shadow-md transition-all text-center">
              <Heart size={24} className="mx-auto mb-2 text-[var(--foreground-muted)]" />
              <span className="text-sm font-bold text-[var(--foreground)]">Sobre Nós</span>
            </Link>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}

function DashboardCard({ 
  href, 
  icon, 
  title, 
  description, 
  color,
  textColor = "text-white"
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
  textColor?: string;
}) {
  return (
    <Link href={href} className="group">
      <div className={`${color} ${textColor} rounded-3xl p-8 h-full card-hover shadow-lg`}>
        <div className="mb-4 opacity-80">{icon}</div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          {title}
        </h3>
        <p className="text-sm opacity-80 mb-4">{description}</p>
        <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
          Acessar <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
