"use client";

import { useState, useRef, useEffect } from "react";
import { pipeline } from "@huggingface/transformers";

type Pipeline = Awaited<ReturnType<typeof pipeline>>;

export default function ModelTryPanel() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pipelineRef = useRef<Pipeline | null>(null);

  // Initialize the pipeline on component mount
  useEffect(() => {
    async function loadModel() {
      if (pipelineRef.current) return;
      
      setIsModelLoading(true);
      setProgress("Loading AI model... (first time may take a minute)");
      
      try {
        // @ts-expect-error - pipeline types are complex
        pipelineRef.current = await pipeline(
          "image-segmentation",
          "briaai/RMBG-1.4",
          {
            // Optional: Add progress callback
            progress_callback: (data: { status: string; progress?: number }) => {
              if (data.status === "progress" && data.progress) {
                setProgress(`Loading model: ${Math.round(data.progress)}%`);
              } else if (data.status === "done") {
                setProgress("Model ready!");
              } else {
                setProgress(data.status);
              }
            },
          }
        );
        setProgress("Model loaded successfully!");
        setTimeout(() => setProgress(""), 2000);
      } catch (err) {
        console.error("Failed to load model:", err);
        setError("Failed to load the AI model. Please refresh and try again.");
      } finally {
        setIsModelLoading(false);
      }
    }

    loadModel();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setProcessedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlInput = (url: string) => {
    if (!url.trim()) return;
    
    // Basic URL validation
    try {
      new URL(url);
      setSelectedImage(url);
      setProcessedImage(null);
      setError(null);
    } catch {
      setError("Please enter a valid image URL");
    }
  };

  const processImage = async () => {
    if (!selectedImage || !pipelineRef.current) {
      setError("Please select an image and wait for the model to load");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress("Processing image...");

    try {
      // Create an image element to load the source
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = selectedImage;
      });

      setProgress("Removing background...");
      
      // Run the model
      const result = await pipelineRef.current(selectedImage);
      
      // The result is an array of segments, we want the mask
      if (result && Array.isArray(result) && result.length > 0) {
        const mask = result[0].mask;
        
        // Create canvas to combine original image with mask
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) throw new Error("Could not get canvas context");

        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Apply mask to alpha channel
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = mask.width;
        maskCanvas.height = mask.height;
        const maskCtx = maskCanvas.getContext("2d");
        if (!maskCtx) throw new Error("Could not get mask context");
        
        maskCtx.drawImage(mask, 0, 0);
        
        // Resize mask data to match image dimensions if needed
        const resizedMaskCanvas = document.createElement("canvas");
        resizedMaskCanvas.width = canvas.width;
        resizedMaskCanvas.height = canvas.height;
        const resizedMaskCtx = resizedMaskCanvas.getContext("2d");
        if (!resizedMaskCtx) throw new Error("Could not get resized mask context");
        
        resizedMaskCtx.drawImage(mask, 0, 0, canvas.width, canvas.height);
        const resizedMaskData = resizedMaskCtx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Apply mask to alpha channel
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i + 3] = resizedMaskData.data[i]; // Use R channel of mask as alpha
        }

        ctx.putImageData(imageData, 0, 0);
        
        // Convert to data URL
        const resultDataUrl = canvas.toDataURL("image/png");
        setProcessedImage(resultDataUrl);
        setProgress("Done!");
        setTimeout(() => setProgress(""), 2000);
      } else {
        throw new Error("Unexpected model output format");
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process image. Please try another image."
      );
      setProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 shadow-2xl backdrop-blur">
      {/* Status Bar */}
      {(isModelLoading || progress) && (
        <div className="mb-6 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
          <div className="flex items-center gap-3">
            {isModelLoading && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
            )}
            <p className="text-sm text-blue-300">{progress}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="mb-6 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center transition hover:border-yellow-400/50 hover:bg-white/10"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl bg-yellow-400/10 p-4">
            <svg
              className="h-12 w-12 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              Drop an image or click to upload
            </p>
            <p className="mt-1 text-sm text-white/60">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Choose File
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-white/80">
          Or paste an image URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUrlInput(e.currentTarget.value);
              }
            }}
            className="flex-1 rounded-xl border border-white/20 bg-black/30 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none"
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleUrlInput(input.value);
            }}
            className="rounded-xl bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Load
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Image Preview & Results */}
      {selectedImage && (
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium text-white/80">Original</p>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Original"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          {processedImage && (
            <div>
              <p className="mb-3 text-sm font-medium text-white/80">
                Background Removed
              </p>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%,transparent_75%,#1e293b_75%,#1e293b),linear-gradient(45deg,#1e293b_25%,transparent_25%,transparent_75%,#1e293b_75%,#1e293b)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={processedImage}
                  alt="Processed"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={processImage}
          disabled={!selectedImage || isLoading || isModelLoading}
          className="flex-1 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Remove Background"}
        </button>
        {processedImage && (
          <a
            href={processedImage}
            download="removed-background.png"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </a>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <p className="flex items-start gap-2">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            All processing happens in your browser using WebAssembly and WebGPU.
            Your images never leave your device.
          </span>
        </p>
      </div>
    </div>
  );
}
