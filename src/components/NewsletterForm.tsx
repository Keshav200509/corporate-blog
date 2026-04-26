"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setStatus("success");
      setEmail("");
    }
  }

  if (status === "success") {
    return (
      <p className="py-2.5 text-sm font-semibold text-indigo-200">
        ✓ You&apos;re on the list — welcome aboard!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@company.com"
        required
        className="flex-1 rounded-xl border-0 bg-white/15 px-4 py-2.5 text-sm text-white placeholder-indigo-300 outline-none ring-white/30 transition focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
      >
        Subscribe
      </button>
    </form>
  );
}
