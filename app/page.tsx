import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">The Corporate Blog</h1>
      <p className="mt-4 text-zinc-600">Production-grade editorial platform with strict draft isolation.</p>
      <Link href="/blog" className="mt-6 inline-block underline">
        Visit Blog
      </Link>
    </main>
  );
}
