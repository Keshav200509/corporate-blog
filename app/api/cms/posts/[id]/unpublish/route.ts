import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../../../src/auth/access-control";
import { createAuditLog, unpublishPost } from "../../../../../../src/auth/repositories";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireRole(request, "EDITOR");
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await params;
  const post = await unpublishPost(id);
  if (!post) {
    return NextResponse.json({ message: "Unpublish validation failed" }, { status: 400 });
  }

  await createAuditLog({
    action: "UNPUBLISH_POST",
    actorId: auth.userId,
    postId: post.id,
    metadata: { requestId: request.headers.get("x-request-id") ?? "unknown" }
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json({ id: post.id, slug: post.slug, status: post.status, publishedAt: post.publishedAt });
}
