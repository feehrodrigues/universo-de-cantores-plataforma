// app/components/HomeUserButton.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function HomeUserButton() {
  const { user, isLoaded } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link 
        href="/login" 
        className="btn-primary text-sm"
      >
        Entrar
      </Link>
    );
  }

  const userRole = (user?.unsafeMetadata as any)?.role || (user?.publicMetadata as any)?.role || 'student';
  const dashboardLink = userRole === 'admin' || userRole === 'teacher' ? '/teacher' : '/dashboard';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm border transition-all duration-300 shadow-sm outline-none focus:ring-2 focus:ring-[#7732A6]/50 group ${
          menuOpen 
            ? 'bg-[#7732A6]/10 border-[#7732A6] shadow-md'
            : 'bg-white/90 border-gray-200 hover:border-[#7732A6] hover:bg-[#7732A6]/5 hover:shadow-md'
        }`}
      >
        {user.imageUrl ? (
          <Image 
            src={user.imageUrl} 
            alt={user.firstName || 'Usuário'} 
            width={32} 
            height={32} 
            className="rounded-full border border-transparent group-hover:border-[#7732A6]/30 transition-colors"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7732A6] to-[#F252BA] flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {user.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        
        <span className={`text-sm font-medium max-w-24 truncate hidden sm:block transition-colors ${
          menuOpen ? 'text-[#7732A6]' : 'text-gray-700 group-hover:text-[#7732A6]'
        }`}>
          {user.firstName || 'Usuário'}
        </span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          
          <Link
            href={dashboardLink}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#7732A6] transition-colors group"
          >
            <LayoutDashboard size={16} className="text-gray-400 group-hover:text-[#7732A6] transition-colors" />
            <span>Meu Painel</span>
          </Link>
          
          <Link
            href="/perfil"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#7732A6] transition-colors group"
          >
            <User size={16} className="text-gray-400 group-hover:text-[#7732A6] transition-colors" />
            <span>Meu Perfil</span>
          </Link>
          
          <div className="border-t border-gray-100 mt-1 pt-1">
            <SignOutButton redirectUrl="/">
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
}