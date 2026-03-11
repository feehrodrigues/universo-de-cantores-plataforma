import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/teacher/',
          '/dashboard/',
          '/sala/',
          '/briefing/',
          '/student/',
          '/relatorios/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://universodecantores.com.br/sitemap.xml',
  }
}
