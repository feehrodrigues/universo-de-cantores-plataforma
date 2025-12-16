import { Search, Menu, ArrowDown, Mic2 } from "lucide-react"; // Adicionei Mic2
import Link from "next/link";
import { client, urlFor } from "@/lib/sanity"; // Importando nossa conexão
import SearchInput from "@/app/components/SearchInput"; 


// 1. Definição do Tipo de Dados (TypeScript)
interface Kit {
  _id: string;
  title: string;
  artist: string;
  slug: { current: string };
  difficulty: string;
  coverImage: any;
  voices: any[];
}

// 2. Função para buscar os dados no Sanity (GROQ Query)
async function getKits() {
  return client.fetch<Kit[]>(`
    *[_type == "kit"] | order(_createdAt desc) {
      _id,
      title,
      artist,
      slug,
      difficulty,
      coverImage,
      voices
    }
  `);
}

export default async function Home() {
  const kits = await getKits(); // Buscando os dados antes de renderizar

  return (
    // REMOVIDO 'overflow-hidden' para permitir rolar a página
    <main className="min-h-screen bg-[#F3F4F6] text-gray-800 flex flex-col relative">
      
      {/* --- SEÇÃO 1: HERO (TELA INICIAL) --- */}
      <div className="min-h-screen flex flex-col justify-between relative">
        
        {/* HEADER */}
        <header className="w-full max-w-7xl mx-auto p-6 md:p-10 flex justify-between items-center z-10">
          <div className="text-sm md:text-base font-medium tracking-widest uppercase text-gray-900">
            Por Felipe Rodrigues
          </div>
          <button className="p-2 hover:bg-gray-200 rounded-full transition">
            <Menu className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
          </button>
        </header>

        {/* CENTRO */}
        
        <section className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

          <div className="mb-10 text-center relative">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm">
              universo<br/>de cantores
            </h1>
          </div>

          {/* Substitua toda a div da barra de busca antiga por isso: */}
  <SearchInput />
  
</section>

        {/* FOOTER DO HERO */}
        <div className="w-full max-w-7xl mx-auto p-6 md:p-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 z-10">
          <Link 
            href="https://youtube.com/@universodecantores" 
            target="_blank"
            className="text-sm font-medium tracking-wider uppercase hover:text-purple-600 transition"
          >
            www.youtube.com/@universodecantores
          </Link>

          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs font-medium tracking-widest uppercase">Arraste para baixo</span>
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* --- SEÇÃO 2: LISTA DE KITS (ONDE APARECEM OS DADOS) --- */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-20" id="kits">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">Últimos Lançamentos</h2>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kits.map((kit) => (
            <Link href={`/musica/${kit.slug.current}`} key={kit._id} className="group">
              <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                
                {/* Imagem da Capa */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {kit.coverImage ? (
                    <img 
                      src={urlFor(kit.coverImage).width(500).url()} 
                      alt={kit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Mic2 size={40} />
                    </div>
                  )}
                  
                  {/* Etiqueta de Dificuldade */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                    {kit.difficulty === 'facil' ? 'Fácil' : kit.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                  </div>
                </div>

                {/* Informações */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                    {kit.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-4">
                    {kit.artist}
                  </p>
                  
                  {/* Badges de Vozes */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {kit.voices && kit.voices.map((voz: any, index: number) => (
                      <span key={index} className="text-[10px] uppercase font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                        {voz.voiceType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}