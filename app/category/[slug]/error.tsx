"use client";

import Link from "next/link";

export default function CategoryError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Unable to load this category page.</h1>
      <div className="flex justify-center gap-4">
        <button onClick={reset} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
          Try again
        </button>
        <Link href="/blog" className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
          ← Back to blog
        </Link>
      </div>
    </main>
  );
}
