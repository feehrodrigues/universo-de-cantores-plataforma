import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { ArrowLeft, Mic2, SearchX } from "lucide-react";
import { getKitImage } from "@/lib/helpers"; // <--- Importe aqui


// Tipagem para receber os parâmetros de busca na URL
type Props = {
  searchParams: Promise<{ q: string }>;
}

async function searchKits(term: string) {
  // A query GROQ usa 'match' para buscar parecido (*termo*)
  return client.fetch(`
    *[_type == "kit" && title match $term + "*"] | order(_createdAt desc) {
      _id,
      title,
      artist,
      slug,
      difficulty,
      coverImage,
      voices
    }
  `, { term });
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const term = resolvedParams.q || ""; // Pega o que a pessoa digitou
  
  const kits = await searchKits(term);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-800">
      
      {/* HEADER SIMPLES */}
      <nav className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition">
          <ArrowLeft size={18} /> Voltar
        </Link>
        <div className="text-sm font-medium text-purple-600">
          Buscando por: "{term}"
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          Resultados da Pesquisa
          <span className="text-sm font-normal bg-gray-200 px-3 py-1 rounded-full text-gray-600">
            {kits.length} encontrados
          </span>
        </h1>

        {kits.length === 0 ? (
          // ESTADO VAZIO (QUANDO NÃO ACHA NADA)
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-200 p-6 rounded-full mb-4">
              <SearchX size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-700">Poxa, não encontramos nada.</h2>
            <p className="text-gray-500 mt-2">Tente buscar pelo nome do artista ou outra palavra-chave.</p>
            <Link href="/" className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-full font-bold hover:bg-purple-700 transition">
              Voltar para o Início
            </Link>
          </div>
        ) : (
          // GRID DE RESULTADOS (Mesmo design da Home)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kits.map((kit: any) => (
              <Link href={`/musica/${kit.slug.current}`} key={kit._id} className="group">
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                  
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
  {/* AQUI MUDOU A LÓGICA */}
  {getKitImage(kit) ? (
    <img 
      src={getKitImage(kit)!} 
      alt={kit.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-300">
      <Mic2 size={40} />
    </div>
                    )}
                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                        {kit.difficulty === 'facil' ? 'Fácil' : kit.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                      </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                      {kit.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-4">
                      {kit.artist}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}