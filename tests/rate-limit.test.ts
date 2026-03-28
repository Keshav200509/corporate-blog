import { afterEach, describe, expect, it, vi } from "vitest";
import { __resetRateLimitStoreForTests, checkRateLimit } from "../src/lib/rate-limit";

afterEach(() => {
  __resetRateLimitStoreForTests();
  vi.restoreAllMocks();
});

describe("rate limit utility", () => {
  it("allows first requests up to max and blocks overflow", () => {
    expect(checkRateLimit("ip:login", 2, 1000)).toBe(true);
    expect(checkRateLimit("ip:login", 2, 1000)).toBe(true);
    expect(checkRateLimit("ip:login", 2, 1000)).toBe(false);
  });

  it("resets after window expiration", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000);
    expect(checkRateLimit("ip:search", 1, 1_000)).toBe(true);
    expect(checkRateLimit("ip:search", 1, 1_000)).toBe(false);

    vi.spyOn(Date, "now").mockReturnValue(2_001);
    expect(checkRateLimit("ip:search", 1, 1_000)).toBe(true);
  });

  it("keeps keys isolated", () => {
    expect(checkRateLimit("ip-a", 1, 1_000)).toBe(true);
    expect(checkRateLimit("ip-a", 1, 1_000)).toBe(false);
    expect(checkRateLimit("ip-b", 1, 1_000)).toBe(true);
  });
});
