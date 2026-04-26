import { NextResponse } from "next/server";
import { requireRole } from "../../../../src/auth/access-control";
import { createAuditLog, createDraftPost } from "../../../../src/auth/repositories";
import { createDraftSchema } from "../../../../src/auth/validation";

export async function POST(request: Request) {
  try {
    const auth = requireRole(request, "WRITER");
    if (auth instanceof NextResponse) {
      return auth;
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
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
