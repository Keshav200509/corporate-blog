export type BlogPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BlogAuthor = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogFaq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  status: BlogPostStatus;
  publishedAt: string | null;
  updatedAt: string;
  author: BlogAuthor;
  categories: BlogCategory[];
  faqs: BlogFaq[];
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type BlogPostFilters = {
  categorySlug?: string;
  authorSlug?: string;
  query?: string;
};
