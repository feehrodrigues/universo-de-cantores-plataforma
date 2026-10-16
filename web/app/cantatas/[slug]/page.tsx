import { client } from "@/lib/sanity";
import { getKitImage } from "@/lib/helpers";
import Link from "next/link";
import { ArrowLeft, Mic2, Layers, Music2 } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";

// Tipagem
type Props = {
  params: Promise<{ slug: string }>;
}

async function getCantata(slug: string) {
  return client.fetch(`
    *[_type == "cantata" && slug.current == $slug][0] {
      title,
      description,
      "kits": kits[]->{
        _id,
        title,
        artist,
        slug,
        difficulty,
        coverImage,
        voices
      }
    }
  `, { slug }, { next: { revalidate: 60 } });
}

export default async function CantataPage({ params }: Props) {
  const resolvedParams = await params;
  const cantata = await getCantata(resolvedParams.slug);

  if (!cantata) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Cantata não encontrada
            </h1>
            <Link href="/cantatas" className="text-[#7732A6] hover:underline">
              Voltar para Cantatas
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero da Cantata - Design elegante com tema */}
        <section className="pt-28 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/cantatas" 
              className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-8 transition-all"
            >
              <ArrowLeft size={18} /> Voltar para Cantatas
            </Link>
            
            <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl p-8 border border-[var(--card-border)]">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-[#7732A6]/20 p-6 rounded-2xl">
                  <Layers size={48} className="text-[#7732A6]" />
                </div>
                <div>
                  <h1 
                    className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2"
                    style={{ fontFamily: 'Comfortaa, sans-serif' }}
                  >
                    {cantata.title}
                  </h1>
                  <p className="text-lg text-[var(--foreground-muted)] mb-4">{cantata.description}</p>
                  <span className="inline-block bg-[#7732A6] text-white px-4 py-1 rounded-full text-sm font-bold">
                    {cantata.kits ? cantata.kits.length : 0} Músicas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Músicas */}
        <section className="py-10 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-2xl font-bold text-[var(--foreground)] mb-8 flex items-center gap-3"
              style={{ fontFamily: 'Comfortaa, sans-serif' }}
            >
              <Music2 className="text-[#7732A6]" />
              Repertório
            </h2>

            <div className="space-y-4">
              {cantata.kits && cantata.kits.map((kit: any, index: number) => (
                <Link href={`/musica/${kit.slug.current}`} key={kit._id} className="group block">
                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 hover:shadow-lg transition-all flex items-center gap-4 backdrop-blur-sm">
                    
                    {/* Número da Faixa */}
                    <span className="text-2xl font-bold text-[var(--foreground-muted)] group-hover:text-[#7732A6] transition w-8 text-center">
                      {index + 1}
                    </span>

                    <div className="relative h-16 w-16 min-w-[64px] rounded-xl overflow-hidden bg-[var(--background-secondary)]">
                      {getKitImage(kit) ? (
                        <img src={getKitImage(kit)!} alt={kit.title} className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)]">
                          <Mic2 size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-bold text-[var(--foreground)] leading-tight group-hover:text-[#7732A6] transition">
                        {kit.title}
                      </h3>
                      <p className="text-xs text-[var(--foreground-muted)] uppercase">{kit.artist}</p>
                  </div>

                  {/* Indicador de dificuldade */}
                  {kit.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      kit.difficulty === 'facil' ? 'bg-green-100 text-green-600' :
                      kit.difficulty === 'medio' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {kit.difficulty}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </div>
    </PageLayout>
  );
}