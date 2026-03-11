'use client';

import Link from 'next/link';
import { Users, ArrowRight, CheckCircle, MessageCircle, Mic2, Music, Target, Sparkles, Calendar } from 'lucide-react';
import { useState } from 'react';
import PageLayout from '@/app/components/PageLayout';

export default function AulasPage() {
  const [filterType, setFilterType] = useState('todas');

  const benefits = [
    { icon: <Mic2 size={24} />, title: 'Técnica Vocal', description: 'Respiração, projeção e colocação de voz.' },
    { icon: <Music size={24} />, title: 'Repertório', description: 'Trabalhe músicas do seu ministério.' },
    { icon: <Target size={24} />, title: 'Afinação', description: 'Percepção musical e precisão.' },
    { icon: <Users size={24} />, title: 'Harmonia em Grupo', description: 'Cante em naipes com segurança.' },
  ];

  const classes = [
    {
      id: '1',
      title: 'Aula Avulsa Online',
      description: '1 aula individual online de 60 minutos',
      price: 50,
      type: 'avulsa',
      benefits: ['Duração: 60 min', 'Videochamada ao vivo', 'Briefing personalizado', 'Sem compromisso'],
      highlight: false,
    },
    {
      id: '2',
      title: 'Aula Avulsa Presencial',
      description: '1 aula individual presencial de 60 minutos',
      price: 70,
      type: 'avulsa',
      benefits: ['Duração: 60 min', 'Aula presencial', 'Acompanhamento direto', 'Sem compromisso'],
      highlight: false,
    },
    {
      id: '3',
      title: 'Plano Mensal Online',
      description: '4 aulas online em 1 mês com objetivo personalizado',
      price: 160,
      pricePerLesson: 40,
      type: 'mensal',
      benefits: ['4 aulas de 60 min/mês', 'Plano personalizado', 'Briefing completo', 'Relatórios de evolução', 'Dashboard exclusivo'],
      highlight: true,
    },
    {
      id: '4',
      title: 'Plano Mensal Presencial',
      description: '4 aulas presenciais em 1 mês com objetivo personalizado',
      price: 230,
      pricePerLesson: 57.5,
      type: 'mensal',
      benefits: ['4 aulas de 60 min/mês', 'Aula presencial', 'Plano personalizado', 'Relatórios de evolução', 'Dashboard exclusivo'],
      highlight: false,
    },
    {
      id: '5',
      title: 'Programa Belting 3 Meses',
      description: 'Curso intensivo de belting com 12 aulas em 3 meses',
      price: 450,
      pricePerLesson: 37.5,
      type: 'intensivo',
      benefits: ['12 aulas de 60 min', 'Foco em técnica belting', 'Acompanhamento semanal', 'Material de apoio', 'Orientação de palco'],
      highlight: false,
    },
    {
      id: '6',
      title: 'Programa Belting Presencial',
      description: 'Curso intensivo presencial de belting com 12 aulas em 3 meses',
      price: 640,
      pricePerLesson: 53.33,
      type: 'intensivo',
      benefits: ['12 aulas de 60 min', 'Aulas presenciais', 'Acompanhamento intensivo', 'Material de apoio', 'Mentoria individual'],
      highlight: false,
    },
  ];

  const filteredClasses = filterType === 'todas' ? classes : classes.filter((c) => c.type === filterType);

  const handleSelectPlan = (title: string) => {
    const message = `Olá! Tenho interesse nas aulas de canto - ${title}. Gostaria de mais informações.`;
    window.open(`https://wa.me/5511977247792?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <PageLayout>
      {/* Hero - usa o fundo global, sem overlay escuro */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] backdrop-blur-sm rounded-full px-4 py-2 text-sm text-[var(--foreground)] border border-[var(--card-border)] mb-6">
            <Sparkles size={16} className="text-[#7732A6]" />
            Aulas ao vivo online
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6"
            style={{ fontFamily: 'Comfortaa, sans-serif' }}
          >
            Desenvolva sua voz com{' '}
            <span className="text-[#7732A6]">aulas particulares</span>
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] mb-8 max-w-2xl mx-auto">
            Aulas personalizadas para cantores de ministérios, corais e qualquer pessoa 
            que deseja evoluir sua técnica vocal.
          </p>
          <a
            href="#planos"
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            Ver planos <Calendar size={20} />
          </a>
        </div>
      </section>

      {/* Benefícios - usa cards com tema */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4"
              style={{ fontFamily: 'Comfortaa, sans-serif' }}
            >
              O que você vai aprender
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
              Cada aula é adaptada ao seu nível e objetivos pessoais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl p-6 border border-[var(--card-border)] hover:shadow-lg transition-all duration-300"
              >
                <div className="text-[#7732A6] mb-4">{benefit.icon}</div>
                <h3 
                  className="text-lg font-bold text-[var(--foreground)] mb-2"
                  style={{ fontFamily: 'Comfortaa, sans-serif' }}
                >
                  {benefit.title}
                </h3>
                <p className="text-[var(--foreground-muted)] text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtros e Planos */}
      <section id="planos" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 
              className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4"
              style={{ fontFamily: 'Comfortaa, sans-serif' }}
            >
              Escolha seu plano
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto mb-8">
              Comece quando quiser. Todas as aulas são ao vivo e personalizadas.
            </p>

            {/* Filtros */}
            <div className="flex gap-2 justify-center flex-wrap mb-12">
              {[
                { label: 'Todas', value: 'todas' },
                { label: 'Avulsas', value: 'avulsa' },
                { label: 'Mensais', value: 'mensal' },
                { label: 'Intensivos', value: 'intensivo' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
                    filterType === filter.value
                      ? 'bg-[#7732A6] text-white shadow-lg'
                      : 'bg-[var(--card-bg)] text-[var(--foreground-muted)] border border-[var(--card-border)] hover:border-[#7732A6]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((aula) => (
              <div
                key={aula.id}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col ${
                  aula.highlight 
                    ? 'bg-gradient-to-b from-[#7732A6] to-[#5B21B6] text-white shadow-2xl scale-105' 
                    : 'bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--card-border)] text-[var(--foreground)] hover:shadow-lg'
                }`}
              >
                {aula.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F2D338] text-gray-900 text-xs font-bold px-4 py-1 rounded-full">
                    MAIS POPULAR
                  </div>
                )}
                
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'Comfortaa, sans-serif' }}
                >
                  {aula.title}
                </h3>
                <p className={`text-sm mb-4 ${aula.highlight ? 'opacity-80' : 'text-[var(--foreground-muted)]'}`}>{aula.description}</p>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">R$ {aula.price}</span>
                  {aula.type === 'mensal' && <span className={`text-sm ${aula.highlight ? 'opacity-70' : 'text-[var(--foreground-muted)]'}`}>/mês</span>}
                  {aula.type === 'intensivo' && <span className={`text-sm ${aula.highlight ? 'opacity-70' : 'text-[var(--foreground-muted)]'}`}>/3 meses</span>}
                </div>
                {aula.pricePerLesson && (
                  <p className={`text-xs mb-4 ${aula.highlight ? 'opacity-60' : 'text-[var(--foreground-muted)]'}`}>R$ {aula.pricePerLesson.toFixed(2)}/aula</p>
                )}

                <ul className="space-y-3 mb-8 flex-1">
                  {aula.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} className={aula.highlight ? 'text-[#F2D338]' : 'text-[#7732A6]'} />
                      <span className={aula.highlight ? 'opacity-90' : ''}>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(aula.title)}
                  className={`w-full py-3 px-6 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${
                    aula.highlight
                      ? 'bg-[#F2D338] text-gray-900 hover:bg-[#E5C72F]'
                      : 'bg-[#7732A6] text-white hover:opacity-90'
                  }`}
                >
                  Escolher <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 
            className="text-3xl md:text-4xl font-bold text-[var(--foreground)] text-center mb-12"
            style={{ fontFamily: 'Comfortaa, sans-serif' }}
          >
            Dúvidas Frequentes
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Posso cancelar meu plano a qualquer momento?',
                a: 'Sim! Você pode cancelar seu plano mensal sem multa. Basta avisar com duas aulas de antecedência.',
              },
              {
                q: 'Como funcionam as aulas online?',
                a: 'Você recebe um link de videochamada antes de cada aula. Basta clicar e entrar — funciona pelo navegador, sem precisar instalar nada.',
              },
              {
                q: 'Qual é a diferença entre online e presencial?',
                a: 'Nas aulas online você estuda de casa por videochamada. Nas presenciais, nos encontramos pessoalmente para a aula.',
              },
              {
                q: 'O que são os relatórios de evolução?',
                a: 'São documentos que acompanham seu progresso a cada aula. Neles, registro o que trabalhamos, seus pontos fortes, o que ainda pode melhorar, e os exercícios recomendados para praticar em casa. Assim você consegue ver sua evolução ao longo do tempo!',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-lg border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>{item.q}</h3>
                <p className="text-[var(--foreground-muted)]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="bg-[var(--card-bg)] rounded-3xl p-10 shadow-xl border border-[var(--card-border)]">
            <MessageCircle size={40} className="mx-auto mb-6 text-[#7732A6]" />
            <h2 
              className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4"
              style={{ fontFamily: 'Comfortaa, sans-serif' }}
            >
              Não tem certeza qual escolher?
            </h2>
            <p className="text-[var(--foreground-muted)] mb-8">
              Comece com uma aula avulsa para conhecer a metodologia. Fale no WhatsApp!
            </p>
            <a
              href="https://wa.me/5511977247792?text=Olá! Gostaria de tirar algumas dúvidas sobre as aulas de canto."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
