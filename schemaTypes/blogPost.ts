import { defineField, defineType } from 'sanity'

// ═══════════════════════════════════════════════════════════════════════════
// 📝 BLOG POST - Schema otimizado para facilitar a criação de conteúdo
// ═══════════════════════════════════════════════════════════════════════════

export const blogPost = defineType({
  name: 'blogPost',
  title: '📝 Post do Blog',
  type: 'document',
  icon: () => '📝',
  groups: [
    { name: 'content', title: '📝 Conteúdo', default: true },
    { name: 'media', title: '🖼️ Mídia' },
    { name: 'seo', title: '🔍 SEO' },
    { name: 'settings', title: '⚙️ Configurações' },
  ],
  fields: [
    // ═══════════════════════════════════════════════════════════════
    // 📝 CONTEÚDO PRINCIPAL
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'title',
      title: '✏️ Título do Post',
      type: 'string',
      description: 'O título principal que aparece no topo do artigo',
      validation: (rule) => rule.required().min(10).max(100),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: '🔗 URL do Post',
      type: 'slug',
      description: 'Clique em "Generate" para criar automaticamente',
      options: { 
        source: 'title',
        slugify: (input: string) => input
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      },
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: '📋 Resumo',
      description: 'Uma breve descrição que aparece na listagem e redes sociais (máx 200 caracteres)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200),
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: '🖼️ Imagem de Capa',
      type: 'image',
      description: 'A imagem principal do artigo (recomendado: 1200x630px)',
      options: { 
        hotspot: true,
        accept: 'image/*',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Descrição da imagem',
          description: 'Importante para SEO e acessibilidade',
        },
      ],
      group: 'media',
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 📄 CONTEÚDO RICO (Onde a mágica acontece!)
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'content',
      title: '📄 Conteúdo do Artigo',
      description: 'Escreva seu artigo aqui! Use os botões + para adicionar imagens, vídeos e mais.',
      type: 'array',
      group: 'content',
      of: [
        // BLOCO DE TEXTO NORMAL
        {
          type: 'block',
          title: 'Texto',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título Grande (H2)', value: 'h2' },
            { title: 'Subtítulo (H3)', value: 'h3' },
            { title: 'Subtítulo Menor (H4)', value: 'h4' },
            { title: 'Citação', value: 'blockquote' },
          ],
          lists: [
            { title: 'Lista com Bullets', value: 'bullet' },
            { title: 'Lista Numerada', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Negrito', value: 'strong' },
              { title: 'Itálico', value: 'em' },
              { title: 'Sublinhado', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) => rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel'],
                    }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Abrir em nova aba?',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        
        // IMAGEM NO MEIO DO TEXTO
        {
          type: 'image',
          title: '🖼️ Imagem',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Legenda',
              description: 'Texto que aparece abaixo da imagem',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Descrição (Alt)',
              description: 'Descreva a imagem para acessibilidade',
            },
            {
              name: 'size',
              type: 'string',
              title: 'Tamanho',
              options: {
                list: [
                  { title: 'Pequena (lado)', value: 'small' },
                  { title: 'Média', value: 'medium' },
                  { title: 'Grande (largura total)', value: 'large' },
                ],
              },
              initialValue: 'large',
            },
          ],
        },
        
        // VÍDEO DO YOUTUBE - SUPER FÁCIL!
        {
          type: 'object',
          name: 'youtube',
          title: '🎬 Vídeo do YouTube',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: '🔗 Cole o link do YouTube aqui',
              description: 'Ex: https://www.youtube.com/watch?v=ABC123 ou https://youtu.be/ABC123',
              validation: (rule) => rule.required().uri({
                scheme: ['http', 'https'],
              }),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Legenda (opcional)',
              description: 'Texto que aparece abaixo do vídeo',
            },
          ],
          preview: {
            select: { url: 'url', caption: 'caption' },
            prepare({ url, caption }) {
              return {
                title: '🎬 Vídeo do YouTube',
                subtitle: caption || url,
              }
            },
          },
        },
        
        // BLOCO DE DICA / AVISO / ALERTA
        {
          type: 'object',
          name: 'callout',
          title: '💡 Destaque (Dica/Aviso)',
          fields: [
            {
              name: 'type',
              type: 'string',
              title: 'Tipo',
              options: {
                list: [
                  { title: '💡 Dica', value: 'tip' },
                  { title: 'ℹ️ Informação', value: 'info' },
                  { title: '⚠️ Atenção', value: 'warning' },
                  { title: '✅ Sucesso', value: 'success' },
                ],
                layout: 'radio',
              },
              initialValue: 'tip',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Título (opcional)',
            },
            {
              name: 'text',
              type: 'text',
              title: 'Texto',
              rows: 3,
            },
          ],
          preview: {
            select: { type: 'type', title: 'title', text: 'text' },
            prepare({ type, title, text }) {
              const icons: Record<string, string> = { tip: '💡', info: 'ℹ️', warning: '⚠️', success: '✅' };
              const labels: Record<string, string> = { tip: 'Dica', info: 'Informação', warning: 'Atenção', success: 'Sucesso' };
              return {
                title: title || labels[type] || 'Destaque',
                subtitle: text?.slice(0, 50) + (text?.length > 50 ? '...' : ''),
              }
            },
          },
        },
        
        // BOTÃO DE AÇÃO (CTA)
        {
          type: 'object',
          name: 'cta',
          title: '🔘 Botão de Ação',
          fields: [
            {
              name: 'text',
              type: 'string',
              title: 'Texto do Botão',
              initialValue: 'Saiba mais',
            },
            {
              name: 'url',
              type: 'string',
              title: 'Link',
              description: 'URL completa ou caminho interno (/kits, /cadastro, etc)',
            },
            {
              name: 'style',
              type: 'string',
              title: 'Estilo',
              options: {
                list: [
                  { title: '🟣 Roxo (Principal)', value: 'primary' },
                  { title: '🔵 Azul (Secundário)', value: 'secondary' },
                  { title: '🩷 Rosa (Destaque)', value: 'accent' },
                ],
                layout: 'radio',
              },
              initialValue: 'primary',
            },
          ],
          preview: {
            select: { text: 'text', url: 'url' },
            prepare({ text, url }) {
              return {
                title: `🔘 ${text || 'Botão'}`,
                subtitle: url,
              }
            },
          },
        },
        
        // SEPARADOR / DIVISOR
        {
          type: 'object',
          name: 'divider',
          title: '➖ Separador',
          fields: [
            {
              name: 'style',
              type: 'string',
              title: 'Estilo',
              options: {
                list: [
                  { title: 'Linha simples', value: 'line' },
                  { title: 'Com ornamento', value: 'ornament' },
                  { title: 'Espaço em branco', value: 'space' },
                ],
              },
              initialValue: 'line',
            },
          ],
          preview: {
            prepare() {
              return { title: '➖ Separador' }
            },
          },
        },
      ],
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 🏷️ CATEGORIZAÇÃO
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'category',
      title: '📁 Categoria',
      type: 'string',
      options: {
        list: [
          { title: '🎤 Técnica Vocal', value: 'tecnica-vocal' },
          { title: '🎵 Teoria Musical', value: 'teoria-musical' },
          { title: '💡 Dicas Práticas', value: 'dicas' },
          { title: '📖 Estudos Bíblicos', value: 'estudos' },
          { title: '🎹 Repertório', value: 'repertorio' },
          { title: '📢 Novidades', value: 'novidades' },
          { title: '🎬 Bastidores', value: 'bastidores' },
          { title: '📚 Tutoriais', value: 'tutoriais' },
        ],
        layout: 'dropdown',
      },
      group: 'settings',
    }),
    defineField({
      name: 'tags',
      title: '🏷️ Tags',
      type: 'array',
      description: 'Palavras-chave para ajudar na busca (ex: soprano, harpa cristã, respiração)',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'settings',
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 📹 VÍDEO RELACIONADO DO CANAL
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'relatedVideo',
      title: '📹 Vídeo Relacionado do Canal',
      type: 'object',
      description: 'Se esse post é sobre um vídeo do seu canal, adicione aqui!',
      group: 'media',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'Link do YouTube',
        },
        {
          name: 'showAtEnd',
          type: 'boolean',
          title: 'Mostrar ao final do artigo?',
          initialValue: true,
        },
      ],
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // ⚙️ CONFIGURAÇÕES DE PUBLICAÇÃO
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'author',
      title: '✍️ Autor',
      type: 'string',
      initialValue: 'Feeh Rodrigues',
      group: 'settings',
    }),
    defineField({
      name: 'publishedAt',
      title: '📅 Data de Publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'settings',
    }),
    defineField({
      name: 'featured',
      title: '⭐ Destacar na Home?',
      type: 'boolean',
      description: 'Posts destacados aparecem no topo do blog',
      initialValue: false,
      group: 'settings',
    }),
    defineField({
      name: 'published',
      title: '✅ Publicar?',
      type: 'boolean',
      description: 'Desmarque para salvar como rascunho',
      initialValue: false,
      group: 'settings',
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 🔍 SEO (Otimização para Google)
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'seoTitle',
      title: '🔍 Título para Google',
      description: 'Se vazio, usa o título do post (máx 60 caracteres)',
      type: 'string',
      validation: (rule) => rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: '📝 Descrição para Google',
      description: 'Se vazio, usa o resumo (máx 160 caracteres)',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'seoKeywords',
      title: '🔑 Palavras-chave SEO',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'seo',
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 📊 ESTATÍSTICAS (automático)
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'viewCount',
      title: 'Visualizações',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      hidden: true,
    }),
  ],
  
  // Preview na listagem
  preview: {
    select: {
      title: 'title',
      author: 'author',
      published: 'published',
      featured: 'featured',
      category: 'category',
      media: 'coverImage',
      date: 'publishedAt',
    },
    prepare({ title, author, published, featured, media, date }) {
      const status = published ? '✅' : '📝 Rascunho';
      const formattedDate = date ? new Date(date).toLocaleDateString('pt-BR') : '';
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `${status} • ${author} • ${formattedDate}`,
        media,
      }
    },
  },
  
  // Ordenações disponíveis
  orderings: [
    { title: 'Mais Recentes', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Mais Antigos', name: 'dateAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
    { title: 'Título A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
})
