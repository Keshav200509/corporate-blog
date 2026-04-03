import { NextResponse } from "next/server";
import { requireRole } from "../../../../../src/auth/access-control";
import { createAuditLog, getPostForCms, updateDraftPost } from "../../../../../src/auth/repositories";
import { updateDraftSchema } from "../../../../../src/auth/validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = requireRole(request, "WRITER");
  if (auth instanceof NextResponse) {
    return auth;
  }

  const post = await getPostForCms(id, auth.userId, auth.role);
  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = requireRole(request, "WRITER");
  if (auth instanceof NextResponse) {
    return auth;
  }

  const parsed = updateDraftSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  const post = await updateDraftPost(id, auth.userId, parsed.data);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  await createAuditLog({
    action: "UPDATE_POST",
    actorId: auth.userId,
    postId: post.id,
    metadata: { status: post.status }
  });

  return NextResponse.json(post);
}
