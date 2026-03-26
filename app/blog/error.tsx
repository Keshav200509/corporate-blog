"use client";

import Link from "next/link";

export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong loading the blog.</h1>
      <p className="text-zinc-500 dark:text-zinc-400">Please retry or return home.</p>
      <div className="flex justify-center gap-4">
        <button onClick={reset} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
          Try again
        </button>
        <Link href="/" className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">
          ← Home
        </Link>
      </div>
    </main>
  );
}
