import { NextResponse } from "next/server";
import { verifyToken } from "../../../../src/auth/jwt";
import { createAuditLog, revokeRefreshSession } from "../../../../src/auth/repositories";
import { refreshSchema } from "../../../../src/auth/validation";

export async function POST(request: Request) {
  const parsed = refreshSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  const payload = verifyToken(parsed.data.refreshToken);
  if (!payload || payload.type !== "refresh") {
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
  }

  await revokeRefreshSession(parsed.data.refreshToken);
  await createAuditLog({
    action: "LOGOUT",
    actorId: payload.sub,
    metadata: { event: "logout" }
  });

  return NextResponse.json({ ok: true });
}
