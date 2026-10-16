'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mic2, BookOpen, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Visão Geral' },
    { href: '/student/classes', icon: Mic2, label: 'Minhas Aulas', desc: 'Agendadas' },
    { href: '/student/reports', icon: BookOpen, label: 'Relatórios', desc: 'Análises' },
    { href: '/student/evolution', icon: TrendingUp, label: 'Evolução', desc: 'Progresso' },
    { href: '/student/settings', icon: Settings, label: 'Configurações', desc: 'Perfil' },
  ];

  return (
    <div className="min-h-screen">
      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-screen bg-[var(--card-bg)] border-r border-[var(--card-border)] transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'} shadow-lg`}>
        <div className="p-6 border-b border-[var(--card-border)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl text-white">
              <Mic2 size={24} />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-black text-[var(--foreground)]">Universo</h1>
                <p className="text-xs font-bold text-purple-600">de Cantores</p>
              </div>
            )}
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <div>
                    <p className="font-bold text-sm">{item.label}</p>
                    <p className="text-xs opacity-70">{item.desc}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 rounded-lg bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-slate-200 transition-all"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-bold">
            <LogOut size={16} />
            {sidebarOpen && 'Sair'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
}
