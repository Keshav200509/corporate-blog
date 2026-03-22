import { NextResponse } from "next/server";
import { getPublishedPostBySlug } from "../../../../../src/blog/data";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const post = getPublishedPostBySlug(params.slug);

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