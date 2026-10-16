'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Music, Users, Heart, Target, ArrowRight, Youtube, Instagram, MessageCircle } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';

export default function SobrePage() {
  const valores = [
    {
      icon: <Music size={28} />,
      title: 'Música com Propósito',
      description: 'Acreditamos que a música é uma ferramenta poderosa para transformar vidas e conectar pessoas.',
    },
    {
      icon: <Users size={28} />,
      title: 'Comunidade',
      description: 'Construímos uma comunidade de cantores que se apoiam e crescem juntos na jornada musical.',
    },
    {
      icon: <Heart size={28} />,
      title: 'Paixão pelo Ensino',
      description: 'Cada aula, cada kit vocal é feito com dedicação para que você evolua de verdade.',
    },
    {
      icon: <Target size={28} />,
      title: 'Excelência Acessível',
      description: 'Conteúdo de qualidade profissional disponível gratuitamente para todos os cantores.',
    },
  ];

  const numeros = [
    { valor: '100+', label: 'Kits Vocais Gratuitos' },
    { valor: '4', label: 'Vozes por Kit' },
    { valor: '∞', label: 'Paixão pela Música' },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] backdrop-blur-sm rounded-full px-4 py-2 text-sm text-[var(--foreground)] border border-[var(--card-border)] mb-6">
            <Heart size={16} className="text-[#F252BA]" />
            Nossa História
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6"
            style={{ fontFamily: 'Comfortaa, sans-serif' }}
          >
            Universo de{' '}
            <span className="text-[#7732A6]">Cantores</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
            Uma plataforma criada para democratizar o acesso à educação vocal de qualidade, 
            oferecendo ferramentas gratuitas para cantores de todos os níveis.
          </p>
        </div>
      </section>

      {/* Missão */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#7732A6] to-[#5B21B6] rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Nossa Missão
              </h2>
              <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
                Capacitar cantores de ministérios, corais e grupos vocais com ferramentas 
                gratuitas e ensino de qualidade. Acreditamos que todo cantor merece 
                acesso a recursos profissionais para desenvolver seu potencial vocal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O que oferecemos */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            O que oferecemos
          </h2>
          <p className="text-center text-[var(--foreground-muted)] mb-12 max-w-2xl mx-auto">
            Duas frentes de atuação para atender cantores de todos os níveis
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Kits Vocais */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--card-border)] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#72F2F2]/20 rounded-2xl flex items-center justify-center text-[#72F2F2] mb-6">
                <Music size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Kits Vocais Gratuitos
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
                Kits de ensaio com divisão de vozes (Soprano, Contralto, Tenor e Baixo) 
                para músicas clássicas da Harpa Cristã, Cantor Cristão e outros hinários. 
                Perfeito para ensaios de corais e grupos vocais.
              </p>
              <Link 
                href="/kits"
                className="inline-flex items-center gap-2 text-[#7732A6] font-bold hover:gap-3 transition-all"
              >
                Explorar Kits <ArrowRight size={18} />
              </Link>
            </div>

            {/* Aulas */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--card-border)] hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#F252BA]/20 rounded-2xl flex items-center justify-center text-[#F252BA] mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Aulas de Canto
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
                Aulas particulares online e presenciais com acompanhamento personalizado. 
                Briefing antes de cada aula, relatórios de evolução e dashboard para 
                acompanhar seu progresso vocal.
              </p>
              <Link 
                href="/aulas"
                className="inline-flex items-center gap-2 text-[#7732A6] font-bold hover:gap-3 transition-all"
              >
                Conhecer Aulas <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-16 px-6 bg-[var(--background-secondary)]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {numeros.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-black text-[#7732A6] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  {item.valor}
                </p>
                <p className="text-sm text-[var(--foreground-muted)] font-bold uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Nossos Valores
          </h2>
          <p className="text-center text-[var(--foreground-muted)] mb-12 max-w-xl mx-auto">
            Os princípios que guiam tudo o que fazemos
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor, index) => (
              <div 
                key={index}
                className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--card-border)] hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-[#7732A6] mb-4">{valor.icon}</div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  {valor.title}
                </h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fundador */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--card-bg)] rounded-3xl p-8 md:p-12 border border-[var(--card-border)] text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#7732A6]/20">
              <Image 
                src="/felipe.jpg" 
                alt="Felipe Rodrigues"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Felipe Rodrigues
            </h3>
            <p className="text-[#7732A6] font-bold mb-4">Fundador & CEO</p>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto mb-6">
              Músico e professor de canto apaixonado por ajudar cantores a descobrirem 
              todo o potencial de suas vozes.
            </p>
            <Link 
              href="/sobre/felipe"
              className="inline-flex items-center gap-2 text-[#7732A6] font-bold hover:gap-3 transition-all"
            >
              Conhecer mais <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Siga o Universo de Cantores
          </h2>
          <div className="flex justify-center gap-4">
            <a 
              href="https://youtube.com/@universodecantores"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all"
            >
              <Youtube size={20} /> YouTube
            </a>
            <a 
              href="https://instagram.com/universodecantores"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:opacity-90 transition-all"
            >
              <Instagram size={20} /> Instagram
            </a>
            <a 
              href="https://wa.me/5511977247792"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all"
            >
              <MessageCircle size={20} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
