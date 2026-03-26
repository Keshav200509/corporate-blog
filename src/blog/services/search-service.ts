import { listPublishedPosts } from "./post-service";

export async function searchPublishedPosts(query: string) {
  const cleaned = query.trim();

  if (!cleaned || cleaned.length < 2) {
    return [];
  }

  return listPublishedPosts({ query: cleaned });
}
