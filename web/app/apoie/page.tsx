import { Heart, Youtube, Coffee, CreditCard, ExternalLink, QrCode } from 'lucide-react';
import PageLayout from '@/app/components/PageLayout';
import CopyButton from '@/app/components/CopyButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apoie | Universo de Cantores',
  description: 'Ajude o Universo de Cantores a continuar produzindo kits vocais gratuitos. Doe via PIX, PayPal ou se inscreva no YouTube!',
};

export default function ApoiePage() {
  // TODO: Configurar as chaves PIX e links reais
  const pixKey = 'universodecantores@email.com'; // Trocar pela chave PIX real
  const paypalLink = 'https://paypal.me/universodecantores'; // Trocar pelo link real
  const youtubeChannel = 'https://youtube.com/@universodecantores';

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#7732A6] via-[#5B21B6] to-[#F252BA] pt-28 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <Heart size={40} className="text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Apoie o Projeto 💜
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              O Universo de Cantores é um projeto <strong>100% gratuito</strong>. 
              Seu apoio nos ajuda a continuar produzindo kits vocais para corais e ministérios!
            </p>
          </div>
        </section>

        {/* Formas de Apoio */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* YouTube - Gratuito */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--card-border)] shadow-lg">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center flex-shrink-0">
                  <Youtube size={32} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                      Inscreva-se no YouTube
                    </h2>
                    <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-full">
                      GRÁTIS
                    </span>
                  </div>
                  
                  <p className="text-[var(--foreground-muted)] mb-6">
                    A forma mais fácil de ajudar! Quanto mais inscritos, mais visibilidade 
                    o canal ganha e mais pessoas podem conhecer os kits vocais.
                  </p>
                  
                  <a
                    href={`${youtubeChannel}?sub_confirmation=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition"
                  >
                    <Youtube size={20} />
                    Inscrever-se no Canal
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* PIX */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--card-border)] shadow-lg">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <QrCode size={32} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    Doe via PIX
                  </h2>
                  
                  <p className="text-[var(--foreground-muted)] mb-6">
                    Faça uma doação de qualquer valor! Cada contribuição nos ajuda a manter 
                    o projeto funcionando e produzir novos kits.
                  </p>
                  
                  <div className="bg-[var(--background-secondary)] rounded-2xl p-4 mb-4">
                    <p className="text-sm text-[var(--foreground-muted)] mb-2">Chave PIX (E-mail):</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <code className="text-lg font-mono text-[#7732A6] bg-[var(--card-bg)] px-4 py-2 rounded-lg">
                        {pixKey}
                      </code>
                      <CopyButton text={pixKey} label="Copiar" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-[var(--foreground-muted)] italic">
                    💡 Dica: Após doar, tire print e mande no nosso Instagram para agradecermos publicamente!
                  </p>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-8 border border-[var(--card-border)] shadow-lg">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={32} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    Doe via PayPal
                  </h2>
                  
                  <p className="text-[var(--foreground-muted)] mb-6">
                    Para quem está fora do Brasil ou prefere usar cartão de crédito internacional.
                  </p>
                  
                  <a
                    href={paypalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition"
                  >
                    <CreditCard size={20} />
                    Doar com PayPal
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Cafezinho */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl p-8 border border-amber-500/30">
              <div className="text-center">
                <Coffee size={48} className="mx-auto mb-4 text-amber-500" />
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Me pague um cafezinho! ☕
                </h2>
                <p className="text-[var(--foreground-muted)] mb-6 max-w-lg mx-auto">
                  Não precisa ser muito — um cafezinho de R$ 5 já alegra o dia e ajuda 
                  a manter a produção dos kits vocais!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-amber-500/20 text-amber-600 rounded-full font-bold">
                    R$ 5
                  </span>
                  <span className="px-4 py-2 bg-amber-500/20 text-amber-600 rounded-full font-bold">
                    R$ 10
                  </span>
                  <span className="px-4 py-2 bg-amber-500/20 text-amber-600 rounded-full font-bold">
                    R$ 20
                  </span>
                  <span className="px-4 py-2 bg-amber-500/20 text-amber-600 rounded-full font-bold">
                    Valor livre
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Agradecimento */}
        <section className="py-16 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Muito Obrigado! 💜
            </h2>
            <p className="text-[var(--foreground-muted)]">
              Cada inscrição, compartilhamento e doação faz diferença. Graças ao seu apoio, 
              milhares de cantores em todo o Brasil podem ensaiar suas vozes gratuitamente.
              <br /><br />
              <strong>Que Deus abençoe você!</strong>
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
