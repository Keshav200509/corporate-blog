import { NextResponse } from "next/server";
import { getPublishedPosts } from "../../../../src/blog/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const author = searchParams.get("author");

  const posts = getPublishedPosts().filter((post) => {
    if (category && post.category.slug !== category) {
      return false;
    }

    if (author && post.author.slug !== author) {
      return false;
    }

    return true;
  });

  return NextResponse.json({
    items: posts,
    total: posts.length
  });
}
