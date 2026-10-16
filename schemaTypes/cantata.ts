import { defineField, defineType } from 'sanity'

export const cantata = defineType({
  name: 'cantata',
  title: 'Cantatas / Playlists',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome da Cantata',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Link)',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'Ex: Cantata de Natal apresentada em 2025...',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Capa da Cantata',
      type: 'image',
      options: { hotspot: true },
    }),
    // AQUI É O PULO DO GATO: Referência aos Kits
    defineField({
      name: 'kits',
      title: 'Músicas desta Cantata',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'kit' }] }], // Aponta para os kits existentes
      description: 'Adicione os kits na ordem que serão cantados.'
    }),
  ],
})