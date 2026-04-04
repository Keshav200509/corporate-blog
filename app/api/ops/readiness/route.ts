import { NextResponse } from "next/server";
import { getReadinessSnapshot } from "../../../../src/ops/readiness";
import { logError } from "../../../../src/observability/log";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? "unknown";

  try {
    const snapshot = await getReadinessSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    logError("ops.readiness.error", {
      requestId,
      message: error instanceof Error ? error.message : "Unknown"
    });

    return NextResponse.json(
      {
        status: "error",
        message: "Unable to generate readiness snapshot"
      },
      { status: 500 }
    );
  }
}
