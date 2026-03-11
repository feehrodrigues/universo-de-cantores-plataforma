'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Plus, Filter, Search, ChevronRight, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MyClasses() {
  const { data: session, status } = useSession();
  const [filterStatus, setFilterStatus] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/student/classes')
        .then((r) => r.json())
        .then((data) => {
          setClasses(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <Loader className="animate-spin text-[#7732A6]" size={40} />
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const getStatus = (cls: any) => {
    const now = new Date();
    const scheduledAt = new Date(cls.scheduledAt);
    if (cls.completedAt) return 'completed';
    if (scheduledAt > now) return 'upcoming';
    return 'pending';
  };

  const filteredClasses = classes
    .filter((c) => {
      if (filterStatus === 'todas') return true;
      return getStatus(c) === filterStatus;
    })
    .filter((c) => c.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl font-black text-[var(--foreground)] mb-2">Minhas Aulas</h1>
        <p className="text-[var(--foreground-muted)] font-bold text-lg">
          Acompanhe todas as suas aulas, briefings e relatórios
        </p>
      </div>

      {/* SEARCH E FILTROS */}
      <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)] mb-8">
        <div className="flex gap-4 mb-4 flex-col md:flex-row">
          <div className="flex-1 flex items-center gap-2 bg-[var(--background-secondary)] rounded-xl px-4">
            <Search size={20} className="text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Buscar aula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 py-3 bg-transparent font-bold text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none"
            />
          </div>
          <Link
            href="/aulas"
            className="px-6 py-3 bg-[#7732A6] text-white rounded-lg font-bold hover:opacity-90 transition-all whitespace-nowrap"
          >
            <Plus size={20} className="inline mr-2" />
            Nova Aula
          </Link>
        </div>

        {/* FILTROS */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'Todas', value: 'todas' },
            { label: 'Próximas', value: 'upcoming' },
            { label: 'Concluídas', value: 'completed' },
            { label: 'Pendentes', value: 'pending' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                filterStatus === filter.value
                  ? 'bg-[#7732A6] text-white'
                  : 'bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:opacity-80'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE AULAS */}
      <div className="space-y-4">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => {
            const status = getStatus(cls);
            const scheduledAt = new Date(cls.scheduledAt);
            const statusColors = {
              upcoming: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'PRÓXIMA' },
              completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'CONCLUÍDA' },
              pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'PENDENTE' },
            };
            const colors = statusColors[status as keyof typeof statusColors];

            return (
              <div
                key={cls.id}
                className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--card-border)] hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-black mb-2`}>
                      {colors.label}
                    </span>
                    <h3 className="text-xl font-black text-[var(--foreground)]">{cls.title}</h3>
                    <div className="flex gap-4 text-sm text-[var(--foreground-muted)] font-bold mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {scheduledAt.toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {scheduledAt.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {cls.type || 'Online'}
                      </span>
                    </div>
                  </div>

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
                      href="/student/reports"
                      className="px-4 py-2 bg-slate-100 text-[var(--foreground)] rounded-lg font-bold text-sm hover:bg-slate-200 transition-all whitespace-nowrap"
                    >
                      Ver Relatório
                    </Link>
                  )}
                </div>

                <p className="text-[var(--foreground-muted)] mb-4 font-bold">{cls.description || 'Aula marcada'}</p>

                <div className="flex gap-2">
                  <Link href={`/student/classes/${cls.id}/briefing`} className="text-purple-600 font-bold text-sm hover:text-purple-700 flex items-center gap-1">
                    📋 Briefing <ChevronRight size={14} />
                  </Link>
                  <button className="text-[var(--foreground-muted)] font-bold text-sm hover:text-[var(--foreground)] flex items-center gap-1">
                    👩‍🏫 Instrutor <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-[var(--card-border)]">
            <Calendar size={40} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[var(--foreground)] mb-2">Nenhuma aula encontrada</h3>
            <p className="text-[var(--foreground-muted)] font-bold mb-6">Agende suas aulas agora mesmo</p>
            <Link
              href="/aulas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-black hover:bg-purple-700 transition-all"
            >
              <Plus size={20} /> Agendar Aula
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

