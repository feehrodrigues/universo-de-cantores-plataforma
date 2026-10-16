import { client } from "@/lib/sanity";
import { MetadataRoute } from "next";

const baseUrl = "https://universodecantores.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/kits`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cantatas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aulas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sobre-mim`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cadastro`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Buscar Kits do Sanity
  const kits = await client.fetch(`
    *[_type == "kit" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  const kitPages: MetadataRoute.Sitemap = kits.map((kit: any) => ({
    url: `${baseUrl}/musica/${kit.slug}`,
    lastModified: new Date(kit._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Buscar Cantatas do Sanity
  const cantatas = await client.fetch(`
    *[_type == "cantata" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  const cantataPages: MetadataRoute.Sitemap = cantatas.map((cantata: any) => ({
    url: `${baseUrl}/cantatas/${cantata.slug}`,
    lastModified: new Date(cantata._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Buscar Posts do Blog
  const posts = await client.fetch(`
    *[_type == "blogPost" && published == true && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  const blogPages: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...kitPages, ...cantataPages, ...blogPages];
}
