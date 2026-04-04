import { NextResponse } from "next/server";
import { searchPublishedPosts } from "../../../../src/blog/services/search-service";
import { logError, logInfo } from "../../../../src/observability/log";
import { checkRateLimit, getRateLimitKey } from "../../../../src/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? "unknown";

  try {
    const key = getRateLimitKey(request, "blog-search");
    if (!checkRateLimit(key, 30, 60 * 1000)) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";

    const posts = await searchPublishedPosts(query);

    logInfo("blog.search.executed", { requestId, query, resultCount: posts.length });

    return NextResponse.json({
      query,
      items: posts,
      total: posts.length
    });
  } catch (error) {
    logError("blog.search.error", {
      requestId,
      message: error instanceof Error ? error.message : "Unknown"
    });

    return NextResponse.json({ message: "Search unavailable" }, { status: 503 });
  }
}
