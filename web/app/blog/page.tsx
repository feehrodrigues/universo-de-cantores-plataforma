import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { Calendar, User, ArrowRight, BookOpen, Search } from "lucide-react";
import PageLayout from "@/app/components/PageLayout";

export const revalidate = 60;

async function getBlogPosts() {
  return client.fetch(`
    *[_type == "blogPost" && published == true] | order(publishedAt desc) {
      _id, 
      title, 
      slug, 
      excerpt, 
      featuredImage,
      publishedAt,
      author,
      categories[]-> { title, slug },
      tags
    }
  `);
}

async function getCategories() {
  return client.fetch(`
    *[_type == "category"] | order(title asc) {
      _id, title, slug
    }
  `);
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getCategories()]);

  return (
    <PageLayout >
      <div className="min-h-screen">
        {/* HERO */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#7732A6] to-[#F252BA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold mb-6">
              <BookOpen size={16} />
              <span>Aprenda com a gente</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Blog
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Dicas de técnica vocal, teoria musical, ensaios de coral e muito mais para cantores e regentes.
            </p>

            {/* Barra de busca */}
            <form action="/busca" method="get" className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#7732A6]" />
              </div>
              <input 
                type="text" 
                name="q"
                className="w-full p-5 pl-14 text-base text-gray-900 border border-gray-200 rounded-full bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-[#7732A6] focus:border-transparent shadow-lg hover:shadow-xl transition-all placeholder-gray-400"
                placeholder="Buscar artigos..."
              />
            </form>
          </div>
        </section>

        {/* CATEGORIAS */}
        {categories.length > 0 && (
          <section className="py-8 border-b border-[var(--card-border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link 
                  href="/blog"
                  className="px-4 py-2 rounded-full bg-[#7732A6] text-white text-sm font-bold"
                >
                  Todos
                </Link>
                {categories.map((cat: any) => (
                  <Link 
                    key={cat._id}
                    href={`/blog/categoria/${cat.slug?.current}`}
                    className="px-4 py-2 rounded-full bg-[var(--card-bg)] text-[var(--foreground)] text-sm font-bold hover:bg-[#7732A6] hover:text-white transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* POSTS */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  Nenhum artigo publicado ainda
                </h3>
                <p className="text-[var(--foreground-muted)] mb-6">
                  Em breve teremos conteúdos incríveis para você!
                </p>
                <Link 
                  href="/kits"
                  className="inline-flex items-center gap-2 bg-[#7732A6] text-white px-6 py-3 rounded-full font-bold hover:bg-[#5B21B6] transition-colors"
                >
                  Explorar Kits Vocais <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                  <Link href={`/blog/${post.slug?.current}`} key={post._id} className="group">
                    <article className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--card-border)] h-full flex flex-col">
                      {/* Imagem */}
                      <div className="relative aspect-video bg-gradient-to-br from-[#7732A6]/20 to-[#F252BA]/20 overflow-hidden">
                        {post.featuredImage ? (
                          <img 
                            src={urlFor(post.featuredImage).width(600).height(340).url()} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl opacity-30">📝</span>
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Categorias */}
                        {post.categories?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.categories.slice(0, 2).map((cat: any) => (
                              <span key={cat.slug?.current} className="text-xs font-bold text-[#7732A6] bg-[#7732A6]/10 px-2 py-1 rounded-full">
                                {cat.title}
                              </span>
                            ))}
                          </div>
                        )}

                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[#7732A6] transition-colors line-clamp-2" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                          {post.title}
                        </h2>
                        
                        <p className="text-[var(--foreground-muted)] text-sm mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-[var(--foreground-muted)] mt-auto pt-4 border-t border-[var(--card-border)]">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{post.author || 'Universo de Cantores'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>
                              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
