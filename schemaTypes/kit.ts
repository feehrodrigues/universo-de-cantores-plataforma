import { defineField, defineType } from 'sanity'

export const kit = defineType({
  name: 'kit',
  title: '🎵 Kit de Ensaio',
  type: 'document',
  icon: () => '🎵',
  groups: [
    { name: 'info', title: '📝 Informações', default: true },
    { name: 'media', title: '🎬 Mídia' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    // ═══════════════════════════════════════════════════════════════
    // 📝 INFORMAÇÕES BÁSICAS
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'title',
      title: 'Título da Música',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'artist',
      title: 'Artista / Grupo Original',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      description: 'Clique em Generate para criar automaticamente',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'description',
      title: 'Descrição Curta',
      description: 'Aparece na busca e compartilhamento (max 160 caracteres)',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(160),
      group: 'info',
    }),
    defineField({
      name: 'songbook',
      title: 'Hinário / Origem',
      type: 'string',
      options: {
        list: [
          { title: '📖 Harpa Cristã', value: 'harpa-crista' },
          { title: '📗 Cantor Cristão', value: 'cantor-cristao' },
          { title: '📕 Hinário Adventista', value: 'hinario-adventista' },
          { title: '📘 Hinário Batista', value: 'hinario-batista' },
          { title: '🎤 Gospel Contemporâneo', value: 'gospel-contemporaneo' },
          { title: '🎵 Avulso / Outros', value: 'avulso' },
        ],
        layout: 'dropdown'
      },
      description: 'De qual hinário ou coleção este kit faz parte?',
      group: 'info',
    }),
    defineField({
      name: 'songNumber',
      title: 'Número do Hino',
      type: 'string',
      description: 'Ex: "001", "432", etc. (se aplicável)',
      group: 'info',
    }),
    defineField({
      name: 'categories',
      title: 'Categorias Adicionais',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Categorias extras (Natal, Páscoa, Louvor, etc.)',
      group: 'info',
    }),
    defineField({
      name: 'voiceArrangement',
      title: 'Arranjo Vocal',
      type: 'string',
      options: {
        list: [
          { title: '👤 Solo', value: 'solo' },
          { title: '👥 Dueto', value: 'dueto' },
          { title: '🎤 Trio', value: 'trio' },
          { title: '🎵 Quarteto (SATB)', value: 'quarteto' },
          { title: '👥 Coral Misto', value: 'coral-misto' },
          { title: '👩 Coral Feminino', value: 'coral-feminino' },
          { title: '👨 Coral Masculino', value: 'coral-masculino' },
        ],
        layout: 'dropdown'
      },
      group: 'info',
    }),
    defineField({
      name: 'tags',
      title: 'Tags (SEO)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Palavras-chave para busca. Ex: "hino 001", "soprano fácil"',
      group: 'info',
    }),
    defineField({
      name: 'difficulty',
      title: 'Nível de Dificuldade',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Iniciante', value: 'facil' },
          { title: '🟡 Intermediário', value: 'medio' },
          { title: '🔴 Avançado', value: 'dificil' },
        ],
        layout: 'radio'
      },
      group: 'info',
    }),
    defineField({
      name: 'featured',
      title: '⭐ Destacar na Home?',
      type: 'boolean',
      initialValue: false,
      group: 'info',
    }),
    defineField({
      name: 'coverImage',
      title: 'Capa do Kit (Thumbnail)',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 🎬 MÍDIA - VOZES E VÍDEOS
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'driveLink',
      title: '📂 Link do Google Drive',
      description: 'Link para pasta do Drive com todos os materiais',
      type: 'url',
      group: 'media',
    }),
    defineField({
      name: 'sheetMusicFile',
      title: '📄 Partitura (PDF)',
      description: 'Upload da partitura em PDF para download',
      type: 'file',
      options: {
        accept: '.pdf'
      },
      group: 'media',
    }),
    defineField({
      name: 'youtubeVideoId',
      title: 'ID do Vídeo Principal no YouTube',
      description: 'Ex: dQw4w9WgXcQ (apenas o ID, não a URL completa)',
      type: 'string',
      group: 'media',
    }),
    defineField({
      name: 'voices',
      title: 'Vozes Disponíveis',
      type: 'array',
      group: 'media',
      of: [{
        type: 'object',
        title: 'Voz',
        fields: [
          {
            name: 'voiceType', 
            title: 'Tipo de Voz', 
            type: 'string',
            options: {
              list: [
                { title: '🎤 Soprano', value: 'Soprano' },
                { title: '🎤 Contralto', value: 'Contralto' },
                { title: '🎤 Tenor', value: 'Tenor' },
                { title: '🎤 Baixo', value: 'Baixo' },
                { title: '🎵 Solo', value: 'Solo' },
                { title: '👥 Todos/Coral', value: 'Todos/Coral' },
                { title: '🎹 Playback', value: 'Playback' },
              ]
            }
          },
          { 
            name: 'youtubeUrl', 
            title: 'Link do YouTube', 
            type: 'url',
            description: 'URL completa do vídeo',
          },
          { 
            name: 'audioFile', 
            title: 'Arquivo de Áudio (MP3)', 
            type: 'file',
            description: 'Para download',
          },
        ],
        preview: {
          select: { voiceType: 'voiceType' },
          prepare({ voiceType }) {
            return { title: voiceType || 'Sem tipo' }
          }
        }
      }]
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 📖 CONTEÚDO RICO
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'lyricsAndTips',
      title: 'Letra, Cifras e Dicas Técnicas',
      description: 'Conteúdo rico para SEO e experiência do usuário',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'seo',
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 🔍 SEO
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      description: 'Se vazio, usa o título da música (max 60 chars)',
      type: 'string',
      validation: (rule) => rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descrição SEO',
      description: 'Se vazio, usa a descrição curta (max 160 chars)',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(160),
      group: 'seo',
    }),
    
    // ═══════════════════════════════════════════════════════════════
    // 📊 ESTATÍSTICAS (preenchido automaticamente)
    // ═══════════════════════════════════════════════════════════════
    defineField({
      name: 'viewCount',
      title: 'Visualizações',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'likeCount',
      title: 'Curtidas',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      artist: 'artist',
      difficulty: 'difficulty',
      featured: 'featured',
      songbook: 'songbook',
      songNumber: 'songNumber',
      media: 'coverImage',
    },
    prepare({ title, artist, difficulty, featured, songbook, songNumber, media }) {
      const difficultyEmoji = { facil: '🟢', medio: '🟡', dificil: '🔴' }[difficulty as string] || '';
      const songbookLabels: Record<string, string> = {
        'harpa-crista': 'HC',
        'cantor-cristao': 'CC',
        'hinario-adventista': 'HA',
        'hinario-batista': 'HB',
        'gospel-contemporaneo': 'Gospel',
        'avulso': '',
      };
      const prefix = songbook && songbookLabels[songbook] 
        ? `[${songbookLabels[songbook]}${songNumber ? ' ' + songNumber : ''}] ` 
        : '';
      return {
        title: `${featured ? '⭐ ' : ''}${prefix}${title}`,
        subtitle: `${artist || 'Artista não definido'} ${difficultyEmoji}`,
        media,
      }
    },
  },
  orderings: [
    { title: 'Título A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Número do Hino', name: 'songNumberAsc', by: [{ field: 'songNumber', direction: 'asc' }] },
    { title: 'Mais Recentes', name: 'createdDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'Mais Vistos', name: 'viewsDesc', by: [{ field: 'viewCount', direction: 'desc' }] },
  ],
})