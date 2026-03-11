import Link from 'next/link';
import { ArrowRight, Search, MessageCircle, ArrowDown, Layers, Play, Youtube, BookOpen } from 'lucide-react';
import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BannerCarousel from "@/app/components/BannerCarousel";
import AdSlot, { AdSection } from "@/app/components/AdSlot";
import Footer from "@/app/components/Footer";

// --- BUSCA DE DADOS ---
async function getHomeData() {
  return client.fetch(`{
    "cantatas": *[_type == "cantata"] | order(_createdAt desc)[0...3] {
      _id, title, description, slug, coverImage, 
      "qtd": count(kits)
    },
    "recents": *[_type == "kit"] | order(_createdAt desc)[0...6] {
      _id, title, artist, slug, difficulty, coverImage
    },
    "blogPosts": *[_type == "blogPost" && published == true] | order(publishedAt desc)[0...3] {
      _id, title, slug, excerpt, featuredImage, publishedAt, author
    },
    "config": *[_type == "siteConfig"][0] {
      bannersAtivos,
      banners[] {
        ativo,
        nome,
        imagemDesktop,
        imagemMobile,
        link,
        abrirNovaAba,
        altText
      },
      carrosselAutoplay,
      carrosselIntervalo,
      youtubeSecaoAtiva,
      youtubeTitulo,
      youtubeVideos,
      youtubeCanalLink
    }
  }`, {}, { next: { revalidate: 60 } });
}

export default async function Home() {
  const data = await getHomeData();
  const session = await getServerSession(authOptions);
  const config = data.config || {};

  // Pré-processar banners com URLs (Server Component)
  // Formato Medium Rectangle: 300x250 (retina: 600x500)
  const processedBanners = config.banners
    ?.filter((b: any) => b.ativo && b.imagemDesktop)
    ?.map((b: any) => ({
      nome: b.nome,
      desktopUrl: urlFor(b.imagemDesktop).width(600).height(500).url(), // Retina 2x
      mobileUrl: b.imagemMobile 
        ? urlFor(b.imagemMobile).width(600).height(500).url()
        : urlFor(b.imagemDesktop).width(600).height(500).url(),
      link: b.link,
      abrirNovaAba: b.abrirNovaAba,
      altText: b.altText,
    })) || [];

  return (
    <main className="min-h-screen text-[var(--foreground)] flex flex-col relative overflow-hidden">
      
      {/* HERO - usa o fundo global do GlobalBackground */}
      <div className="min-h-[90vh] flex flex-col justify-between relative">
        
        {/* HEADER MINIMALISTA */}
        <header className="w-full max-w-7xl mx-auto p-6 md:p-10 flex justify-between items-center z-10">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full shadow-lg">
              <Image 
                src="/icon.png" 
                alt="Universo de Cantores" 
                fill 
                className="object-cover"
              />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link 
                href={session.user?.role === "admin" || session.user?.role === "teacher" ? "/teacher" : "/dashboard"} 
                className="btn-primary text-sm"
              >
                Meu Painel
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="btn-primary text-sm"
              >
                Entrar
              </Link>
            )}
          </div>
        </header>

        {/* HERO CENTRAL */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          {/* Logo centralizada */}
          <div className="mb-8 text-center relative flex flex-col items-center w-full animate-float">
            <div className="relative w-full max-w-[400px] md:max-w-[500px]">
              <Image 
                src="/logo.png" 
                alt="Universo de Cantores" 
                width={500} 
                height={200} 
                priority 
                className="w-full h-auto drop-shadow-2xl"
                style={{ borderRadius: '24px' }}
              />
            </div>
            <p className="text-gray-600 text-lg md:text-xl max-w-lg mx-auto mt-6 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              A música é a linguagem universal
            </p>
          </div>

          {/* Barra de busca elegante - GLOBAL para todo o site */}
          <form className="w-full max-w-2xl relative group" action="/busca" method="get">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#7732A6]" />
            </div>
            <input 
              type="text" 
              name="q"
              className="block w-full p-5 pl-14 text-sm md:text-base text-gray-900 border border-gray-200 rounded-full bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-[#7732A6] focus:border-transparent focus:bg-white transition-all shadow-lg hover:shadow-xl placeholder-gray-400 tracking-wide"
              placeholder="Buscar kits, cantatas, artigos do blog..."
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            />
          </form>

          {/* Links rápidos - minimalista */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
            <Link 
              href="/kits"
              className="text-gray-500 hover:text-[#7732A6] font-medium transition-colors"
            >
              Kits Vocais
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/aulas"
              className="text-gray-500 hover:text-[#7732A6] font-medium transition-colors"
            >
              Aulas de Canto
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/blog"
              className="text-gray-500 hover:text-[#7732A6] font-medium transition-colors"
            >
              Blog
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/cantatas"
              className="text-gray-500 hover:text-[#7732A6] font-medium transition-colors"
            >
              Cantatas
            </Link>
          </div>

          {/* Indicador de scroll */}
          <div className="mt-16 flex flex-col items-center gap-2 animate-bounce text-gray-400 text-xs uppercase tracking-widest">
            <span className="bg-white/50 text-gray-600 px-3 py-1 rounded-full backdrop-blur-sm">Role para explorar</span>
            <ArrowDown size={16} />
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          O QUE É O UNIVERSO DE CANTORES
          Seção institucional mostrando os pilares da plataforma
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 px-6 bg-white/50 backdrop-blur-sm border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#7732A6]/10 text-[#7732A6] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Sobre nós
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              O Universo de Cantores
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Uma plataforma criada por cantores, para cantores. Conteúdo gratuito de qualidade e acompanhamento personalizado para sua jornada vocal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pilar 1: Kits Vocais */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#72F2F2]/20 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                🎵
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Kits Vocais Gratuitos
              </h3>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Kits de ensaio com divisão de vozes (Soprano, Contralto, Tenor, Baixo) para corais, ministérios e grupos vocais. Harpa Cristã, Cantor Cristão e muito mais.
              </p>
              <Link 
                href="/kits"
                className="inline-flex items-center gap-2 text-[#7732A6] font-bold hover:gap-3 transition-all"
              >
                Explorar kits <ArrowRight size={16} />
              </Link>
            </div>

            {/* Pilar 2: Aulas de Canto */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#F252BA]/20 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                🎤
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Aulas Particulares
              </h3>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Aulas individuais online com metodologia E.M.E (Estrutura, Modelagem, Expressão). Briefing personalizado, relatórios detalhados e dashboard de evolução.
              </p>
              <Link 
                href="/aulas"
                className="inline-flex items-center gap-2 text-[#7732A6] font-bold hover:gap-3 transition-all"
              >
                Conhecer aulas <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ÁREA DE PUBLICIDADE PRINCIPAL
          Layout otimizado: 3 blocos lado a lado (desktop)
          - Seu banner personalizado (300x250)
          - 2x Google Ads (300x250 cada)
          Formato Medium Rectangle = maior CPM do mercado!
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-gradient-to-b from-gray-100 to-gray-50 py-6 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          {/* Label de publicidade */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex-1 max-w-[100px] h-px bg-gray-300"></div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-semibold select-none">
              Publicidade
            </span>
            <div className="flex-1 max-w-[100px] h-px bg-gray-300"></div>
          </div>
          
          {/* Grid de Anúncios - 3 colunas no desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
            
            {/* Slot 1: Seu Banner (300x250) */}
            {config.bannersAtivos && processedBanners.length > 0 ? (
              <div className="w-[300px] h-[250px] overflow-hidden rounded-xl shadow-md bg-white border border-gray-100">
                <BannerCarousel 
                  banners={processedBanners}
                  autoplay={config.carrosselAutoplay ?? true}
                  intervalo={config.carrosselIntervalo ?? 5}
                />
              </div>
            ) : (
              <AdSlot format="rectangle" slotId="home-1" />
            )}
            
            {/* Slot 2: Google Ads (300x250) */}
            <AdSlot format="rectangle" slotId="home-2" />
            
            {/* Slot 3: Google Ads (300x250) - esconde em telas médias */}
            <div className="hidden lg:block">
              <AdSlot format="rectangle" slotId="home-3" />
            </div>
          </div>
          
          {/* Link para anunciantes */}
          <p className="text-center text-[10px] text-gray-400 mt-4">
            <a 
              href="https://wa.me/5511977247792?text=Olá! Tenho interesse em anunciar no Universo de Cantores." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#7732A6] transition-colors inline-flex items-center gap-1"
            >
              <span>Quer anunciar aqui?</span>
              <span className="underline">Fale conosco</span>
            </a>
          </p>
        </div>
      </div>

      {/* SEÇÃO AULAS DE CANTO - sempre aparece */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-6 relative z-20">
        <Link 
          href="/aulas" 
          className="block rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group"
          style={{ background: 'linear-gradient(135deg, #7732A6 0%, #5B21B6 50%, #F252BA 100%)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 md:p-12">
            <div className="flex-1">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4">
                Aulas de Canto
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Desenvolva sua voz com acompanhamento real
              </h2>
              <p className="text-white/90 text-lg mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Aulas individuais online, com briefing personalizado, relatórios detalhados e acompanhamento da sua evolução vocal.
              </p>
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#7732A6] font-bold rounded-full shadow-lg group-hover:bg-[#F2D338] transition-all">
                Conhecer as aulas <ArrowRight size={18} />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* VÍDEOS DO YOUTUBE - Sempre visível */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl text-red-600">
              <Youtube size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              {config.youtubeTitulo || 'Vídeos do Canal'}
            </h2>
          </div>
          <a 
            href="https://youtube.com/@universodecantores" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700 transition"
          >
            Ver no YouTube <ArrowRight size={16} />
          </a>
        </div>

        {/* CTA para se inscrever no canal */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-10 text-white text-center mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Play size={28} fill="white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Universo de Cantores
                </h3>
                <p className="text-white/80 text-sm">Técnica vocal, kits de ensaio e muito mais</p>
              </div>
            </div>
            <a 
              href="https://youtube.com/@universodecantores?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <Youtube size={20} /> Inscrever-se
            </a>
          </div>
        </div>

        {/* Grid de vídeos - do Sanity ou fallback */}
        {config.youtubeVideos && config.youtubeVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.youtubeVideos.slice(0, 6).map((video: any, index: number) => (
              <a 
                key={index}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative aspect-video bg-gray-200">
                    <Image 
                      src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                      alt={video.titulo || 'Vídeo do YouTube'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play fill="white" className="text-white ml-1" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-[#7732A6] transition-colors">
                      {video.titulo || 'Assistir vídeo'}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Confira nossos vídeos no canal do YouTube</p>
            <a 
              href="https://youtube.com/@universodecantores"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all"
            >
              <Youtube size={20} /> Acessar Canal
            </a>
          </div>
        )}
      </section>

      {/* CANTATAS E ESPECIAIS */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#7732A6]/10 rounded-xl text-[#7732A6]">
              <Layers size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Cantatas e Especiais
            </h2>
          </div>
          <Link href="/cantatas" className="flex items-center gap-1 text-sm font-bold text-[#7732A6] hover:text-[#F252BA] transition">
            Ver todas <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.cantatas?.map((cantata: any) => (
            <Link key={cantata._id} href={`/cantatas/${cantata.slug?.current}`} className="group">
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7732A6] to-[#3B82F6] group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 leading-tight" style={{ fontFamily: 'Comfortaa, sans-serif' }}>{cantata.title}</h3>
                  <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                    {cantata.qtd} Músicas
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* KITS RECENTES */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-[#F252BA] rounded-full"></div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Acabaram de Chegar
            </h2>
          </div>
          <Link href="/kits" className="flex items-center gap-1 text-sm font-bold text-[#7732A6] hover:text-[#F252BA] transition">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.recents?.map((kit: any) => (
            <Link key={kit._id} href={`/musica/${kit.slug?.current}`} className="group h-full">
              <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-[#7732A6]/10 to-[#F252BA]/10">
                  {kit.coverImage ? (
                    <Image 
                      src={urlFor(kit.coverImage).width(400).height(225).url()} 
                      alt={kit.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#7732A6]/30">
                      <span className="text-4xl">🎤</span>
                    </div>
                  )}
                  {kit.difficulty && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                      {kit.difficulty}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#7732A6] transition-colors" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    {kit.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {kit.artist}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BLOG - Artigos Recentes - Sempre visível */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F252BA]/10 rounded-xl text-[#F252BA]">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Blog
            </h2>
          </div>
          <Link href="/blog" className="flex items-center gap-1 text-sm font-bold text-[#7732A6] hover:text-[#F252BA] transition">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {data.blogPosts && data.blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.blogPosts.map((post: any) => (
              <Link key={post._id} href={`/blog/${post.slug?.current}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-[#7732A6]/10 to-[#F252BA]/10">
                    {post.coverImage ? (
                      <Image 
                        src={urlFor(post.coverImage).width(400).height(225).url()} 
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F252BA]/30">
                        <BookOpen size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#7732A6] transition-colors line-clamp-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto text-xs text-gray-400">
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#7732A6]/5 to-[#F252BA]/5 rounded-2xl p-10 text-center border border-[#7732A6]/10">
            <BookOpen size={48} className="mx-auto text-[#7732A6]/30 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Artigos em breve
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Estamos preparando conteúdos incríveis sobre técnica vocal, dicas para cantores e muito mais.
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#7732A6] text-white rounded-full font-bold hover:bg-[#5B21B6] transition-all"
            >
              <BookOpen size={18} /> Acessar Blog
            </Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ÁREA DE PUBLICIDADE SECUNDÁRIA (entre conteúdo)
          - Formato Leaderboard responsivo
          - Aumenta impressões e receita
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-[#f5f5f5] py-4 my-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium select-none">
              Publicidade
            </span>
          </div>
          <div className="flex justify-center">
            <AdSlot format="leaderboard" slotId="home-content" />
          </div>
        </div>
      </div>

      {/* WHATSAPP CTA */}
      <section className="w-full py-20 px-6" style={{ background: 'linear-gradient(135deg, #7732A6 0%, #5B21B6 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
            Não encontrou o kit que procura?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Eu produzo novos Kits de Ensaio toda semana e aceito pedidos gratuitamente.
          </p>
          <a 
            href="https://wa.me/5511977247792?text=Olá Felipe! Gostaria de sugerir um kit vocal..." 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <MessageCircle size={24} />
            Pedir no WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER COMPLETO */}
      <Footer />
    </main>
  );
}