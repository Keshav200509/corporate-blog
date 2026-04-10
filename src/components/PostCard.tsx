import Link from "next/link";
import type { BlogPost } from "../blog/types";

/* ── Helpers ─────────────────────────────────────────────────────────── */

export const CATEGORY_COLORS: Record<string, { badge: string; accent: string }> = {
  engineering: { badge: "badge badge-indigo",  accent: "bg-indigo-500"  },
  seo:         { badge: "badge badge-emerald", accent: "bg-emerald-500" },
  operations:  { badge: "badge badge-amber",   accent: "bg-amber-500"   },
  performance: { badge: "badge badge-rose",    accent: "bg-rose-500"    },
  strategy:    { badge: "badge badge-violet",  accent: "bg-violet-500"  },
  marketing:   { badge: "badge badge-cyan",    accent: "bg-cyan-500"    },
};

export function categoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? { badge: "badge badge-zinc", accent: "bg-zinc-400" };
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

/* ── PostCard variants ────────────────────────────────────────────────── */

type Variant = "default" | "featured" | "compact" | "horizontal";

interface Props {
  post: BlogPost;
  variant?: Variant;
  index?: number;
}

export default function PostCard({ post, variant = "default", index = 0 }: Props) {
  const primary = post.categories[0];
  const color = primary ? categoryColor(primary.slug) : { badge: "badge badge-zinc", accent: "bg-zinc-400" };
  const rt = readingTime(post.content);

  /* ── Featured (hero banner) ── */
  if (variant === "featured") {
    return (
      <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-xl md:p-12 animate-slide-up">
        {/* Decorative orb */}
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="relative">
          {primary && (
            <span className={`${color.badge} mb-4 inline-flex`}>{primary.name}</span>
          )}
          <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            <Link href={`/blog/${post.slug}`} className="transition hover:text-indigo-300">
              {post.title}
            </Link>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            {post.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                {initials(post.author.name)}
              </span>
              {post.author.name}
            </span>
            <span>·</span>
            <span>{rt} min read</span>
            {post.publishedAt && (
              <>
                <span>·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50"
          >
            Read story <span aria-hidden>→</span>
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
        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white ${color.accent}`}>
          {initials(post.author.name)}
        </div>
        <div className="min-w-0">
          {primary && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
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
          <p className="mt-0.5 text-xs text-zinc-500">
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
        <div>
          {primary && <span className={color.badge}>{primary.name}</span>}
          <h2 className="mt-1.5 text-lg font-bold text-zinc-900 dark:text-white">
            <Link
              href={`/blog/${post.slug}`}
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
          <p className="mt-2 text-xs text-zinc-400">
            {post.author.name} · {rt} min read{post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
          </p>
        </div>
      </article>
    );
  }

  /* ── Default (card grid) ── */
  return (
    <article
      className="card card-hover flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top accent stripe */}
      <div className={`h-1 w-full rounded-t-2xl ${color.accent}`} />
      <div className="flex flex-1 flex-col p-6">
        {primary && <span className={color.badge}>{primary.name}</span>}
        <h2 className="mt-3 flex-1 text-xl font-bold leading-tight text-zinc-900 dark:text-white">
          <Link
            href={`/blog/${post.slug}`}
            className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${color.accent}`}>
            {initials(post.author.name)}
          </div>
          <div className="min-w-0">
            <Link
              href={`/author/${post.author.slug}`}
              className="text-xs font-medium text-zinc-700 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
            >
              {post.author.name}
            </Link>
            <p className="text-[11px] text-zinc-400">{rt} min read{post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
