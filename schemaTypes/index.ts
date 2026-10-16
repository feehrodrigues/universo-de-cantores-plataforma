import { kit } from './kit'
import { cantata } from './cantata' 
import { category } from './category'
import { blogPost } from './blogPost'
import { comment } from './comment'
import { siteConfig } from './siteConfig'

export const schemaTypes = [
  // Conteúdo Principal
  kit,
  cantata,
  category,
  blogPost,
  comment,
  // Configurações
  siteConfig,
]