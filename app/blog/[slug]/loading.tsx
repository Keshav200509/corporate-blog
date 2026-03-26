export default function BlogPostLoading() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-12" aria-busy="true">
      <div className="h-4 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </main>
  );
}
