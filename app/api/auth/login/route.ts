import { NextResponse } from "next/server";
import { createAccessToken, createRefreshToken } from "../../../../src/auth/jwt";
import { verifyPassword } from "../../../../src/auth/password";
import { createAuditLog, createRefreshSession, findUserByEmail } from "../../../../src/auth/repositories";
import { loginSchema } from "../../../../src/auth/validation";
import { logError, logInfo } from "../../../../src/observability/log";

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? "unknown";

  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid request", issues: parsed.error.issues }, { status: 400 });
    }

    const user = await findUserByEmail(parsed.data.email);
    if (!user || !user.isActive || !verifyPassword(parsed.data.password, user.passwordHash)) {
      logInfo("auth.login.failed", { requestId, email: parsed.data.email });
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const accessToken = createAccessToken(user.id, user.role);
    const refreshToken = createRefreshToken(user.id, user.role);

    await createRefreshSession({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent")
    });

    await createAuditLog({
      action: "LOGIN",
      actorId: user.id,
      metadata: { event: "login-success", requestId }
    });

    logInfo("auth.login.success", { requestId, userId: user.id });
    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    logError("auth.login.error", {
      requestId,
      message: error instanceof Error ? error.message : "Unknown"
    });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
