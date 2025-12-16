import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import VideoPlayer from "@/app/components/VideoPlayer";
import Link from "next/link";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { Metadata } from "next"; 

// --- AQUI ESTAVA O ERRO ---
// No Next.js 15/16, params é uma Promise. Precisamos tipar assim:
type Props = {
  params: Promise<{ slug: string }>;
}

async function getKit(slug: string) {
  return client.fetch(`
    *[_type == "kit" && slug.current == $slug][0] {
      title,
      artist,
      difficulty,
      coverImage,
      voices,
      lyricsAndTips
    }
  `, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const kit = await getKit(resolvedParams.slug);

  if (!kit) {
    return {
      title: "Kit não encontrado | Universo de Cantores",
    };
  }

  // BLINDAGEM: Só tenta gerar imagem se ela existir
  const ogImages = [];
  if (kit.coverImage) {
    ogImages.push(urlFor(kit.coverImage).width(800).url());
  }

  return {
    title: `${kit.title} - Kit de Ensaio | Universo de Cantores`,
    description: `Aprenda a cantar ${kit.title} (${kit.artist}). Kit de ensaio com vozes separadas.`,
    openGraph: {
      images: ogImages, 
    },
  };
}

export default async function KitPage({ params }: Props) {
  // --- A CORREÇÃO MÁGICA ---
  // Primeiro a gente "espera" os parâmetros chegarem
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Agora buscamos o kit usando o slug resolvido
  const kit = await getKit(slug);

  if (!kit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Kit não encontrado 😕</h1>
        <Link href="/" className="text-purple-600 hover:underline">Voltar para o início</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-800 pb-20">
      
      {/* HEADER DE NAVEGAÇÃO */}
      <nav className="max-w-7xl mx-auto p-6 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition">
          <ArrowLeft size={18} /> Voltar para Home
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2">
              {kit.title}
            </h1>
            <p className="text-lg text-gray-500 font-medium uppercase tracking-wide flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                {kit.difficulty === 'facil' ? 'Fácil' : kit.difficulty === 'medio' ? 'Médio' : 'Difícil'}
              </span>
              {kit.artist}
            </p>
          </div>

          {/* PLAYER */}
          {kit.voices && <VideoPlayer voices={kit.voices} />}

          {/* ADSENSE HORIZONTAL */}
          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300">
            Espaço Publicitário (Google AdSense)
          </div>

          {/* LETRA E DICAS */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-purple max-w-none">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-purple-500" />
              Dicas e Letra
            </h3>
            {kit.lyricsAndTips ? (
              <PortableText value={kit.lyricsAndTips} />
            ) : (
              <p className="text-gray-400 italic">Nenhuma dica cadastrada para este kit ainda.</p>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <aside className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-2">Precisa dos Arquivos?</h3>
            <p className="text-indigo-200 text-sm mb-6">
              Baixe os áudios em MP3 e as Cifras Vocalizadas.
            </p>
            <button className="w-full bg-white text-indigo-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition">
              <Download size={20} />
              Baixar Material
            </button>
          </div>

           {/* ADSENSE VERTICAL */}
           <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 sticky top-10">
            Publicidade Vertical
          </div>
        </aside>

      </main>
    </div>
  );
}