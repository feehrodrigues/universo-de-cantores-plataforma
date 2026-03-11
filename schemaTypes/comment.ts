import { defineField, defineType } from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: '💬 Comentários',
  type: 'document',
  icon: () => '💬',
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'blogPost' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Nome',
          type: 'string',
          validation: (rule) => rule.required(),
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (rule) => rule.required().email(),
        },
        {
          name: 'userId',
          title: 'ID do Usuário (se logado)',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Comentário',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().min(3).max(1000),
    }),
    defineField({
      name: 'approved',
      title: 'Aprovado?',
      type: 'boolean',
      initialValue: false,
      description: 'Comentários só aparecem no site após aprovação',
    }),
    defineField({
      name: 'createdAt',
      title: 'Data de Criação',
      type: 'datetime',
    }),
    defineField({
      name: 'parentComment',
      title: 'Resposta a',
      type: 'reference',
      to: [{ type: 'comment' }],
      description: 'Se for uma resposta a outro comentário',
    }),
  ],
  preview: {
    select: {
      authorName: 'author.name',
      content: 'content',
      approved: 'approved',
      postTitle: 'post.title',
    },
    prepare({ authorName, content, approved, postTitle }) {
      return {
        title: `${approved ? '✅' : '⏳'} ${authorName || 'Anônimo'}`,
        subtitle: content?.substring(0, 50) + '...' || 'Sem conteúdo',
      }
    },
  },
  orderings: [
    { title: 'Mais Recentes', name: 'dateDesc', by: [{ field: 'createdAt', direction: 'desc' }] },
    { title: 'Pendentes primeiro', name: 'pendingFirst', by: [{ field: 'approved', direction: 'asc' }] },
  ],
})
