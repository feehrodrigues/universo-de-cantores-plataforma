'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Music, Mic2, BookOpen, Heart, Youtube, Instagram, MessageCircle, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';

export default function SobreFeliPage() {
  const habilidades = [
    { nome: 'Técnica Vocal', nivel: 95 },
    { nome: 'Produção Musical', nivel: 85 },
    { nome: 'Arranjo Vocal', nivel: 90 },
    { nome: 'Pedagógica', nivel: 88 },
  ];

  const servicosOferecidos = [
    {
      icon: <Mic2 size={24} />,
      title: 'Aulas de Canto',
      description: 'Aulas particulares online e presenciais com metodologia própria.',
    },
    {
      icon: <Music size={24} />,
      title: 'Kits de Ensaio',
      description: 'Produção de kits vocais com divisão de vozes para corais.',
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Conteúdo Educativo',
      description: 'Vídeos, artigos e dicas sobre técnica vocal e canto.',
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/sobre"
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[#7732A6] transition-colors mb-8 font-bold text-sm"
          >
            <ArrowLeft size={16} /> Voltar para Sobre Nós
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Foto */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border-4 border-[#7732A6]/20 shadow-2xl">
                <Image 
                  src="/felipe.jpg" 
                  alt="Felipe Rodrigues - Feeh"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Badge flutuante */}
              <div className="absolute -bottom-4 -right-4 bg-[#7732A6] text-white px-6 py-3 rounded-2xl shadow-lg">
                <p className="text-sm font-bold">Fundador</p>
                <p className="text-xs opacity-80">Universo de Cantores</p>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] backdrop-blur-sm rounded-full px-4 py-2 text-sm text-[var(--foreground)] border border-[var(--card-border)] mb-4">
                <Heart size={16} className="text-[#F252BA]" />
                Olá, eu sou
              </div>
              <h1 
                className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4"
                style={{ fontFamily: 'Comfortaa, sans-serif' }}
              >
                Felipe Rodrigues
              </h1>
              <p className="text-xl text-[#7732A6] font-bold mb-6">
                Músico, Professor de Canto & Produtor de Conteúdo
              </p>
              <p className="text-[var(--foreground-muted)] text-lg leading-relaxed mb-8">
                Sou apaixonado por música desde sempre. Criei o Universo de Cantores 
                com o propósito de ajudar cantores de ministérios, corais e grupos vocais 
                a desenvolverem suas vozes com qualidade e excelência.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <a 
                  href="https://youtube.com/@universodecantores"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all"
                >
                  <Youtube size={20} />
                </a>
                <a 
                  href="https://instagram.com/universodecantores"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-all"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://wa.me/5511977247792"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-all"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minha História */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Minha História
          </h2>
          <div className="bg-[var(--card-bg)] rounded-3xl p-8 md:p-12 border border-[var(--card-border)]">
            <div className="prose prose-lg max-w-none text-[var(--foreground-muted)]">
              <p className="mb-6 leading-relaxed">
                Minha jornada na música começou desde cedo, cantando em grupos e corais. 
                Com o tempo, percebi que muitos cantores, especialmente em ministérios de louvor, 
                tinham dificuldade em encontrar material de ensaio de qualidade.
              </p>
              <p className="mb-6 leading-relaxed">
                Foi assim que nasceu a ideia do <strong className="text-[#7732A6]">Universo de Cantores</strong>: 
                criar kits de ensaio com divisão de vozes para que corais e grupos vocais 
                pudessem ensaiar de forma mais eficiente, mesmo sem um pianista ou maestro presente.
              </p>
              <p className="leading-relaxed">
                Hoje, além dos kits gratuitos, também ofereço aulas particulares de canto 
                para quem deseja desenvolver sua técnica vocal de forma mais profunda e personalizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O que faço */}
      <section className="py-16 px-6 bg-[var(--background-secondary)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4 text-center" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            O que faço
          </h2>
          <p className="text-center text-[var(--foreground-muted)] mb-12 max-w-xl mx-auto">
            Minhas principais atividades no Universo de Cantores
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {servicosOferecidos.map((servico, index) => (
              <div 
                key={index}
                className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--card-border)] hover:shadow-lg transition-all text-center"
              >
                <div className="w-14 h-14 mx-auto bg-[#7732A6]/10 rounded-2xl flex items-center justify-center text-[#7732A6] mb-6">
                  {servico.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  {servico.title}
                </h3>
                <p className="text-[var(--foreground-muted)]">
                  {servico.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Habilidades */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-12 text-center" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Minhas Habilidades
          </h2>

          <div className="space-y-6">
            {habilidades.map((hab, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-[var(--foreground)]">{hab.nome}</span>
                  <span className="text-[#7732A6] font-bold">{hab.nivel}%</span>
                </div>
                <div className="h-3 bg-[var(--background-secondary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7732A6] to-[#F252BA] rounded-full transition-all duration-1000"
                    style={{ width: `${hab.nivel}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA YouTube */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Play size={32} fill="white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Me acompanhe no YouTube
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Dicas de técnica vocal, kits de ensaio novos e muito conteúdo para 
                você evoluir como cantor.
              </p>
              <a 
                href="https://youtube.com/@universodecantores"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100 transition-all"
              >
                <Youtube size={20} /> Inscrever-se no Canal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Aulas */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Quer ter aulas comigo?
          </h2>
          <p className="text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
            Aulas particulares online ou presenciais, com metodologia personalizada 
            para o seu nível e objetivos.
          </p>
          <Link 
            href="/aulas"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#7732A6] text-white rounded-full font-bold hover:bg-[#5B21B6] transition-all"
          >
            Conhecer as Aulas <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
