import { client, urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import VideoPlayer from "@/app/components/VideoPlayer";
import ProtectedDownloadButton from "@/app/components/ProtectedDownloadButton";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Music2 } from "lucide-react";
import { Metadata } from "next"; 
import PageLayout from "@/app/components/PageLayout";

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
      lyricsAndTips,
      driveLink,
      "sheetMusicUrl": sheetMusicFile.asset->url
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
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-32">
          <Music2 size={64} className="text-[var(--foreground-muted)]" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Kit não encontrado 😕
          </h1>
          <Link href="/kits" className="text-[#7732A6] hover:underline">Voltar para Kits</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero do Kit */}
        <section className="bg-gradient-to-br from-[#7732A6] to-[#5B21B6] py-16 pt-28 px-6">
          <div className="max-w-6xl mx-auto">
            <Link 
              href="/kits" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-all"
            >
              <ArrowLeft size={18} /> Voltar para Kits
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Cover Image */}
              <div className="w-full md:w-64 h-64 rounded-3xl overflow-hidden bg-white/10 flex-shrink-0 shadow-2xl">
                {kit.coverImage ? (
                  <img 
                    src={urlFor(kit.coverImage).width(400).url()} 
                    alt={kit.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <Music2 size={64} />
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                  kit.difficulty === 'facil' ? 'bg-green-500/20 text-green-200' :
                  kit.difficulty === 'medio' ? 'bg-yellow-500/20 text-yellow-200' :
                  'bg-red-500/20 text-red-200'
                }`}>
                  {kit.difficulty === 'facil' ? 'Fácil' : kit.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                </span>
                <h1 
                  className="text-3xl md:text-5xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Comfortaa, sans-serif' }}
                >
                  {kit.title}
                </h1>
                <p className="text-xl text-white/60 uppercase tracking-wide">
                  {kit.artist}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conteúdo principal */}
        <section className="py-10 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* COLUNA ESQUERDA */}
            <div className="lg:col-span-2 space-y-8">
              {/* PLAYER */}
              {kit.voices && <VideoPlayer voices={kit.voices} />}

              {/* LETRA E DICAS */}
              <div className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl p-8 border border-[var(--card-border)] shadow-sm">
                <h3 
                  className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2"
                  style={{ fontFamily: 'Comfortaa, sans-serif' }}
                >
                  <ShieldCheck className="text-[#7732A6]" />
                  Dicas e Letra
                </h3>
                {kit.lyricsAndTips ? (
                  <div className="prose prose-gray prose-p:text-gray-600 max-w-none">
                    <PortableText value={kit.lyricsAndTips} />
                  </div>
                ) : (
                  <p className="text-[var(--foreground-muted)] italic">Nenhuma dica cadastrada para este kit ainda.</p>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <aside className="space-y-6">
            {/* Downloads Protegidos */}
            {(kit.driveLink || kit.sheetMusicUrl) && (
              <div className="bg-gradient-to-b from-[#7732A6] to-[#5B21B6] text-white p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  📂 Materiais do Kit
                </h3>
                <p className="text-white/80 text-sm mb-6">
                  Faça login para acessar os materiais completos deste kit.
                </p>
                
                <div className="space-y-3">
                  {kit.driveLink && (
                    <ProtectedDownloadButton
                      type="drive"
                      url={kit.driveLink}
                      itemName={`${kit.title} - ${kit.artist}`}
                      className="w-full"
                    />
                  )}
                  
                  {kit.sheetMusicUrl && (
                    <ProtectedDownloadButton
                      type="sheet"
                      url={kit.sheetMusicUrl}
                      itemName={`Partitura: ${kit.title}`}
                      className="w-full"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Box de Apoio Fixo */}
            <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--card-border)]">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                💜 Apoie o Projeto
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] mb-4">
                Todos os kits são gratuitos! Ajude-nos a continuar produzindo conteúdo.
              </p>
              <Link
                href="/apoie"
                className="block w-full text-center py-2 px-4 bg-[var(--card-border)] hover:bg-[#7732A6] hover:text-white text-[var(--foreground)] rounded-xl font-semibold transition"
              >
                Saiba como ajudar →
              </Link>
            </div>
          </aside>
        </div>
      </section>
      </div>
    </PageLayout>
  );
}