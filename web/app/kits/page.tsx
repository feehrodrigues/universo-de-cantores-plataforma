import { client } from "@/lib/sanity";
import { getKitImage } from "@/lib/helpers";
import Link from "next/link";
import Image from "next/image";
import { Search, Music2, ArrowRight, MessageCircle, Sparkles, BookOpen, Music, Star } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";

async function getAllKits() {
  return client.fetch(`
    *[_type == "kit"] | order(_createdAt desc) {
      _id, title, artist, slug, difficulty, coverImage, voices
    }
  `, {}, { next: { revalidate: 60 } });
}

async function getCantatas() {
  return client.fetch(`
    *[_type == "cantata"] | order(_createdAt desc) {
      _id, title, description, slug, "kitCount": count(kits)
    }
  `, {}, { next: { revalidate: 60 } });
}

export default async function AllKitsPage() {
  const [kits, cantatas] = await Promise.all([getAllKits(), getCantatas()]);
  
  // Kits mais recentes (primeiros 6)
  const recentKits = kits.slice(0, 6);
  
  // Filtrar por categorias conhecidas
  const harpaKits = kits.filter((k: any) => 
    k.artist?.toLowerCase().includes('harpa') || k.title?.toLowerCase().includes('harpa')
  );
  const cantorCristaoKits = kits.filter((k: any) => 
    k.artist?.toLowerCase().includes('cantor cristão') || k.title?.toLowerCase().includes('cantor cristão')
  );

  return (
    <PageLayout >
      <div className="min-h-screen">
        {/* HERO - Design elegante com tema */}
        <section className="relative pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-[#7732A6] text-sm font-bold mb-6 border border-[var(--card-border)]">
              <Sparkles size={16} />
              <span>100% Gratuito</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Biblioteca de <span className="text-[#7732A6]">Kits Vocais</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10">
              Kits de ensaio com divisão de vozes para corais, ministérios e grupos vocais. 
              Soprano, Contralto, Tenor e Baixo — sempre em crescimento!
            </p>

            {/* Barra de busca */}
            <form action="/busca" method="get" className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#7732A6]" />
              </div>
              <input 
                type="text" 
                name="q"
                className="w-full p-5 pl-14 text-base text-[var(--foreground)] border border-[var(--input-border)] rounded-full bg-[var(--input-bg)] backdrop-blur-sm focus:ring-2 focus:ring-[#7732A6] focus:border-transparent shadow-lg hover:shadow-xl transition-all placeholder-[var(--foreground-muted)]"
                placeholder="Buscar por música ou artista..."
              />
            </form>
          </div>
        </section>

        {/* ADICIONADOS RECENTEMENTE */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#7732A6] rounded-xl">
                  <Star size={20} className="text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Adicionados Recentemente
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentKits.map((kit: any) => (
                <KitCardCompact key={kit._id} kit={kit} />
              ))}
            </div>
          </div>
        </section>

        {/* CANTATAS */}
        {cantatas.length > 0 && (
          <section className="py-16 bg-[var(--background-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F252BA] rounded-xl">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    Cantatas
                  </h2>
                </div>
                <Link href="/cantatas" className="text-[#7732A6] font-bold hover:underline inline-flex items-center gap-1">
                  Ver todas <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cantatas.slice(0, 3).map((cantata: any) => (
                  <Link href={`/cantatas/${cantata.slug?.current}`} key={cantata._id} className="group">
                    <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#7732A6] via-[#5B21B6] to-[#F252BA] group-hover:scale-110 transition-transform duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-2 leading-tight" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                          {cantata.title}
                        </h3>
                        <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                          {cantata.kitCount} músicas
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HARPA CRISTÃ */}
        {harpaKits.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#7732A6] rounded-xl">
                  <Music size={20} className="text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Harpa Cristã
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {harpaKits.slice(0, 6).map((kit: any) => (
                  <KitCardCompact key={kit._id} kit={kit} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CANTOR CRISTÃO */}
        {cantorCristaoKits.length > 0 && (
          <section className="py-16 bg-[var(--background-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#5CF273] rounded-xl">
                  <Music2 size={20} className="text-gray-900" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Cantor Cristão
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cantorCristaoKits.slice(0, 6).map((kit: any) => (
                  <KitCardCompact key={kit._id} kit={kit} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TODOS OS KITS */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl">
                <Music2 size={20} className="text-[var(--foreground-muted)]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Todos os Kits
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kits.map((kit: any) => (
                <KitCard key={kit._id} kit={kit} />
              ))}
            </div>

            {/* Mensagem se não tiver kits */}
            {kits.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Nenhum kit encontrado</h3>
                <p className="text-[var(--foreground-muted)]">Em breve novos kits serão adicionados!</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA WHATSAPP */}
        <section className="py-16 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-10 md:p-14 text-center backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Não encontrou o kit que procura?
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg mb-8 max-w-xl mx-auto">
                Eu produzo novos Kits de Ensaio toda semana e aceito pedidos gratuitamente.
              </p>
              <a 
                href="https://wa.me/5511977247792?text=Olá Felipe! Gostaria de sugerir um kit vocal..."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <MessageCircle size={22} />
                Pedir no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

// Componente de Card Compacto
function KitCardCompact({ kit }: { kit: any }) {
  return (
    <Link href={`/musica/${kit.slug?.current}`} className="group">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:shadow-lg transition-all shadow-sm backdrop-blur-sm">
        <div className="aspect-square bg-gradient-to-br from-[#7732A6]/10 to-[#F252BA]/10 relative">
          {getKitImage(kit) ? (
            <img
              src={getKitImage(kit)!}
              alt={kit.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-30">🎤</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-bold text-[var(--foreground)] truncate group-hover:text-[#7732A6] transition-colors">
            {kit.title}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] truncate">{kit.artist}</p>
        </div>
      </div>
    </Link>
  );
}

// Componente de Card Completo
function KitCard({ kit }: { kit: any }) {
  return (
    <Link href={`/musica/${kit.slug?.current}`} className="group">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
        {/* Imagem */}
        <div className="relative aspect-video bg-gradient-to-br from-[#7732A6]/20 to-[#F252BA]/20 overflow-hidden">
          {getKitImage(kit) ? (
            <img
              src={getKitImage(kit)!}
              alt={kit.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">🎤</span>
            </div>
          )}
          
          {/* Badge de dificuldade */}
          {kit.difficulty && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
                kit.difficulty.toLowerCase().includes('fácil') || kit.difficulty.toLowerCase().includes('facil')
                  ? 'bg-green-100/90 text-green-700'
                  : kit.difficulty.toLowerCase().includes('avançado') || kit.difficulty.toLowerCase().includes('avancado') || kit.difficulty.toLowerCase().includes('dificil')
                  ? 'bg-red-100/90 text-red-700'
                  : 'bg-amber-100/90 text-amber-700'
              }`}>
                {kit.difficulty === 'facil' ? 'Iniciante' : kit.difficulty === 'medio' ? 'Intermediário' : kit.difficulty === 'dificil' ? 'Avançado' : kit.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-1 group-hover:text-[#7732A6] transition-colors line-clamp-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            {kit.title}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] font-medium uppercase tracking-wide mb-4">
            {kit.artist}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xs text-[var(--foreground-muted)] font-medium">
              {kit.voices?.length ? `${kit.voices.length} vozes` : 'SATB'}
            </span>
            <span className="text-[#7732A6] font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Ouvir <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
