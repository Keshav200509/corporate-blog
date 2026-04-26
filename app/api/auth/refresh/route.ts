import { NextResponse } from "next/server";
import { createAccessToken, createRefreshToken, verifyToken } from "../../../../src/auth/jwt";
import { createAuditLog, rotateRefreshSession } from "../../../../src/auth/repositories";
import { refreshSchema } from "../../../../src/auth/validation";

export async function POST(request: Request) {
  try {
    const parsed = refreshSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid request", issues: parsed.error.issues }, { status: 400 });
    }

    const payload = verifyToken(parsed.data.refreshToken);
    if (!payload || payload.type !== "refresh") {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    const nextRefreshToken = createRefreshToken(payload.sub, payload.role);
    const rotated = await rotateRefreshSession({
      oldToken: parsed.data.refreshToken,
      newToken: nextRefreshToken,
      userId: payload.sub,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent")
    });

    if (!rotated) {
      return NextResponse.json({ message: "Refresh token expired or revoked" }, { status: 401 });
    }

    const nextAccessToken = createAccessToken(payload.sub, payload.role);

    await createAuditLog({
      action: "LOGIN",
      actorId: payload.sub,
      metadata: { event: "refresh-rotation" }
    });

    return NextResponse.json({ accessToken: nextAccessToken, refreshToken: nextRefreshToken });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
