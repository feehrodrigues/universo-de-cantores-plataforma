"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  role: 'admin' | 'teacher' | 'student';
  hasStudentProfile: boolean;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && userRole !== 'admin') {
      router.push('/dashboard');
    } else if (status === 'authenticated' && userRole === 'admin') {
      fetchUsers();
    }
  }, [status, userRole]);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdating(userId);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        // Atualizar lista local
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole as any } : u
        ));
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar usuário' });
    } finally {
      setUpdating(null);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-xl text-[var(--foreground-muted)]">Carregando...</div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null;
  }

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    teacher: 'bg-blue-100 text-blue-800',
    student: 'bg-gray-100 text-gray-800',
  };

  const roleLabels = {
    admin: '👑 Admin',
    teacher: '👨‍🏫 Professor',
    student: '🎵 Aluno',
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Gerenciar Usuários
            </h1>
            <p className="text-[var(--foreground-muted)] mt-1">
              {users.length} usuários cadastrados
            </p>
          </div>
          <Link 
            href="/admin"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            ← Voltar ao Admin
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow-lg overflow-hidden border border-[var(--card-border)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--background-secondary)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Role Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.image ? (
                          <img 
                            src={user.image} 
                            alt={user.name || ''} 
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mr-3">
                            <span className="text-purple-700 font-semibold">
                              {(user.name || user.email)[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {user.name || 'Sem nome'}
                          </div>
                          <div className="text-sm text-[var(--foreground-muted)]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role]}`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground-muted)]">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updating === user.id || user.email === session?.user?.email}
                        className={`
                          px-3 py-2 rounded-lg border border-[var(--input-border)]
                          bg-[var(--input-bg)] text-[var(--foreground)]
                          focus:ring-2 focus:ring-[#7732A6]/20 focus:border-[#7732A6]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${updating === user.id ? 'animate-pulse' : ''}
                        `}
                      >
                        <option value="student">🎵 Aluno</option>
                        <option value="teacher">👨‍🏫 Professor</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                      {user.email === session?.user?.email && (
                        <span className="ml-2 text-xs text-gray-400">(você)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12 text-[var(--foreground-muted)]">
              Nenhum usuário encontrado
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-[var(--card-bg)] rounded-xl p-6 shadow-lg border border-[var(--card-border)]">
          <h3 className="font-semibold text-[var(--foreground)] mb-4">Permissões por Role:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[var(--background-secondary)]">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${roleColors.student}`}>
                🎵 Aluno
              </div>
              <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
                <li>• Ver kits vocais</li>
                <li>• Acessar aulas agendadas</li>
                <li>• Dashboard pessoal</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-[var(--background-secondary)]">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${roleColors.teacher}`}>
                👨‍🏫 Professor
              </div>
              <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
                <li>• Tudo do Aluno +</li>
                <li>• Agendar aulas</li>
                <li>• Ver relatórios de turmas</li>
                <li>• Painel do professor</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-[var(--background-secondary)]">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${roleColors.admin}`}>
                👑 Admin
              </div>
              <ul className="text-sm text-[var(--foreground-muted)] space-y-1">
                <li>• Tudo do Professor +</li>
                <li>• Gerenciar usuários</li>
                <li>• Controlar pagamentos</li>
                <li>• Acesso total ao sistema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
