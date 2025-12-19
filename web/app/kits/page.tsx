import { client } from "@/lib/sanity";
import { getKitImage } from "@/lib/helpers"; // Importando nossa função de imagem automática
import Link from "next/link";
import { ArrowLeft, Mic2, Search } from "lucide-react";

async function getAllKits() {
  return client.fetch(`
    *[_type == "kit"] | order(_createdAt desc) {
      _id, title, artist, slug, difficulty, coverImage, voices
    }
  `, {}, { next: { revalidate: 60 } });
}

export default async function AllKitsPage() {
  const kits = await getAllKits();

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-800 pb-20">
      {/* Header */}
      <nav className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition">
          <ArrowLeft size={18} /> Voltar
        </Link>
        <div className="text-xl font-bold text-indigo-900">Biblioteca Completa</div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Todos os Kits ({kits.length})</h1>
            {/* Atalho para busca */}
            <Link href="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-gray-500 hover:shadow-md transition">
                <Search size={16}/> Buscar música específica
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kits.map((kit: any) => (
            <Link href={`/musica/${kit.slug.current}`} key={kit._id} className="group">
              <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {getKitImage(kit) ? (
                    <img src={getKitImage(kit)!} alt={kit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Mic2 size={40} /></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-purple-600">{kit.title}</h3>
                  <p className="text-sm text-gray-500 uppercase">{kit.artist}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}