import { ArrowDown, Mic2, MessageCircle, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import { getKitImage } from "@/lib/helpers";
import SearchInput from "@/app/components/SearchInput";
import Image from "next/image";

// --- 1. BUSCA DE DADOS ---
async function getHomeData() {
  return client.fetch(`{
    "cantatas": *[_type == "cantata"] | order(_createdAt desc)[0...3] {
      _id, title, description, slug, coverImage, 
      "qtd": count(kits)
    },
    "recents": *[_type == "kit"] | order(_createdAt desc)[0...6] {
      _id, title, artist, slug, difficulty, coverImage
    },
    "harpa": *[_type == "kit" && (artist match "Harpa*" || title match "Harpa*")] | order(title asc)[0...4] {
      _id, title, artist, slug, difficulty, coverImage
    }
  }`, {}, { next: { revalidate: 60 } });
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-gray-800 flex flex-col relative">
      
      {/* --- HERO SECTION (TOPO) --- */}
      <div className="min-h-[85vh] flex flex-col justify-between relative bg-gradient-to-b from-gray-50 to-[#F3F4F6]">
        
        {/* CABEÇALHO */}
        <header className="w-full max-w-7xl mx-auto p-6 md:p-10 flex justify-between items-center z-10">
          <div className="text-sm md:text-base font-medium tracking-widest uppercase text-gray-900">
            Universo de Cantores
          </div>
          <Link href="/kits" className="text-sm font-bold text-purple-600 hover:text-purple-800 border border-purple-200 px-4 py-2 rounded-full hover:bg-purple-50 transition">
            VER BIBLIOTECA
          </Link>
        </header>

        {/* CENTRO DA TELA */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          
          {/* Brilho de Fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
          
          {/* LOGO E TEXTO */}
          <div className="mb-8 text-center relative flex flex-col items-center w-full">
            <div className="relative w-full max-w-[400px] md:max-w-[500px]">
              <Image 
                src="/logo.svg" 
                alt="Universo de Cantores" 
                width={0} 
                height={0} 
                sizes="100vw"
                priority 
                className="w-full h-auto drop-shadow-sm"
              />
            </div>
            <p className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto mt-4">
                Kits de ensaio, divisão de vozes e playbacks para o seu ministério.
            </p>
          </div>

          <SearchInput />
          
          <div className="mt-12 flex flex-col items-center gap-2 animate-bounce text-gray-400 text-xs uppercase tracking-widest">
            <span className="bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">Role para explorar</span>
            <ArrowDown size={16} />
          </div>
        </section>
      </div>

      {/* --- SEÇÃO 1: CANTATAS --- */}
      {data.cantatas.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                    <Layers size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Cantatas e Especiais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.cantatas.map((cantata: any) => (
                    <Link href={`/cantatas/${cantata.slug.current}`} key={cantata._id} className="group">
                        <div className="relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer">
                            {cantata.coverImage ? (
                                <img src={urlFor(cantata.coverImage).width(600).url()} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-110 transition-transform duration-700" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-1 leading-tight">{cantata.title}</h3>
                                <p className="text-sm text-gray-300 line-clamp-2 mb-3">{cantata.description}</p>
                                <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                    {cantata.qtd} Músicas
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
      )}

      {/* --- SEÇÃO 2: HARPA CRISTÃ --- */}
      {data.harpa.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2 mb-6">
                📖 Clássicos da Harpa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.harpa.map((kit: any) => (
                    <KitCard key={kit._id} kit={kit} />
                ))}
            </div>
        </section>
      )}

      {/* --- SEÇÃO 3: ÚLTIMOS LANÇAMENTOS --- */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10 pb-20">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Acabaram de Chegar</h2>
            </div>
            <Link href="/kits" className="flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-800 transition">
                Ver todos <ArrowRight size={16} />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.recents.map((kit: any) => (
            <KitCard key={kit._id} kit={kit} />
          ))}
        </div>
      </section>

      {/* --- WHATSAPP --- */}
      <section className="bg-indigo-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Não encontrou o louvor?</h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                Eu produzo novos Kits de Ensaio toda semana e aceito pedidos gratuitamente.
            </p>
            <Link 
                href="https://wa.me/5511977247792?text=Olá Felipe! Gostaria de sugerir um kit vocal..." 
                target="_blank"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
                <MessageCircle size={24} />
                Pedir no WhatsApp
            </Link>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="bg-gray-100 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
        <p className="mb-2">© 2025 Universo de Cantores.</p>
        <p className="text-xs">Desenvolvido com tecnologia Next.js & Sanity.</p>
      </footer>
    </main>
  );
}

// --- CARD PADRÃO ---
function KitCard({ kit }: { kit: any }) {
    return (
        <Link href={`/musica/${kit.slug.current}`} className="group h-full">
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                {getKitImage(kit) ? (
                <img src={getKitImage(kit)!} alt={kit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><Mic2 size={40} /></div>
                )}
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                    {kit.difficulty === 'facil' ? 'Fácil' : kit.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                  </div>
            </div>
            <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-purple-600 transition-colors">{kit.title}</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kit.artist}</p>
            </div>
            </div>
        </Link>
    )
}