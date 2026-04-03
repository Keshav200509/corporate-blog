import { NextResponse } from "next/server";
import { prisma } from "../../../../../../src/lib/db/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true, status: true, publishedAt: true }
  });

  if (!post || post.status !== "PUBLISHED" || !post.publishedAt) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  await prisma.postView.create({
    data: {
      postId: post.id
    }
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}
