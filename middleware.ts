import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function buildContentSecurityPolicy() {
  const scriptSrc = ["'self'", "'unsafe-inline'"];

  if (process.env.NODE_ENV !== "production") {
    scriptSrc.push("'unsafe-eval'");
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://app.netlify.com",
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'"
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy());

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);

  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
