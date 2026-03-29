import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export type AuthContext = {
  userId: string;
  role: "WRITER" | "EDITOR" | "ADMIN";
};

const ROLE_RANK: Record<AuthContext["role"], number> = {
  WRITER: 1,
  EDITOR: 2,
  ADMIN: 3
};

export function getAuthContext(request: Request): AuthContext | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length);
  const payload = verifyToken(token);

  if (!payload || payload.type !== "access") {
    return null;
  }

  return {
    userId: payload.sub,
    role: payload.role
  };
}

export function requireRole(request: Request, minimumRole: AuthContext["role"]): AuthContext | NextResponse {
  const context = getAuthContext(request);

  if (!context) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (ROLE_RANK[context.role] < ROLE_RANK[minimumRole]) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return context;
}
