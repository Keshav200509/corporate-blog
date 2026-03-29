// import { NextResponse } from "next/server";
// import { getPublishedPosts } from "../../../../src/blog/data";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const category = searchParams.get("category");
//   const author = searchParams.get("author");

//   const posts = await getPublishedPosts({
//     categorySlug: category ?? undefined,
//     authorSlug: author ?? undefined
//   });

//   return NextResponse.json({
//     items: posts,
//     total: posts.length
//   });
// }

import { NextResponse } from "next/server";
import { getPublishedPosts } from "../../../../src/blog/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
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
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
