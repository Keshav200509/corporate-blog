import { NextResponse } from "next/server";
import { listAuthors } from "../../../../src/blog/services/author-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authors = await listAuthors();
    return NextResponse.json({ items: authors, total: authors.length });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
