import Link from "next/link";
import type { BlogPost } from "../blog/types";

/* ── Helpers ─────────────────────────────────────────────────────── */

/*
 * Design spec: all category pills use unified Tag BG #eef2ff / Tag Text #4338ca.
 * The accent bar (top stripe) remains color-coded per category.
 */
const UNIFIED_TAG = "badge badge-tag"; // bg-indigo-50 text-indigo-700 per design token

export const CATEGORY_COLORS: Record<string, { badge: string; accent: string; glow: string }> = {
  engineering: { badge: UNIFIED_TAG, accent: "bg-indigo-500",  glow: "bg-indigo-600/30"  },
  seo:         { badge: UNIFIED_TAG, accent: "bg-emerald-500", glow: "bg-emerald-600/25" },
  operations:  { badge: UNIFIED_TAG, accent: "bg-amber-500",   glow: "bg-amber-600/25"   },
  performance: { badge: UNIFIED_TAG, accent: "bg-rose-500",    glow: "bg-rose-600/25"    },
  strategy:    { badge: UNIFIED_TAG, accent: "bg-violet-500",  glow: "bg-violet-600/25"  },
  marketing:   { badge: UNIFIED_TAG, accent: "bg-cyan-500",    glow: "bg-cyan-600/25"    },
};

export function categoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? { badge: UNIFIED_TAG, accent: "bg-zinc-400", glow: "bg-zinc-400/20" };
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function readingTime(content: string[]) {
  return Math.max(1, Math.ceil(content.join(" ").split(/\s+/).length / 200));
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── PostCard variants ────────────────────────────────────────────── */

type Variant = "default" | "featured" | "compact" | "horizontal";

interface Props {
  post: BlogPost;
  variant?: Variant;
  index?: number;
}

export default function PostCard({ post, variant = "default", index = 0 }: Props) {
  const primary = post.categories[0];
  const color = primary ? categoryColor(primary.slug) : { badge: UNIFIED_TAG, accent: "bg-zinc-400", glow: "bg-zinc-400/20" };
  const rt = readingTime(post.content);

  /* ── Featured (dark hero card) ── */
  if (variant === "featured") {
    return (
      <article
        className="relative overflow-hidden rounded-2xl text-white shadow-xl animate-slide-up"
        style={{ background: "#0f172a" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60" />
        <div className={`pointer-events-none absolute right-0 top-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl ${color.glow}`} />
        <div className="pointer-events-none absolute -bottom-10 left-20 h-60 w-60 rounded-full bg-violet-600/10 blur-[70px]" />

        <div className="relative p-8 md:p-12">
          {primary && (
            <span className={`${color.badge} mb-4 inline-flex`}>{primary.name}</span>
          )}
          <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            <Link href={`/blog/${post.slug}`} className="transition hover:text-indigo-300">
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">
            {post.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/50">
            <span className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${color.accent}`}>
                {initials(post.author.name)}
              </span>
              <Link href={`/author/${post.author.slug}`} className="font-medium text-white/70 transition hover:text-white">
                {post.author.name}
              </Link>
            </span>
            <span aria-hidden>·</span>
            <span>{rt} min read</span>
            {post.publishedAt && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </>
            )}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-[9px] bg-white px-6 py-3 text-[15px] font-semibold text-zinc-900 transition hover:bg-indigo-50"
          >
            Read story →
          </Link>
        </div>
      </article>
    );
  }

  /* ── Compact (wire/list) ── */
  if (variant === "compact") {
    return (
      <article
        className="flex items-start gap-4 border-b border-zinc-100 py-4 last:border-0 dark:border-zinc-800"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <Link
          href={`/blog/${post.slug}`}
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white transition hover:opacity-80 ${color.accent}`}
          tabIndex={-1}
          aria-hidden={true}
        >
          {initials(post.author.name)}
        </Link>
        <div className="min-w-0">
          {primary && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {primary.name}
            </span>
          )}
          <h3 className="mt-0.5 font-semibold leading-snug text-zinc-900 dark:text-white">
            <Link
              href={`/blog/${post.slug}`}
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {post.title}
            </Link>
          </h3>
          <p className="mt-0.5 text-[13px] text-zinc-400">
            {post.author.name} · {rt} min read
            {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
          </p>
        </div>
      </article>
    );
  }

  /* ── Horizontal (search results) ── */
  if (variant === "horizontal") {
    return (
      <article className="card card-hover flex gap-5 p-5">
        <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${color.accent}`}>
          {initials(post.author.name)}
        </div>
        <div className="min-w-0">
          {primary && <span className={color.badge}>{primary.name}</span>}
          <h2 className="mt-2 text-[20px] font-bold text-zinc-900 dark:text-white">
            <Link
              href={`/blog/${post.slug}`}
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-500 line-clamp-2">
            {post.excerpt}
          </p>
          <p className="mt-2 text-[13px] text-zinc-400">
            {post.author.name} · {rt} min read{post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
          </p>
        </div>
      </article>
    );
  }

  /* ── Default (card grid) — Design spec: border #e4e4e7, radius 16px, accent bar 4px ── */
  return (
    <article
      className="card card-hover group flex flex-col overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top accent bar — height 4px, color-coded by topic */}
      <div className={`h-1 w-full shrink-0 ${color.accent}`} />
      <div className="flex flex-1 flex-col p-6">
        {/* Tag pill — design spec: #eef2ff bg, #4338ca text, fully rounded */}
        {primary && <span className={color.badge}>{primary.name}</span>}

        {/* Card title — 20px/700 #18181b */}
        <h2 className="mt-3 flex-1 text-[20px] font-bold leading-snug text-zinc-900 dark:text-white">
          <Link
            href={`/blog/${post.slug}`}
            className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt — 15px/400 #71717a, 3 lines max */}
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-zinc-500">
          {post.excerpt}
        </p>

        {/* Author row — 28px avatar, 13px/500 name, separator, 13px read time */}
        <div className="mt-5 flex items-center gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${color.accent}`}>
            {initials(post.author.name)}
          </div>
          <Link
            href={`/author/${post.author.slug}`}
            className="text-[13px] font-medium text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
          >
            {post.author.name}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>·</span>
          <span className="text-[13px] text-zinc-400">
            {rt} min read{post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
