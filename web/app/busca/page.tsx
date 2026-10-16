import { client } from "@/lib/sanity";
import Link from "next/link";
import { Search, SearchX, ArrowRight } from "lucide-react";
import { getKitImage } from "@/lib/helpers";
import PageLayout from "@/app/components/PageLayout";

type Props = {
  searchParams: Promise<{ q: string }>;
}

async function searchKits(term: string) {
  return client.fetch(`
    *[_type == "kit" && title match $term + "*"] | order(_createdAt desc) {
      _id, title, artist, slug, difficulty, coverImage, voices
    }
  `, { term });
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const term = resolvedParams.q || "";
  const kits = await searchKits(term);

  return (
    <PageLayout >
      <div className="min-h-screen">
        {/* HEADER */}
        <section className="relative py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Resultados da Busca
              </h1>
              <p className="text-[var(--foreground-muted)]">
                {kits.length > 0 ? (
                  <>Encontramos <span className="font-bold text-[#7732A6]">{kits.length}</span> resultados para "<span className="font-bold">{term}</span>"</>
                ) : (
                  <>Buscando por "<span className="font-bold">{term}</span>"</>
                )}
              </p>
            </div>

            {/* Barra de busca */}
            <form action="/busca" method="get" className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#7732A6]" />
              </div>
              <input 
                type="text" 
                name="q"
                defaultValue={term}
                className="w-full p-5 pl-14 text-base text-[var(--foreground)] border border-[var(--card-border)] rounded-full bg-[var(--card-bg)] focus:ring-2 focus:ring-[#7732A6] focus:border-transparent shadow-lg hover:shadow-xl transition-all placeholder-gray-400"
                placeholder="Buscar por música ou artista..."
              />
            </form>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {kits.length === 0 ? (
            /* ESTADO VAZIO */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-[#7732A6]/10 rounded-full flex items-center justify-center mb-6">
                <SearchX size={40} className="text-[#7732A6]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Nenhum resultado encontrado
              </h2>
              <p className="text-[var(--foreground-muted)] mb-6 max-w-md">
                Tente buscar pelo nome do artista ou outra palavra-chave. Você também pode pedir um kit pelo WhatsApp!
              </p>
              <div className="flex gap-4">
                <Link href="/" className="btn-secondary">
                  Voltar para Início
                </Link>
                <a 
                  href="https://wa.me/5511977247792?text=Olá Felipe! Não encontrei o kit que procurava..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                Pedir Kit
              </a>
            </div>
          </div>
        ) : (
          /* GRID DE RESULTADOS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kits.map((kit: any) => (
              <Link href={`/musica/${kit.slug?.current}`} key={kit._id} className="group">
                <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--card-border)] h-full flex flex-col">
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
                    {kit.difficulty && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md shadow-sm text-gray-800">
                          {kit.difficulty}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-1 group-hover:text-[#7732A6] transition-colors line-clamp-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                      {kit.title}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] font-medium uppercase tracking-wide mb-4">
                      {kit.artist}
                    </p>
                    <div className="mt-auto flex items-center justify-end">
                      <span className="text-[#7732A6] font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Ouvir <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </section>
      </div>
    </PageLayout>
  );
}
