import type { MetadataRoute } from "next";
import { getPublishedPosts } from "../src/blog/data";
import { getCanonicalUrl } from "../src/blog/seo";
import { listAuthors } from "../src/blog/services/author-service";
import { listCategories } from "../src/blog/services/category-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl("/"),
      changeFrequency: "daily",
      priority: 0.8
    },
    {
      url: getCanonicalUrl("/blog"),
      changeFrequency: "hourly",
      priority: 1
    }
  ];


  const publishedPosts = await getPublishedPosts();

  const posts = publishedPosts.map((post) => ({

  if (!process.env.DATABASE_URL) {
    return staticRoutes;
  }

  const [publishedPosts, categories, authors] = await Promise.all([getPublishedPosts(), listCategories(), listAuthors()]);

  const postRoutes = publishedPosts.map((post) => ({
    url: getCanonicalUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));


  return [...staticRoutes, ...posts];
  const categoryRoutes = categories.map((category) => ({
    url: getCanonicalUrl(`/category/${category.slug}`),
    changeFrequency: "daily" as const,
    priority: 0.6
  }));

  const authorRoutes = authors.map((author) => ({
    url: getCanonicalUrl(`/author/${author.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...authorRoutes];
}
