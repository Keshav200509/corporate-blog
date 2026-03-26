import { NextResponse } from "next/server";
import { getAuthorWithPosts } from "../../../../../src/blog/services/author-service";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthorWithPosts(slug);

  if (!author) {
    return NextResponse.json({ message: "Author not found" }, { status: 404 });
  }

  return NextResponse.json(author);
}
