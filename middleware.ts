import type { NextRequest } from "next/server";

import { handleRequestGate } from "./src/edge/request-gate";

export function middleware(request: NextRequest) {
  return handleRequestGate(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
