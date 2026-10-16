'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Plus, Filter, Search, ChevronRight, Loader } from 'lucide-react';
import { Fragment } from 'react';
import { useState, useEffect } from 'react';

export default function MyClasses() {
  const { user, isLoaded } = useUser();
  const [filterStatus, setFilterStatus] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/student/classes')
        .then((r) => r.json())
        .then((data) => {
          setClasses(data);
          setLoading(false);
        });
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <Loader className="animate-spin text-[#7732A6]" size={40} />
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  const getStatus = (cls: any) => {
    const now = new Date();
    const scheduledAt = new Date(cls.scheduledAt);
    if (cls.completedAt) return 'completed';
    if (scheduledAt > now) return 'upcoming';
    return 'pending';
  };

  // Agrupa aulas por data (YYYY-MM-DD)
  const filteredClasses = classes
    .filter((c) => {
      if (filterStatus === 'todas') return true;
      return getStatus(c) === filterStatus;
    })
    .filter((c) => c.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  const groupedByDate: Record<string, any[]> = {};
  filteredClasses.forEach((cls) => {
    const date = cls.scheduledAt ? new Date(cls.scheduledAt).toISOString().slice(0, 10) : 'Sem data';
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(cls);
  });

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

      {/* FEED VISUAL DE AULAS AGRUPADAS POR DATA */}
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
                        const status = getStatus(cls);
                        const scheduledAt = cls.scheduledAt ? new Date(cls.scheduledAt) : null;
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
                              {status === 'pending' && (
                                <button
                                  className="px-4 py-2 bg-yellow-400 text-white rounded-lg font-bold text-sm hover:bg-yellow-500 transition-all whitespace-nowrap"
                                  onClick={async () => {
                                    const dateStr = prompt('Escolha a data e hora da aula (YYYY-MM-DD HH:mm):');
                                    if (!dateStr) return;
                                    const iso = dateStr.replace(' ', 'T')+':00';
                                    const res = await fetch(`/api/classes/${cls.id}`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ scheduledAt: iso }),
                                    });
                                    if (res.ok) {
                                      alert('Aula agendada com sucesso!');
                                      setLoading(true);
                                      fetch('/api/student/classes')
                                        .then((r) => r.json())
                                        .then((data) => {
                                          setClasses(data);
                                          setLoading(false);
                                        });
                                    } else {
                                      alert('Erro ao agendar aula.');
                                    }
                                  }}
                                >
                                  Agendar
                                </button>
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
  );
}

