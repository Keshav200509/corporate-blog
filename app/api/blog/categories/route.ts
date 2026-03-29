import { NextResponse } from "next/server";
import { listCategories } from "../../../../src/blog/services/category-service";

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json({ items: categories, total: categories.length });
}
