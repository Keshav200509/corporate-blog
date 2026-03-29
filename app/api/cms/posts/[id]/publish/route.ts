import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../../../src/auth/access-control";
import { createAuditLog, publishPost } from "../../../../../../src/auth/repositories";
import { logError, logInfo } from "../../../../../../src/observability/log";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = request.headers.get("x-request-id") ?? "unknown";
  const { id } = await params;

  try {
    const auth = requireRole(request, "EDITOR");
    if (auth instanceof NextResponse) {
      return auth;
    }

    const post = await publishPost(id);
    if (!post) {
      return NextResponse.json({ message: "Publish validation failed" }, { status: 400 });
    }

    await createAuditLog({
      action: "PUBLISH_POST",
      actorId: auth.userId,
      postId: post.id,
      metadata: { publishedAt: post.publishedAt?.toISOString(), requestId }
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    logInfo("cms.post.published", { requestId, actorId: auth.userId, postId: post.id, slug: post.slug });

    return NextResponse.json({ id: post.id, slug: post.slug, status: post.status, publishedAt: post.publishedAt });
  } catch (error) {
    logError("cms.post.publish.error", {
      requestId,
      postId: id,
      message: error instanceof Error ? error.message : "Unknown"
    });

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
