import Image from "next/image";
import ModelTryPanel from "@/components/ModelTryPanel";

const navLinks = [
  "Models",
  "Datasets",
  "Spaces",
  "Community",
  "Docs",
  "Pricing",
];

const modelFacts = [
  { label: "Model", value: "briaai/RMBG-1.4" },
  { label: "Type", value: "Saliency / Background removal" },
  { label: "Frameworks", value: "Transformers · PyTorch · ONNX" },
  { label: "License", value: "bria-rmbg-1.4 (non-commercial)" },
];

const capabilities = [
  "Foreground isolation",
  "Enterprise-safe dataset",
  "Multi-format export",
  "Works with Transformers.js",
];

const distributions = [
  {
    title: "Scene composition",
    rows: [
      { label: "Objects only", value: "45%" },
      { label: "People + objects/animals", value: "25%" },
      { label: "People only", value: "17%" },
      { label: "Text & graphic mixes", value: "8%" },
    ],
  },
  {
    title: "Visual style",
    rows: [
      { label: "Photorealistic", value: "87%" },
      { label: "Stylized", value: "13%" },
      { label: "Single subject", value: "51%" },
      { label: "Multiple subjects", value: "49%" },
    ],
  },
];

const resourceLinks = [
  { label: "Model card", href: "https://huggingface.co/briaai/RMBG-1.4" },
  {
    label: "Demo in Spaces",
    href: "https://huggingface.co/spaces/briaai/BRIA-RMBG-1.4",
  },
  {
    label: "Commercial license info",
    href: "https://bria.ai/license",
  },
  { label: "Join BRIA AI Discord", href: "https://discord.gg/bria" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#09090b,_#020617)] pb-24 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4">
            <Image
              src="/huggingface.svg"
              alt="Hugging Face"
              width={56}
              height={56}
              priority
            />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">
                AI Model Collections
              </p>
              <h1 className="text-3xl font-semibold text-white">
                Curate, compare, and try AI models in one place
              </h1>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-white/70">
            {navLinks.map((link) => (
              <a
                key={link}
                href="https://huggingface.co"
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-yellow-400 hover:text-white"
              >
                {link}
              </a>
            ))}
          </nav>
        </header>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
              Spotlight #1
            </p>
            <h2 className="text-4xl font-semibold">
              BRIA RMBG 1.4 — production-grade background removal
            </h2>
            <p className="text-base text-white/80">
              Trained on 12k+ meticulously labeled, license-cleared assets, RMBG
              1.4 excels at separating humans, products, and props across e-commerce,
              creative, and gaming workflows. Try it instantly via Hugging Face
              Inference, Transformers, or ONNX runtimes.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://huggingface.co/briaai/RMBG-1.4"
                className="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
                target="_blank"
                rel="noreferrer"
              >
                View on Hugging Face ↗
              </a>
              <a
                href="https://transformers.js.org/models?search=RMBG"
                className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-yellow-300"
                target="_blank"
                rel="noreferrer"
              >
                Transformers.js support
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-white/80">
            <h3 className="text-lg font-semibold text-white">Model facts</h3>
            <dl className="mt-4 space-y-3">
              {modelFacts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4">
                  <dt className="text-white/60">{fact.label}</dt>
                  <dd className="text-right font-medium text-white">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {capabilities.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          {distributions.map((block) => (
            <article
              key={block.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
                Training data
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {block.title}
              </h3>
              <ul className="mt-4 space-y-3 text-white/80">
                {block.rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3"
                  >
                    <span>{row.label}</span>
                    <span className="font-semibold text-white">{row.value}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
              Model card excerpt
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Why RMBG 1.4?
            </h3>
            <ul className="mt-4 space-y-4 text-white/80">
              <li>
                <strong className="text-white">Legal-first data</strong>: trained on
                licensed, bias-aware datasets spanning stock, commerce, and gaming
                imagery.
              </li>
              <li>
                <strong className="text-white">Architecture</strong>: IS-Net base with
                proprietary training loop for crisper alpha mattes.
              </li>
              <li>
                <strong className="text-white">Deployment</strong>: export to
                Transformers, PyTorch, ONNX, or run inside the browser via WebGPU.
              </li>
              <li>
                <strong className="text-white">Use cases</strong>: e-commerce asset
                pipelines, creative tooling, avatars, and UGC moderation.
              </li>
            </ul>
          </article>
          <ModelTryPanel />
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
                Resources & community
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Keep iterating with Hugging Face + BRIA AI
              </h3>
              <p className="mt-2 text-white/80">
                RMBG 1.4 ships with sample notebooks, ONNX weights, and 100+ Spaces
                demos. Use this hub as a jumping-off point for your own model
                collection and benchmarking suite.
              </p>
            </div>
            <div className="grid gap-3 text-sm font-medium text-yellow-200">
              {resourceLinks.map((resource) => (
                <a
                  key={resource.label}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-yellow-300 hover:text-yellow-100"
                >
                  {resource.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
