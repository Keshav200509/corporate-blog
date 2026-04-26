import { NextResponse } from "next/server";
import { getPublishedPostBySlug } from "../../../../../src/blog/data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
