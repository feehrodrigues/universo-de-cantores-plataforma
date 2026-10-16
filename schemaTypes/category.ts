import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: '📂 Categorias Temáticas',
  type: 'document',
  icon: () => '📂',
  description: 'Categorias temáticas e sazonais para organizar kits (Natal, Páscoa, Louvor, etc.)',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome da Categoria',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Tipo de Categoria',
      type: 'string',
      options: {
        list: [
          { title: '🎄 Sazonal (Natal, Páscoa, etc.)', value: 'sazonal' },
          { title: '🎵 Gênero Musical', value: 'genero' },
          { title: '🙏 Temática (Louvor, Adoração, etc.)', value: 'tematica' },
          { title: '📊 Nível de Dificuldade', value: 'dificuldade' },
        ],
      },
      initialValue: 'tematica',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Ícone/Emoji',
      type: 'string',
      description: 'Ex: 🎄 🎵 🙏 ✝️',
    }),
    defineField({
      name: 'color',
      title: 'Cor de Destaque',
      type: 'string',
      options: {
        list: [
          { title: 'Roxo', value: '#7732A6' },
          { title: 'Rosa', value: '#F252BA' },
          { title: 'Ciano', value: '#72F2F2' },
          { title: 'Verde', value: '#5CF273' },
          { title: 'Amarelo', value: '#F2D338' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Destacar na Home?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordem de Exibição',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
    },
    prepare({ title, icon }) {
      return {
        title: `${icon || '📂'} ${title}`,
      }
    },
  },
})
