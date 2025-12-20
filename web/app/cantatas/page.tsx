import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { ArrowLeft, Layers, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#F3F4F6] text-gray-800 pb-20">
      <nav className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition">
          <ArrowLeft size={18} /> Voltar
        </Link>
        <div className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Layers size={20} className="text-purple-600"/> Coleções
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Todas as Cantatas</h1>
            <p className="text-gray-500">Coleções completas para seu ministério.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cantatas.map((cantata: any) => (
                <Link href={`/cantatas/${cantata.slug.current}`} key={cantata._id} className="group">
                    <div className="relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
                        {cantata.coverImage ? (
                            <img src={urlFor(cantata.coverImage).width(600).url()} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-110 transition-transform duration-700" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-200">{cantata.title}</h3>
                            <p className="text-sm text-gray-300 line-clamp-2 mb-4">{cantata.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                    <Layers size={12} /> {cantata.qtd} Músicas
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ver coleção <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </main>
    </div>
  );
}