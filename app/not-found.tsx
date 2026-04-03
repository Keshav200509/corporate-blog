import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="text-zinc-500 dark:text-zinc-400">This page could not be found.</p>
      <Link
        href="/"
        className="mx-auto rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        ← Back to home
      </Link>
    </main>
  );
}
