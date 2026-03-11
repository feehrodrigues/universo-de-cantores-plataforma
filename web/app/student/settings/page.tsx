'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { User, Lock, Bell, FileText, Trash2, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  if (status === 'loading') {
    return <div className="p-8">Carregando...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-[var(--foreground)] mb-2">Configurações</h1>
        <p className="text-[var(--foreground-muted)] font-bold">Gerencie seu perfil e preferências</p>
      </div>

      {/* ABAS */}
      <div className="flex gap-2 mb-8 border-b border-[var(--card-border)]">
        {[
          { id: 'profile', label: 'Meu Perfil', icon: User },
          { id: 'password', label: 'Senha', icon: Lock },
          { id: 'notifications', label: 'Notificações', icon: Bell },
          { id: 'contracts', label: 'Contratos', icon: FileText },
          { id: 'danger', label: 'Zona de Risco', icon: Trash2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-[#7732A6] text-[#7732A6]'
                : 'border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO DAS ABAS */}
      <div className="max-w-2xl">
        {/* PERFIL */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
              <h2 className="text-2xl font-black text-[var(--foreground)] mb-6">Informações Pessoais</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-[var(--foreground)] mb-2">Nome Completo</label>
                  <input
                    type="text"
                    defaultValue={session.user?.name || ''}
                    className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7732A6] font-bold bg-[var(--card-bg)] text-[var(--foreground)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-[var(--foreground)] mb-2">E-mail</label>
                  <input
                    type="email"
                    defaultValue={session.user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg bg-slate-50 text-[var(--foreground-muted)] font-bold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-[var(--foreground)] mb-2">Seu Objetivo Geral</label>
                  <textarea
                    defaultValue="Dominar belting e expressão emocional"
                    className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7732A6] font-bold min-h-28 bg-[var(--card-bg)] text-[var(--foreground)]"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-black text-[var(--foreground)] mb-2">Histórico Vocal</label>
                  <textarea
                    defaultValue="Iniciante com experiência anterior em coral"
                    className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7732A6] font-bold min-h-28 bg-[var(--card-bg)] text-[var(--foreground)]"
                  ></textarea>
                </div>

                <button className="px-8 py-3 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90 transition-all">
                  Salvar Mudanças
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SENHA */}
        {activeTab === 'password' && (
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
            <h2 className="text-2xl font-black text-[var(--foreground)] mb-6">Alterar Senha</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-[var(--foreground)] mb-2">Senha Atual</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7732A6] font-bold bg-[var(--card-bg)] text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[var(--foreground)] mb-2">Nova Senha</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7732A6] font-bold bg-[var(--card-bg)] text-[var(--foreground)]"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[var(--foreground)] mb-2">Confirmar Nova Senha</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7732A6] font-bold bg-[var(--card-bg)] text-[var(--foreground)]"
                />
              </div>

              <button className="px-8 py-3 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90 transition-all">
                Atualizar Senha
              </button>
            </div>
          </div>
        )}

        {/* NOTIFICAÇÕES */}
        {activeTab === 'notifications' && (
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
            <h2 className="text-2xl font-black text-[var(--foreground)] mb-6">Preferências de Notificação</h2>

            <div className="space-y-4">
              {[
                { label: 'Lembretes de aulas próximas', description: '24h antes da aula' },
                { label: 'Renovação do plano mensal', description: 'Aviso quando estiver vencendo' },
                { label: 'Novos relatórios disponíveis', description: 'Quando o professor terminar a análise' },
                { label: 'Mensagens do professor', description: 'Comentários e feedback personalizado' },
                { label: 'Novos planos e promoções', description: 'Ofertas especiais e planos novos' },
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-[var(--card-border)] cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded cursor-pointer" />
                  <div className="flex-1">
                    <p className="font-bold text-[var(--foreground)]">{item.label}</p>
                    <p className="text-sm text-[var(--foreground-muted)] font-bold">{item.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <button className="mt-6 px-8 py-3 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90 transition-all">
              Salvar Preferências
            </button>
          </div>
        )}

        {/* CONTRATOS */}
        {activeTab === 'contracts' && (
          <div className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-sm border border-[var(--card-border)]">
            <h2 className="text-2xl font-black text-[var(--foreground)] mb-6">Seus Contratos</h2>

            <div className="space-y-4">
              {[
                { title: 'Termos de Serviço', signed: true, date: '2025-12-15' },
                { title: 'Autorização de Direitos de Imagem', signed: true, date: '2025-12-15' },
                { title: 'Acordo de Pagamento', signed: true, date: '2025-12-15' },
              ].map((contract, idx) => (
                <div key={idx} className="p-4 border border-[var(--card-border)] rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-black text-[var(--foreground)]">{contract.title}</p>
                    {contract.signed && (
                      <p className="text-xs text-green-600 font-bold">
                        ✓ Assinado em {new Date(contract.date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-[var(--foreground-muted)] rounded-lg font-bold hover:bg-slate-200 transition-all">
                    Visualizar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ZONA DE RISCO */}
        {activeTab === 'danger' && (
          <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
            <h2 className="text-2xl font-black text-red-700 mb-6">Zona de Risco</h2>

            <div className="space-y-4">
              <div className="bg-[var(--card-bg)] rounded-lg p-4 border border-red-200">
                <p className="font-black text-[var(--foreground)]">Sair da Conta</p>
                <p className="text-sm text-[var(--foreground-muted)] font-bold mt-1">Você será desconectado dessa sessão</p>
                <button
                  onClick={() => signOut()}
                  className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-all flex items-center gap-2"
                >
                  <LogOut size={16} /> Sair Agora
                </button>
              </div>

              <div className="bg-[var(--card-bg)] rounded-lg p-4 border border-red-200">
                <p className="font-black text-[var(--foreground)]">Deletar Conta</p>
                <p className="text-sm text-[var(--foreground-muted)] font-bold mt-1">
                  Esta ação é irreversível. Todos os seus dados serão removidos permanentemente.
                </p>
                <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all">
                  Deletar Minha Conta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
