import { client } from "@/lib/sanity";
import { getKitImage } from "@/lib/helpers";
import Link from "next/link";
import { ArrowLeft, Mic2, Layers } from "lucide-react";

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

  if (!cantata) return <div>Cantata não encontrada</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-800 pb-20">
      
      {/* Header */}
      <nav className="max-w-7xl mx-auto p-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition">
          <ArrowLeft size={18} /> Voltar para Home
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        
        {/* Cabeçalho da Cantata */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100 mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-purple-100 p-6 rounded-2xl">
                    <Layers size={48} className="text-purple-600" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">{cantata.title}</h1>
                    <p className="text-lg text-gray-500">{cantata.description}</p>
                    <div className="mt-4 inline-block bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        {cantata.kits ? cantata.kits.length : 0} Músicas
                    </div>
                </div>
            </div>
        </div>

        {/* Lista de Músicas (Reaproveitando o Design) */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-purple-500">
            Repertório
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cantata.kits && cantata.kits.map((kit: any, index: number) => (
            <Link href={`/musica/${kit.slug.current}`} key={kit._id} className="group flex">
              
              {/* Card estilo Lista */}
              <div className="bg-white w-full rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex items-center gap-4">
                
                {/* Número da Faixa */}
                <span className="text-2xl font-bold text-gray-200 group-hover:text-purple-200 transition">
                    {index + 1}
                </span>

                <div className="relative h-16 w-16 min-w-[64px] rounded-lg overflow-hidden bg-gray-100">
                  {getKitImage(kit) ? (
                    <img src={getKitImage(kit)!} alt={kit.title} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Mic2 size={20} /></div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-purple-600 transition">
                    {kit.title}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase">{kit.artist}</p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}