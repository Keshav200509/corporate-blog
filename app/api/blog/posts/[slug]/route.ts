import { NextResponse } from "next/server";
import { getPublishedPostBySlug } from "../../../../../src/blog/data";

<<<<<<< HEAD
type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const post = await getPublishedPostBySlug(params.slug);
=======
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
>>>>>>> origin/codex/implement-phase-1-for-corporate-blog-cramvb

  if (!post) {
    return NextResponse.json(
      {
        message: "Post not found"
      },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}
