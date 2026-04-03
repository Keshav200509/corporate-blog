import { NextResponse } from "next/server";
import { getPublishedPosts } from "../../../../src/blog/data";
import { listAuthors } from "../../../../src/blog/services/author-service";
import { listCategories } from "../../../../src/blog/services/category-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [posts, authors, categories] = await Promise.all([getPublishedPosts(), listAuthors(), listCategories()]);

    const featured = posts.slice(0, 3);
    const latest = posts.slice(0, 8);

    return NextResponse.json({
      stats: {
        posts: posts.length,
        authors: authors.length,
        categories: categories.length
      },
      featured,
      latest,
      categories: categories.slice(0, 6)
    });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
