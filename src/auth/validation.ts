export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: Array<{ path: string; message: string }> } };

type LoginPayload = {
  email: string;
  password: string;
};

type RefreshPayload = {
  refreshToken: string;
};

type DraftPayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  seoTitle?: string;
  seoDescription?: string;
  categoryIds: string[];
};

function fail(path: string, message: string) {
  return { success: false as const, error: { issues: [{ path, message }] } };
}

export const loginSchema = {
  safeParse(input: unknown): ValidationResult<LoginPayload> {
    if (!input || typeof input !== "object") {
      return fail("body", "Request body is required");
    }

    const payload = input as Partial<LoginPayload>;

    if (!payload.email || !payload.email.includes("@")) {
      return fail("email", "Valid email is required");
    }

    if (!payload.password || payload.password.length < 12 || payload.password.length > 128) {
      return fail("password", "Password must be 12-128 chars");
    }

    return {
      success: true,
      data: {
        email: payload.email,
        password: payload.password
      }
    };
  }
};

export const refreshSchema = {
  safeParse(input: unknown): ValidationResult<RefreshPayload> {
    if (!input || typeof input !== "object") {
      return fail("body", "Request body is required");
    }

    const payload = input as Partial<RefreshPayload>;

    if (!payload.refreshToken || payload.refreshToken.length < 20) {
      return fail("refreshToken", "refreshToken must be at least 20 characters");
    }

    return {
      success: true,
      data: {
        refreshToken: payload.refreshToken
      }
    };
  }
};

export const createDraftSchema = {
  safeParse(input: unknown): ValidationResult<DraftPayload> {
    if (!input || typeof input !== "object") {
      return fail("body", "Request body is required");
    }

    const payload = input as Partial<DraftPayload>;

    if (!payload.title || payload.title.length < 5 || payload.title.length > 180) {
      return fail("title", "Title must be 5-180 chars");
    }

    if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
      return fail("slug", "Slug must use lowercase letters, numbers and hyphens");
    }

    if (!payload.excerpt || payload.excerpt.length < 20 || payload.excerpt.length > 300) {
      return fail("excerpt", "Excerpt must be 20-300 chars");
    }

    if (!Array.isArray(payload.content) || payload.content.length === 0 || payload.content.some((item) => typeof item !== "string" || item.length === 0)) {
      return fail("content", "Content must contain at least one paragraph");
    }

    if (!Array.isArray(payload.categoryIds) || payload.categoryIds.length === 0 || payload.categoryIds.some((item) => typeof item !== "string" || item.length === 0)) {
      return fail("categoryIds", "At least one category is required");
    }

    if (payload.seoTitle && payload.seoTitle.length > 180) {
      return fail("seoTitle", "SEO title max length is 180");
    }

    if (payload.seoDescription && payload.seoDescription.length > 220) {
      return fail("seoDescription", "SEO description max length is 220");
    }

    return {
      success: true,
      data: {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content,
        categoryIds: payload.categoryIds,
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription
      }
    };
  }
};

export const updateDraftSchema = {
  safeParse(input: unknown): ValidationResult<Partial<DraftPayload>> {
    if (!input || typeof input !== "object") {
      return fail("body", "Request body is required");
    }

    const payload = input as Partial<DraftPayload>;

    if (payload.title !== undefined && (payload.title.length < 5 || payload.title.length > 180)) {
      return fail("title", "Title must be 5-180 chars");
    }

    if (payload.slug !== undefined && !/^[a-z0-9-]+$/.test(payload.slug)) {
      return fail("slug", "Slug must use lowercase letters, numbers and hyphens");
    }

    if (payload.excerpt !== undefined && (payload.excerpt.length < 20 || payload.excerpt.length > 300)) {
      return fail("excerpt", "Excerpt must be 20-300 chars");
    }

    if (payload.content !== undefined && (!Array.isArray(payload.content) || payload.content.some((item) => typeof item !== "string" || item.length === 0))) {
      return fail("content", "Content must be non-empty strings");
    }

    if (payload.categoryIds !== undefined && (!Array.isArray(payload.categoryIds) || payload.categoryIds.some((item) => typeof item !== "string" || item.length === 0))) {
      return fail("categoryIds", "categoryIds must be string ids");
    }

    return {
      success: true,
      data: payload
    };
  }
};
