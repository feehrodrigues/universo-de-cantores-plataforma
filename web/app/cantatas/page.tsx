import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";

// Configuração para atualizar a cada 60s
export const revalidate = 60;

async function getAllCantatas() {
  return client.fetch(`
    *[_type == "cantata"] | order(_createdAt desc) {
      _id, title, description, slug, coverImage, "qtd": count(kits)
    }
  `);
}

export default async function AllCantatasPage() {
  const cantatas = await getAllCantatas();

  return (
    <PageLayout >
      <div className="min-h-screen">
        {/* HERO - Design elegante com tema */}
        <section className="relative pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-[#7732A6] text-sm font-bold mb-6 border border-[var(--card-border)]">
              <Layers size={16} />
              <span>Coleções Completas</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Cantatas e <span className="text-[#7732A6]">Especiais</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Coleções completas para seu ministério. Cada cantata contém todos os kits de ensaio das músicas do projeto.
            </p>
          </div>
        </section>

        {/* GRID DE CANTATAS */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cantatas.map((cantata: any) => (
                <Link href={`/cantatas/${cantata.slug?.current}`} key={cantata._id} className="group">
                  <div className="relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Background */}
                    {cantata.coverImage ? (
                      <img 
                        src={urlFor(cantata.coverImage).width(600).url()} 
                        alt={cantata.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#7732A6] via-[#5B21B6] to-[#F252BA] group-hover:scale-110 transition-transform duration-700" />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Conteúdo */}
                    <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-[#F252BA] transition-colors" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                        {cantata.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                        {cantata.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                          <Layers size={14} /> {cantata.qtd} Músicas
                        </span>
                        <span className="flex items-center gap-1 text-sm font-bold uppercase opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                          Explorar <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mensagem se não tiver cantatas */}
            {cantatas.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎼</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Nenhuma cantata encontrada</h3>
                <p className="text-[var(--foreground-muted)]">Em breve novas coleções serão adicionadas!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
