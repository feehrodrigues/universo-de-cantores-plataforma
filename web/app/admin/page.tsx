import { prisma } from "@/lib/prisma";
import PaymentStatusToggle from "@/app/components/admin/PaymentStatusToggle";
import { DollarSign, Users, Calendar, CreditCard, Settings } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminSecretaria() {
  // Verificar se o usuário é admin
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const userRole = (session.user as any).role;
  if (userRole !== 'admin') {
    redirect('/dashboard');
  }

  const classes = await prisma.class.findMany({
    include: { students: true },
    orderBy: { scheduledAt: 'desc' }
  });

  const paidClasses = classes.filter((c: any) => c.paymentStatus === 'paid').length;
  const pendingClasses = classes.filter((c: any) => c.paymentStatus !== 'paid').length;
  const totalStudents = new Set(classes.flatMap((c: any) => c.students.map((s: any) => s.userId))).size;

  // Contar total de usuários
  const totalUsers = await prisma.user.count();

  return (
    <PageLayout >
      <div className="min-h-screen">
        {/* Header */}
        <div className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--foreground-muted)] text-sm mb-1">Painel Administrativo</p>
                <h1 className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Secretaria Digital
                </h1>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/admin/users" 
                  className="btn-secondary flex items-center gap-2 px-4 py-2"
                >
                  <Settings size={16} />
                  Usuários
                </Link>
                <Link 
                  href="/teacher" 
                  className="btn-secondary px-4 py-2"
                >
                  Voltar ao Painel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-theme rounded-2xl p-6 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase">Aulas Pagas</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{paidClasses}</p>
              </div>
            </div>
            <div className="card-theme rounded-2xl p-6 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase">Pendentes</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{pendingClasses}</p>
              </div>
            </div>
            <div className="card-theme rounded-2xl p-6 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase">Alunos (Turmas)</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{totalStudents}</p>
              </div>
            </div>
            <Link href="/admin/users" className="card-theme card-theme-hover rounded-2xl p-6 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Settings size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground-muted)] uppercase">Total Usuários</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{totalUsers}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Tabela de Aulas */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="card-theme rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-[var(--card-border)]">
              <h2 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Gestão de Pagamentos
              </h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--background-secondary)] border-b border-[var(--card-border)]">
                  <th className="p-6 text-xs font-bold uppercase text-[var(--foreground-muted)]">Aluno</th>
                  <th className="p-6 text-xs font-bold uppercase text-[var(--foreground-muted)]">Data da Aula</th>
                  <th className="p-6 text-xs font-bold uppercase text-[var(--foreground-muted)]">Tipo</th>
                  <th className="p-6 text-xs font-bold uppercase text-[var(--foreground-muted)] text-center">Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-[var(--foreground-muted)]">
                      Nenhuma aula encontrada.
                    </td>
                  </tr>
                ) : (
                  classes.map((aula: any) => (
                    <tr key={aula.id} className="border-b border-[var(--card-border)] hover:bg-[var(--background-secondary)] transition-all">
                      <td className="p-6">
                        <p className="font-bold text-[var(--foreground)]">{aula.students?.[0]?.user?.name || 'Sem aluno'}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{aula.students?.[0]?.user?.email || '-'}</p>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-[var(--foreground)]">{new Date(aula.scheduledAt).toLocaleDateString('pt-BR')}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{new Date(aula.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="p-6">
                        <span className="badge-theme px-3 py-1 text-xs font-bold rounded-full uppercase">
                          {aula.type || 'Avulsa'}
                        </span>
                      </td>
                      <td className="p-6 flex justify-center">
                        <PaymentStatusToggle classId={aula.id} initialStatus={aula.paymentStatus === 'paid'} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
