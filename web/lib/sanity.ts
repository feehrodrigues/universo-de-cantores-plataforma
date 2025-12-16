import { createClient } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url' // <--- MUDOU AQUI

export const client = createClient({
  projectId: '8yxu9vfv', // <--- COLE SEU ID AQUI
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Deixe false para ver as atualizações na hora enquanto desenvolve
})

// Configuração para extrair a URL das imagens do Sanity
const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}