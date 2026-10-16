import { client, urlFor } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, MessageCircle, Facebook, Twitter, Linkedin } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import { PortableText } from "@portabletext/react";
import BlogComments from "@/app/components/BlogComments";
import AdSense, { InArticleAd, SidebarAd } from "@/app/components/AdSense";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBlogPost(slug: string) {
  return client.fetch(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id, 
      title, 
      slug, 
      excerpt, 
      content,
      featuredImage,
      publishedAt,
      author,
      categories[]-> { title, slug },
      tags,
      seoTitle,
      seoDescription
    }
  `, { slug });
}

async function getRelatedPosts(currentId: string) {
  return client.fetch(`
    *[_type == "blogPost" && published == true && _id != $currentId] | order(publishedAt desc)[0...3] {
      _id, 
      title, 
      slug, 
      featuredImage,
      publishedAt
    }
  `, { currentId });
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  
  if (!post) return { title: 'Post não encontrado' };
  
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

// Helper para extrair videoId de URLs do YouTube
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const sizeClasses = {
        small: 'max-w-md mx-auto',
        medium: 'max-w-2xl mx-auto',
        large: 'max-w-4xl mx-auto',
        full: 'w-full'
      };
      return (
        <figure className={`my-8 ${sizeClasses[value.size as keyof typeof sizeClasses] || sizeClasses.large}`}>
          <img
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ''}
            className="rounded-2xl w-full"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    youtube: ({ value }: any) => {
      const videoId = extractYouTubeId(value?.url);
      if (!videoId) return null;
      return (
        <div className="my-8 aspect-video rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allowFullScreen
            title={value.caption || 'Vídeo do YouTube'}
          />
        </div>
      );
    },
    callout: ({ value }: any) => {
      const styles = {
        tip: { bg: 'bg-cyan-500/10', border: 'border-cyan-500', icon: '💡', title: 'Dica' },
        info: { bg: 'bg-blue-500/10', border: 'border-blue-500', icon: 'ℹ️', title: 'Info' },
        warning: { bg: 'bg-amber-500/10', border: 'border-amber-500', icon: '⚠️', title: 'Atenção' },
        success: { bg: 'bg-green-500/10', border: 'border-green-500', icon: '✅', title: 'Sucesso' }
      };
      const style = styles[value?.style as keyof typeof styles] || styles.info;
      return (
        <div className={`my-6 p-4 rounded-xl border-l-4 ${style.bg} ${style.border}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">{style.icon}</span>
            <div className="flex-1">
              {value.title && (
                <h4 className="font-bold text-[var(--foreground)] mb-1">{value.title}</h4>
              )}
              <p className="text-[var(--foreground-muted)]">{value.text}</p>
            </div>
          </div>
        </div>
      );
    },
    cta: ({ value }: any) => {
      const buttonStyles = {
        primary: 'bg-[#7732A6] hover:bg-[#5f2787] text-white',
        secondary: 'bg-white/10 hover:bg-white/20 text-[var(--foreground)] border border-white/20',
        accent: 'bg-gradient-to-r from-[#F252BA] to-[#7732A6] hover:opacity-90 text-white'
      };
      const style = buttonStyles[value?.buttonStyle as keyof typeof buttonStyles] || buttonStyles.primary;
      return (
        <div className="my-8 text-center">
          <a
            href={value.url}
            target={value.openInNewTab ? '_blank' : '_self'}
            rel={value.openInNewTab ? 'noopener noreferrer' : undefined}
            className={`inline-block px-8 py-3 rounded-full font-semibold transition-all ${style}`}
          >
            {value.text}
          </a>
        </div>
      );
    },
    divider: ({ value }: any) => {
      const dividers = {
        line: <hr className="my-8 border-t border-white/10" />,
        ornament: (
          <div className="my-8 flex items-center justify-center gap-2">
            <span className="text-[#7732A6]">✦</span>
            <span className="text-[#F252BA]">✦</span>
            <span className="text-cyan-500">✦</span>
          </div>
        ),
        space: <div className="my-12" />
      };
      return dividers[value?.style as keyof typeof dividers] || dividers.line;
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-[var(--foreground)] mt-6 mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-[var(--foreground)] mb-4 leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#7732A6] pl-4 my-6 italic text-[var(--foreground-muted)]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a 
        href={value?.href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#7732A6] hover:underline"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-[var(--foreground)]">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-[var(--foreground)]">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-[var(--foreground)]">
        {children}
      </ol>
    ),
  },
};

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const [post, relatedPosts] = await Promise.all([
    getBlogPost(resolvedParams.slug),
    getBlogPost(resolvedParams.slug).then(p => p ? getRelatedPosts(p._id) : [])
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero com imagem */}
        <section className="relative">
          <div className="h-[40vh] md:h-[50vh] relative">
            {post.featuredImage ? (
              <img 
                src={urlFor(post.featuredImage).width(1920).height(800).url()} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#7732A6] to-[#F252BA]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          
          {/* Conteúdo do Hero */}
          <div className="absolute bottom-0 left-0 right-0 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={16} />
                Voltar ao Blog
              </Link>
              
              {/* Categorias */}
              {post.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((cat: any) => (
                    <span key={cat.slug?.current} className="text-sm font-bold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                {post.title}
              </h1>
              
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author || 'Universo de Cantores'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conteúdo */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Artigo Principal */}
              <div className="flex-1 max-w-4xl">
                <article className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-sm border border-[var(--card-border)]">
                  {post.content ? (
                    <PortableText value={post.content} components={portableTextComponents} />
                  ) : (
                    <p className="text-[var(--foreground-muted)]">Este artigo ainda não possui conteúdo.</p>
                  )}
                  
                  {/* Anúncio no final do artigo */}
                  <InArticleAd adSlot="ADSENSE_ARTICLE_SLOT" />
                  
                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-[var(--card-border)]">
                      <p className="text-sm font-bold text-[var(--foreground-muted)] mb-3">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="text-sm text-[var(--foreground-muted)] bg-[var(--card-bg)] px-3 py-1 rounded-full border border-[var(--card-border)]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Compartilhar */}
                  <div className="mt-8 pt-8 border-t border-[var(--card-border)]">
                    <p className="text-sm font-bold text-[var(--foreground-muted)] mb-4">Gostou? Compartilhe!</p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - Universo de Cantores')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </a>
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877F2] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        <Facebook size={16} />
                        Facebook
                      </a>
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DA1F2] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        <Twitter size={16} />
                        Twitter
                      </a>
                    </div>
                  </div>
                </article>

                {/* Comentários */}
                <div className="mt-8">
                  <BlogComments postId={post._id} />
                </div>
              </div>

              {/* Sidebar com Anúncios */}
              <aside className="lg:w-80 space-y-6">
                <SidebarAd adSlot="ADSENSE_SIDEBAR_SLOT" />
                
                {/* CTA Aulas */}
                <div className="bg-gradient-to-br from-[#7732A6] to-[#F252BA] rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    Quer evoluir sua voz?
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    Agende uma aula particular e desenvolva sua técnica vocal com acompanhamento personalizado.
                  </p>
                  <Link 
                    href="/aulas"
                    className="inline-block bg-white text-[#7732A6] font-bold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-colors"
                  >
                    Agendar Aula
                  </Link>
                </div>

                {/* Newsletter */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6">
                  <h3 className="font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                    Receba novidades
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-4">
                    Dicas de canto e novos artigos no seu email.
                  </p>
                  <form className="space-y-2">
                    <input 
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full bg-[var(--background-secondary)] border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7732A6]"
                    />
                    <button className="w-full bg-[#7732A6] text-white font-bold py-2 rounded-xl text-sm hover:bg-[#5B21B6] transition-colors">
                      Inscrever
                    </button>
                  </form>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Posts Relacionados */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-[var(--card-bg)] backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Leia também
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related: any) => (
                  <Link href={`/blog/${related.slug?.current}`} key={related._id} className="group">
                    <article className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-video bg-gradient-to-br from-[#7732A6]/20 to-[#F252BA]/20">
                        {related.featuredImage && (
                          <img 
                            src={urlFor(related.featuredImage).width(400).height(225).url()} 
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[var(--foreground)] group-hover:text-[#7732A6] transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-xs text-[var(--foreground-muted)] mt-2">
                          {related.publishedAt ? new Date(related.publishedAt).toLocaleDateString('pt-BR') : ''}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
