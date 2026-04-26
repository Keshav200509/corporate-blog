import { NextResponse } from "next/server";
import { listCategories } from "../../../../src/blog/services/category-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json({ items: categories, total: categories.length });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
