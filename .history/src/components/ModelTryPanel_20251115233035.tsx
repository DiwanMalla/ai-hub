"use client";

import { useState } from "react";

type TryResult = {
  imageBase64: string;
};

const demoImage =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80";

export default function ModelTryPanel() {
  const [imageUrl, setImageUrl] = useState<string>(demoImage);
  const [hfToken, setHfToken] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/rmbg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          hfToken: hfToken.trim() ? hfToken.trim() : undefined,
        }),
      });

      const data: TryResult | { error: string } = await response.json();

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Something went wrong");
      }

      setResult("imageBase64" in data ? data.imageBase64 : null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10 backdrop-blur">
      <header className="mb-6 flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
          Try it live
        </p>
        <h3 className="text-2xl font-semibold text-white">
          RMBG-1.4 Background Removal Playground
        </h3>
        <p className="text-sm text-white/70">
          Bring your own Hugging Face Inference token (or store it in
          <code className="mx-1 rounded bg-white/10 px-1">HUGGINGFACE_API_TOKEN</code>
          ) and test the model on any hosted image URL.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-white/90">
          Image URL
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none"
            placeholder="https://..."
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-white/90">
          Hugging Face token (optional)
          <input
            type="password"
            value={hfToken}
            onChange={(event) => setHfToken(event.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none"
            placeholder="hf_xxx"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-4 py-3 text-base font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-yellow-200"
        >
          {isLoading ? "Removing background..." : "Generate mask"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-white/80">
            Output PNG (transparent background)
          </p>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result} alt="Background removed" className="w-full" />
          </div>
          <a
            href={result}
            download="bria-rmbg-output.png"
            className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-300 hover:text-yellow-200"
          >
            Download PNG ↗
          </a>
        </div>
      )}
    </section>
  );
}
