import Image from "next/image";
import Link from "next/link";
import { models, getActiveModels } from "@/config/models";

const navLinks = [
  { label: "Models", href: "#models" },
  { label: "Docs", href: "https://huggingface.co/docs" },
  { label: "Community", href: "https://huggingface.co" },
];

export default function Home() {
  const activeModels = getActiveModels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/huggingface.svg"
                alt="Hugging Face"
                width={48}
                height={48}
                priority
                className="drop-shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  AI Model Hub
                </h1>
                <p className="text-sm text-yellow-300/90">
                  Your curated collection of AI models
                </p>
              </div>
            </Link>
            <nav className="flex flex-wrap gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-yellow-400/50 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16 rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10 p-8 shadow-2xl backdrop-blur-sm md:p-12">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400"></span>
              </span>
              <span className="text-sm font-semibold text-yellow-300">
                Live & Ready to Use
              </span>
            </div>
            <h2 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Discover, test, and integrate{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                AI models
              </span>{" "}
              in seconds
            </h2>
            <p className="max-w-2xl text-lg text-white/70">
              Run powerful AI models directly in your browser using
              Transformers.js. No server setup, no API keys required. Your
              curated collection of production-ready models.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#models"
                className="group inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-black shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/30"
              >
                Explore Models
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="https://huggingface.co/docs/transformers.js"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:border-yellow-400/50 hover:bg-white/10"
              >
                Documentation
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Model Collection */}
        <section id="models" className="mb-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Model Collection
              </h3>
              <p className="mt-2 text-white/60">
                Curated AI models ready to use in your projects
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
              <span className="text-white/60">Total: </span>
              <span className="font-semibold text-white">
                {activeModels.length} active
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <article
                key={model.id}
                className={`group relative overflow-hidden rounded-2xl border transition ${
                  model.status === "active"
                    ? "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/10"
                    : "border-white/5 bg-white/[0.02] opacity-60"
                }`}
              >
                {model.status === "active" && (
                  <div className="absolute right-4 top-4 z-10">
                    <div className="flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                      Active
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs font-medium text-white/80">
                        {model.category}
                      </span>
                      <span className="text-xs text-white/50">
                        by {model.provider}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      {model.name}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">
                      {model.description}
                    </p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {model.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <svg
                        className="h-4 w-4 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-white">
                        {model.likes}
                      </span>
                    </div>
                    {model.status === "active" && (
                      <Link
                        href={`/models/${model.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-yellow-400/10 px-3 py-1.5 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400/20"
                      >
                        Try now
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="mb-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-6 backdrop-blur">
            <div className="mb-4 inline-flex rounded-xl bg-blue-400/10 p-3">
              <svg
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-white">
              Browser-Native
            </h4>
            <p className="text-sm text-white/60">
              Runs entirely in your browser using WebAssembly and WebGPU for
              maximum privacy and speed.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent p-6 backdrop-blur">
            <div className="mb-4 inline-flex rounded-xl bg-green-400/10 p-3">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-white">Privacy First</h4>
            <p className="text-sm text-white/60">
              Your data never leaves your device. All processing happens
              locally with zero data sent to servers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-6 backdrop-blur">
            <div className="mb-4 inline-flex rounded-xl bg-purple-400/10 p-3">
              <svg
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-white">
              Production Ready
            </h4>
            <p className="text-sm text-white/60">
              Enterprise-grade models trained on licensed datasets, ready for
              commercial deployment.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <Image
                src="/huggingface.svg"
                alt="Hugging Face"
                width={24}
                height={24}
              />
              <span>Powered by Hugging Face Transformers.js</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="https://huggingface.co"
                className="text-white/50 transition hover:text-yellow-400"
              >
                Hugging Face
              </a>
              <a
                href="https://github.com/xenova/transformers.js"
                className="text-white/50 transition hover:text-yellow-400"
              >
                Transformers.js
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image
                src="/huggingface.svg"
                alt="Hugging Face"
                width={48}
                height={48}
                priority
                className="drop-shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  AI Model Hub
                </h1>
                <p className="text-sm text-yellow-300/90">
                  Your curated collection of AI models
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-yellow-400/50 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16 rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10 p-8 shadow-2xl backdrop-blur-sm md:p-12">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400"></span>
              </span>
              <span className="text-sm font-semibold text-yellow-300">
                Live & Ready to Use
              </span>
            </div>
            <h2 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Discover, test, and integrate{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                AI models
              </span>{" "}
              in seconds
            </h2>
            <p className="max-w-2xl text-lg text-white/70">
              Run powerful AI models directly in your browser using
              Transformers.js. No server setup, no API keys required. Start with
              background removal and expand your collection.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#try"
                className="group inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-6 py-3 font-semibold text-black shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/30"
              >
                Try RMBG 1.4 Live
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="https://huggingface.co/briaai/RMBG-1.4"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:border-yellow-400/50 hover:bg-white/10"
              >
                View Model Card
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Model Collection */}
        <section id="models" className="mb-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Model Collection
              </h3>
              <p className="mt-2 text-white/60">
                Curated AI models ready to use in your projects
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
              <span className="text-white/60">Total: </span>
              <span className="font-semibold text-white">
                {aiModels.filter((m) => m.status === "active").length} active
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiModels.map((model) => (
              <article
                key={model.id}
                className={`group relative overflow-hidden rounded-2xl border transition ${
                  model.status === "active"
                    ? "border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/10"
                    : "border-white/5 bg-white/[0.02] opacity-60"
                }`}
              >
                {model.status === "active" && (
                  <div className="absolute right-4 top-4 z-10">
                    <div className="flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                      Active
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs font-medium text-white/80">
                        {model.category}
                      </span>
                      <span className="text-xs text-white/50">
                        by {model.provider}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      {model.name}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">
                      {model.description}
                    </p>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <svg
                        className="h-4 w-4 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-white">
                        {model.likes}
                      </span>
                    </div>
                    {model.status === "active" && (
                      <a
                        href="#try"
                        className="inline-flex items-center gap-1 rounded-lg bg-yellow-400/10 px-3 py-1.5 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400/20"
                      >
                        Try now
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="try" className="mb-16">
          <div className="mb-8">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2">
              <svg
                className="h-4 w-4 text-purple-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 7H7v6h6V7z" />
                <path
                  fillRule="evenodd"
                  d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold text-purple-300">
                Interactive Playground • Powered by Transformers.js
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              Try BRIA RMBG 1.4 Live
            </h3>
            <p className="mt-2 text-white/60">
              Upload an image and remove its background instantly—all processing
              happens in your browser using WebGPU acceleration.
            </p>
          </div>

          <ModelTryPanel />
        </section>

        {/* Feature Highlights */}
        <section className="mb-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-6 backdrop-blur">
            <div className="mb-4 inline-flex rounded-xl bg-blue-400/10 p-3">
              <svg
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-white">
              Browser-Native
            </h4>
            <p className="text-sm text-white/60">
              Runs entirely in your browser using WebAssembly and WebGPU for
              maximum privacy and speed.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent p-6 backdrop-blur">
            <div className="mb-4 inline-flex rounded-xl bg-green-400/10 p-3">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-white">Privacy First</h4>
            <p className="text-sm text-white/60">
              Your images never leave your device. All processing happens
              locally with zero data sent to servers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-6 backdrop-blur">
            <div className="mb-4 inline-flex rounded-xl bg-purple-400/10 p-3">
              <svg
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-bold text-white">
              Production Ready
            </h4>
            <p className="text-sm text-white/60">
              Enterprise-grade models trained on licensed datasets, ready for
              commercial deployment.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <Image
                src="/huggingface.svg"
                alt="Hugging Face"
                width={24}
                height={24}
              />
              <span>Powered by Hugging Face Transformers.js</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="https://huggingface.co"
                className="text-white/50 transition hover:text-yellow-400"
              >
                Hugging Face
              </a>
              <a
                href="https://github.com/xenova/transformers.js"
                className="text-white/50 transition hover:text-yellow-400"
              >
                Transformers.js
              </a>
              <a
                href="https://bria.ai"
                className="text-white/50 transition hover:text-yellow-400"
              >
                BRIA AI
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
