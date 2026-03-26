import { describe, expect, it, vi } from "vitest";

const { listPublishedPosts } = vi.hoisted(() => ({
  listPublishedPosts: vi.fn(async () => [])
}));

vi.mock("../src/blog/services/post-service", () => ({
  listPublishedPosts
}));

import { searchPublishedPosts } from "../src/blog/services/search-service";

describe("searchPublishedPosts", () => {
  it("returns empty without querying for short or blank input", async () => {
    await expect(searchPublishedPosts("")).resolves.toEqual([]);
    await expect(searchPublishedPosts(" ")).resolves.toEqual([]);
    await expect(searchPublishedPosts("a")).resolves.toEqual([]);
    expect(listPublishedPosts).not.toHaveBeenCalled();
  });

  it("trims and forwards valid query", async () => {
    await searchPublishedPosts("  seo  ");
    expect(listPublishedPosts).toHaveBeenCalledWith({ query: "seo" });
  });
});
