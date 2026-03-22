import type { MetadataRoute } from "next";
import { getPublishedPosts } from "../src/blog/data";
import { getCanonicalUrl } from "../src/blog/seo";

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
    url: getCanonicalUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...posts];
}
