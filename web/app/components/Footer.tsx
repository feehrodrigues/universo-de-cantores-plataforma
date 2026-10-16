import Link from 'next/link';
import { Youtube, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--background-secondary)] border-t border-[var(--card-border)]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-[#7732A6] mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Universo de Cantores
            </h3>
            <p className="text-sm text-[var(--foreground-muted)] mb-4 leading-relaxed">
              A música é a linguagem universal
            </p>
            <div className="flex gap-3">
              <SocialLink href="https://youtube.com/@universodecantores" icon={<Youtube size={18} />} />
              <SocialLink href="https://instagram.com/universodecantores" icon={<Instagram size={18} />} />
              <SocialLink href="https://wa.me/5511977247792" icon={<MessageCircle size={18} />} />
            </div>
          </div>

          {/* Biblioteca */}
          <div>
            <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">Biblioteca</h4>
            <ul className="space-y-3">
              <FooterLink href="/kits">Kits Vocais</FooterLink>
              <FooterLink href="/cantatas">Cantatas</FooterLink>
              <FooterLink href="/busca">Buscar</FooterLink>
            </ul>
          </div>

          {/* Aprender */}
          <div>
            <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">Aprender</h4>
            <ul className="space-y-3">
              <FooterLink href="/aulas">Aulas de Canto</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="https://youtube.com/@universodecantores">YouTube</FooterLink>
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">Sobre</h4>
            <ul className="space-y-3">
              <FooterLink href="/sobre">Universo de Cantores</FooterLink>
              <FooterLink href="/sobre/felipe">Felipe Rodrigues</FooterLink>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4">Contato</h4>
            <ul className="space-y-3">
              <FooterLink href="https://wa.me/5511977247792">WhatsApp</FooterLink>
              <FooterLink href="mailto:contato@universodecantores.com.br">Email</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--foreground-muted)]">
            <p>© {new Date().getFullYear()} Universo de Cantores. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/privacidade" className="hover:text-[#7732A6] transition-colors">Privacidade</Link>
              <Link href="/termos" className="hover:text-[#7732A6] transition-colors">Termos</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('http');
  return (
    <li>
      <Link 
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-sm text-[var(--foreground-muted)] hover:text-[#7732A6] transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[#7732A6]/10 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[#7732A6] transition-all"
    >
      {icon}
    </a>
  );
}

