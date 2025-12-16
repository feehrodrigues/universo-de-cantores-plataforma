import { defineField, defineType } from 'sanity'

export const kit = defineType({
  name: 'kit',
  title: 'Kit de Ensaio', // Nome que aparece no botão de criar
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título da Música',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artista / Grupo Original',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Parte final da URL)',
      description: 'Clique em Generate para criar o link automaticamente',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Capa do Kit (Thumbnail)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'difficulty',
      title: 'Nível de Dificuldade',
      type: 'string',
      options: {
        list: [
          { title: 'Iniciante', value: 'facil' },
          { title: 'Intermediário', value: 'medio' },
          { title: 'Avançado', value: 'dificil' },
        ],
        layout: 'radio'
      }
    }),
    // AQUI É A MÁGICA: Lista de Vozes
    defineField({
      name: 'voices',
      title: 'Vozes Disponíveis',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Voz',
        fields: [
          {
            name: 'voiceType', 
            title: 'Tipo de Voz', 
            type: 'string',
            options: {
              list: ['Soprano', 'Contralto', 'Tenor', 'Baixo', 'Solo', 'Todos/Coral', 'Playback']
            }
          },
          { name: 'youtubeUrl', title: 'Link do YouTube', type: 'url' },
          { name: 'audioFile', title: 'Arquivo de Áudio (MP3 para Download/Venda)', type: 'file' },
        ]
      }]
    }),
    // Conteúdo Rico para o Google AdSense ler
    defineField({
      name: 'lyricsAndTips',
      title: 'Letra, Cifras e Dicas Técnicas',
      description: 'Escreva bastante aqui. O Google adora texto.',
      type: 'array',
      of: [{ type: 'block' }]
    }),
  ],
})