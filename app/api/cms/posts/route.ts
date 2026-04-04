import { NextResponse } from "next/server";
import { requireRole } from "../../../../src/auth/access-control";
import { createAuditLog, createDraftPost, listPostsForCms } from "../../../../src/auth/repositories";
import { createDraftSchema } from "../../../../src/auth/validation";
import { checkRateLimit } from "../../../../src/lib/rate-limit";

type CmsPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export async function GET(request: Request) {
  const auth = requireRole(request, "WRITER");
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const normalizedStatus =
    status === "DRAFT" || status === "PUBLISHED" || status === "ARCHIVED" ? (status as CmsPostStatus) : undefined;

  const posts = await listPostsForCms({
    authorId: auth.role === "WRITER" ? auth.userId : undefined,
    status: normalizedStatus
  });

  return NextResponse.json({ items: posts, total: posts.length });
}

export async function POST(request: Request) {
  const auth = requireRole(request, "WRITER");
  if (auth instanceof NextResponse) {
    return auth;
  }

  if (!checkRateLimit(`user:${auth.userId}:cms-create`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const parsed = createDraftSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  const post = await createDraftPost({
    authorId: auth.userId,
    ...parsed.data
  });

  await createAuditLog({
    action: "CREATE_POST",
    actorId: auth.userId,
    postId: post.id,
    metadata: { status: "DRAFT" }
  });

  return NextResponse.json(post, { status: 201 });
}
