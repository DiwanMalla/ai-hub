/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import type { ModelConfig } from "@/config/models";

interface FiboPanelProps {
  modelConfig: ModelConfig;
}

type GenerationMode = "generate" | "refine" | "inspire";

export default function FiboPanel({ modelConfig }: FiboPanelProps) {
  const [mode, setMode] = useState<GenerationMode>("generate");
  const [prompt, setPrompt] = useState<string>("");
  const [jsonPrompt, setJsonPrompt] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const handleGenerate = async () => {
    if (!prompt.trim() && mode === "generate") {
      setError("Please enter a prompt");
      return;
    }

    if (mode === "inspire" && !selectedImage) {
      setError("Please upload an image for Inspire mode");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress("Generating image with FIBO...");

    try {
      // Call the FIBO API endpoint
      const response = await fetch("/api/fibo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          prompt: prompt.trim(),
          jsonPrompt: jsonPrompt.trim() || undefined,
          image: mode === "inspire" ? selectedImage : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const data = await response.json();
      setGeneratedImage(data.imageBase64);
      if (data.jsonPrompt) {
        setJsonPrompt(data.jsonPrompt);
      }
      setProgress("Image generated successfully!");
      setTimeout(() => setProgress(""), 2000);
    } catch (err) {
      console.error("Generation error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to generate image";
      setError(message);
      setProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-transparent p-8 shadow-2xl backdrop-blur">
      {/* Mode Selector */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium text-white/80">
          Generation Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["generate", "refine", "inspire"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold capitalize transition ${
                mode === m
                  ? "bg-yellow-400 text-black"
                  : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-white/60">
          {mode === "generate" &&
            "Start with a short prompt. FIBO expands it into structured JSON."}
          {mode === "refine" &&
            "Refine an existing JSON prompt with targeted changes."}
          {mode === "inspire" &&
            "Upload an image and get variations or creative iterations."}
        </p>
      </div>

      {/* Status/Progress */}
      {progress && (
        <div className="mb-6 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
          <div className="flex items-center gap-3">
            {isLoading && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
            )}
            <p className="text-sm text-blue-300">{progress}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Inspire Mode: Image Upload */}
      {mode === "inspire" && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-white/80">
            Upload Image for Inspiration
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-2.5 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-yellow-300"
          />
          {selectedImage && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={selectedImage}
                alt="Inspiration"
                className="h-48 w-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-white/80">
          {mode === "generate"
            ? "Describe your image"
            : mode === "refine"
              ? "Refinement instruction"
              : "Creative direction (optional)"}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === "generate"
              ? "A hyper-detailed owl sitting in trees at night with expressive eyes..."
              : mode === "refine"
                ? "Make the owl brown, add jungle vegetation, etc."
                : "Make futuristic, warmer tones, etc."
          }
          rows={4}
          className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none"
        />
      </div>

      {/* JSON Prompt (for Refine mode) */}
      {mode === "refine" && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-white/80">
            Structured JSON Prompt (optional)
          </label>
          <textarea
            value={jsonPrompt}
            onChange={(e) => setJsonPrompt(e.target.value)}
            placeholder='{"subject":"owl","lighting":"moonlight",...}'
            rows={6}
            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none"
          />
          <p className="mt-2 text-xs text-white/60">
            Paste a previous JSON prompt here to refine it
          </p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="mb-6 w-full rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Generating..." : "Generate Image"}
      </button>

      {/* Results */}
      {generatedImage && (
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white/80">
                Generated Image
              </p>
              <a
                href={generatedImage}
                download="fibo-generated.png"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full"
              />
            </div>
          </div>

          {jsonPrompt && (
            <div>
              <p className="mb-3 text-sm font-medium text-white/80">
                Structured JSON Prompt
              </p>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <pre className="overflow-x-auto text-xs text-white/80">
                  {JSON.stringify(JSON.parse(jsonPrompt), null, 2)}
                </pre>
              </div>
              <p className="mt-2 text-xs text-white/60">
                Copy this JSON to refine the image in Refine mode
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <div className="flex items-start gap-2">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold text-white">
              FIBO requires server-side inference
            </p>
            <p className="mt-1">
              This model uses Hugging Face Inference API with your API token.
              Set <code className="rounded bg-white/10 px-1.5 py-0.5">HUGGINGFACE_API_TOKEN</code> in your environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
