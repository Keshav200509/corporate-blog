import { NextResponse } from "next/server";
import { getPublishedPosts } from "../../../../src/blog/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const author = searchParams.get("author");

  const posts = await getPublishedPosts({
    categorySlug: category ?? undefined,
    authorSlug: author ?? undefined
  });

  return NextResponse.json({
    items: posts,
    total: posts.length
  });
}
