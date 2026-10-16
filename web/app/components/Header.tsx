'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser, useClerk } from '@clerk/nextjs';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';

// 1. IMPORTAMOS O NOSSO BOTÃO DE USUÁRIO UNIFICADO
import HomeUserButton from './HomeUserButton';

interface HeaderProps {
  variant?: 'default' | 'transparent' | 'solid';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 2. REMOVEMOS O ESTADO E EFEITOS DO MENU ANTIGO (userMenuOpen, userMenuRef, etc.)
  // A lógica agora está toda dentro do HomeUserButton.

  const bgClass = {
    default: 'bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--card-border)]',
    transparent: 'bg-transparent',
    solid: 'bg-[var(--background)] border-b border-[var(--card-border)]',
  }[variant];

  // A lógica de role e link do dashboard continua aqui para o menu mobile
  const userRole = (user?.unsafeMetadata as any)?.role || (user?.publicMetadata as any)?.role || 'student';
  const dashboardLink = userRole === 'admin' || userRole === 'teacher' ? '/teacher' : '/dashboard';

  return (
    <header className={`sticky top-0 z-50 ${bgClass} transition-all duration-300`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full shadow-md group-hover:shadow-lg transition-shadow">
              <Image 
                src="/icon.png" 
                alt="Universo de Cantores" 
                fill 
                className="object-cover"
              />
            </div>
            <span className="hidden sm:block text-sm font-bold text-[var(--foreground)] tracking-wide" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Universo de Cantores
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/kits">Kits Vocais</NavLink>
            <NavLink href="/cantatas">Cantatas</NavLink>
            <NavLink href="/aulas">Aulas</NavLink>
            <NavLink href="/blog">Blog</NavLink>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // 3. SUBSTITUÍMOS TODO O BLOCO DO BOTÃO ANTIGO PELO NOSSO COMPONENTE
              <HomeUserButton />
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-semibold text-[#7732A6] hover:text-[#F252BA] px-4 py-2 rounded-full transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro" 
                  className="btn-primary text-sm"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--card-bg)] transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu (A lógica aqui pode continuar, pois o design é diferente) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--card-border)] animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <MobileNavLink href="/kits" onClick={() => setMobileMenuOpen(false)}>Kits Vocais</MobileNavLink>
              <MobileNavLink href="/cantatas" onClick={() => setMobileMenuOpen(false)}>Cantatas</MobileNavLink>
              <MobileNavLink href="/aulas" onClick={() => setMobileMenuOpen(false)}>Aulas</MobileNavLink>
              <MobileNavLink href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</MobileNavLink>
              
              <div className="h-px bg-[var(--card-border)] my-3" />
              
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {user.imageUrl ? (
                      <Image 
                        src={user.imageUrl} 
                        alt={user.firstName || 'Usuário'} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7732A6] to-[#F252BA] flex items-center justify-center text-white font-bold">
                        {user.firstName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[var(--foreground)]">{user.fullName}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href={dashboardLink}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#7732A6] text-white font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Meu Painel
                  </Link>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ redirectUrl: '/login' });
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full font-bold"
                  >
                    <LogOut size={18} />
                    Sair da Conta
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/login" 
                    className="btn-secondary text-center text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/cadastro" 
                    className="btn-primary text-center text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Criar Conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// Funções de Link auxiliares (continuam iguais)
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:text-[#7732A6] rounded-full hover:bg-[#7732A6]/5 transition-all"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href}
      onClick={onClick}
      className="px-4 py-3 text-base font-semibold text-[var(--foreground)] hover:text-[#7732A6] rounded-xl hover:bg-[#7732A6]/5 transition-all"
    >
      {children}
    </Link>
  );
}