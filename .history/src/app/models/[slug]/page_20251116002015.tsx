import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModelBySlug, models } from "@/config/models";
import ModelTryPanel from "@/components/ModelTryPanel";
import FiboPanel from "@/components/FiboPanel";

export async function generateStaticParams() {
  return models.map((model) => ({
    slug: model.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModelPage({ params }: PageProps) {
  const { slug } = await params;
  const model = getModelBySlug(slug);

  if (!model || model.status !== "active") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/huggingface.svg"
                alt="Hugging Face"
                width={48}
                height={48}
                className="drop-shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  AI Model Hub
                </h1>
                <p className="text-sm text-yellow-300/90">
                  {model.name} v{model.version}
                </p>
              </div>
            </Link>
            <nav className="flex items-center gap-3">
              <div className="hidden md:flex md:items-center md:gap-3">
                <Link
                  href="/"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-yellow-400/50 hover:bg-white/10 hover:text-white"
                >
                  ← Back to Models
                </Link>
                {model.links.huggingface && (
                  <a
                    href={model.links.huggingface}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-yellow-400/50 hover:bg-white/10 hover:text-white"
                  >
                    Model Card ↗
                  </a>
                )}
              </div>

              <details className="md:hidden relative">
                <summary className="list-none cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80">
                  Menu
                </summary>
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-black/90 p-2 backdrop-blur">
                  <Link href="/" className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5">
                    ← Back to Models
                  </Link>
                  {model.links.huggingface && (
                    <a
                      href={model.links.huggingface}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                    >
                      Model Card ↗
                    </a>
                  )}
                </div>
              </details>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Model Info Section */}
        <section className="mb-12">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-sm font-medium text-white/80">
                  {model.category}
                </span>
                <span className="text-sm text-white/50">
                  by {model.provider}
                </span>
                <div className="flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  Active
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white md:text-5xl">
                {model.name}
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-white/70">
                {model.description}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold text-white">{model.likes}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8 flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* About */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur">
            <h3 className="mb-3 text-xl font-bold text-white">
              About this model
            </h3>
            <p className="text-white/70">{model.detailedDescription}</p>

            {/* Links */}
            {Object.keys(model.links).length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {model.links.huggingface && (
                  <a
                    href={model.links.huggingface}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    View on Hugging Face
                  </a>
                )}
                {model.links.documentation && (
                  <a
                    href={model.links.documentation}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Documentation
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Interactive Demo */}
        <section>
          <div className="mb-6">
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
                Interactive Playground
                {model.pipeline.task !== "text-to-image"
                  ? " • Runs in your browser"
                  : " • Server-side inference"}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              Try {model.name} Live
            </h3>
            <p className="mt-2 text-white/60">
              {model.pipeline.task === "text-to-image"
                ? "Generate images with structured JSON prompts. Supports Generate, Refine, and Inspire modes."
                : "Upload an image and see the model in action. All processing happens locally using WebGPU acceleration."}
            </p>
          </div>

          {model.pipeline.task === "text-to-image" ? (
            <FiboPanel modelConfig={model} />
          ) : (
            <ModelTryPanel modelConfig={model} />
          )}
        </section>

        {/* Technical Details */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-6">
            <h4 className="mb-2 font-semibold text-white">Task Type</h4>
            <p className="text-sm text-white/60">{model.pipeline.task}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-6">
            <h4 className="mb-2 font-semibold text-white">Model ID</h4>
            <p className="text-sm text-white/60 font-mono break-all">
              {model.pipeline.model}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent p-6">
            <h4 className="mb-2 font-semibold text-white">Output Format</h4>
            <p className="text-sm text-white/60 uppercase">
              {model.ui.outputFormat}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-black/20 backdrop-blur">
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
              <Link
                href="/"
                className="text-white/50 transition hover:text-yellow-400"
              >
                Home
              </Link>
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
