import { defineField, defineType } from 'sanity'

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Configurações do Site',
  type: 'document',
  groups: [
    { name: 'banners', title: '🖼️ Banners Promocionais', default: true },
    { name: 'youtube', title: '📺 Vídeos do YouTube' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Identificador',
      type: 'string',
      initialValue: 'Configurações Principais',
      hidden: true,
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 🖼️ BANNERS PROMOCIONAIS (CARROSSEL)
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'bannersAtivos',
      title: 'Ativar Banners na Homepage?',
      description: 'Liga/desliga todos os banners de uma vez',
      type: 'boolean',
      initialValue: true,
      group: 'banners',
    }),
    defineField({
      name: 'banners',
      title: 'Lista de Banners',
      description: 'Adicione quantos banners quiser. Se tiver mais de um ativo, vira carrossel automático!',
      type: 'array',
      group: 'banners',
      of: [{
        type: 'object',
        title: 'Banner',
        fields: [
          {
            name: 'ativo',
            title: '✅ Este banner está ativo?',
            description: 'Desmarque para esconder temporariamente sem deletar',
            type: 'boolean',
            initialValue: true,
          },
          {
            name: 'nome',
            title: '📝 Nome do Banner (interno)',
            description: 'Só você vê. Ex: "Promoção Páscoa 2026"',
            type: 'string',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'imagemDesktop',
            title: '🖥️ Imagem do Banner',
            description: 'Formato Medium Rectangle: 300x250 pixels (ou 600x500 para retina). Tamanho padrão do mercado.',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'imagemMobile',
            title: '📱 Imagem Mobile (opcional)',
            description: 'Mesmo formato: 300x250 pixels. Se não tiver, usa a mesma do desktop.',
            type: 'image',
            options: { hotspot: true },
          },
          {
            name: 'link',
            title: '🔗 Link de destino',
            description: 'Interno (/aulas) ou externo (https://youtube.com/...)',
            type: 'string',
            initialValue: '/aulas',
          },
          {
            name: 'abrirNovaAba',
            title: '↗️ Abrir em nova aba?',
            description: 'Marque para links externos (ex: YouTube, Hotmart)',
            type: 'boolean',
            initialValue: false,
          },
          {
            name: 'altText',
            title: '♿ Texto alternativo (acessibilidade)',
            description: 'Descreva a imagem para leitores de tela',
            type: 'string',
            initialValue: 'Banner promocional',
          },
        ],
        preview: {
          select: {
            title: 'nome',
            ativo: 'ativo',
            media: 'imagemDesktop',
          },
          prepare({ title, ativo, media }) {
            return {
              title: title || 'Banner sem nome',
              subtitle: ativo ? '✅ Ativo' : '❌ Inativo',
              media,
            }
          },
        },
      }],
    }),
    defineField({
      name: 'carrosselAutoplay',
      title: 'Carrossel automático?',
      description: 'Se ativado, muda de banner sozinho a cada alguns segundos',
      type: 'boolean',
      initialValue: true,
      group: 'banners',
    }),
    defineField({
      name: 'carrosselIntervalo',
      title: 'Intervalo entre banners (segundos)',
      description: 'De quantos em quantos segundos muda o banner? (padrão: 5)',
      type: 'number',
      initialValue: 5,
      group: 'banners',
      validation: (Rule) => Rule.min(2).max(30),
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 📺 VÍDEOS DO YOUTUBE
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'youtubeSecaoAtiva',
      title: 'Ativar Seção de Vídeos?',
      type: 'boolean',
      initialValue: true,
      group: 'youtube',
    }),
    defineField({
      name: 'youtubeTitulo',
      title: 'Título da Seção',
      type: 'string',
      initialValue: 'Vídeos Recentes',
      group: 'youtube',
    }),
    defineField({
      name: 'youtubeVideos',
      title: 'Lista de Vídeos',
      description: 'Adicione os vídeos que quer mostrar na homepage',
      type: 'array',
      group: 'youtube',
      of: [{
        type: 'object',
        title: 'Vídeo',
        fields: [
          {
            name: 'titulo',
            title: 'Título do Vídeo',
            type: 'string',
          },
          {
            name: 'videoId',
            title: 'ID do Vídeo',
            description: 'A parte depois de "v=" na URL. Ex: dQw4w9WgXcQ',
            type: 'string',
            validation: (Rule) => Rule.required(),
          },
        ],
        preview: {
          select: {
            title: 'titulo',
            videoId: 'videoId',
          },
          prepare({ title, videoId }) {
            return {
              title: title || videoId,
              subtitle: `youtube.com/watch?v=${videoId}`,
            }
          },
        },
      }],
    }),
    defineField({
      name: 'youtubeCanalLink',
      title: 'Link do Canal',
      description: 'Botão "Ver no YouTube" vai pra cá',
      type: 'url',
      group: 'youtube',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '⚙️ Configurações do Site',
        subtitle: 'Banners, vídeos e mais',
      }
    },
  },
})
