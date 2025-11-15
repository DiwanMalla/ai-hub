export interface ModelConfig {
  id: string;
  slug: string;
  name: string;
  version: string;
  category: string;
  description: string;
  detailedDescription: string;
  provider: string;
  likes: string;
  tags: string[];
  status: "active" | "coming-soon" | "beta";
  // Transformers.js configuration
  pipeline: {
    task: string;
    model: string;
    options?: Record<string, unknown>;
  };
  // UI configuration
  ui: {
    inputTypes: ("file" | "url")[];
    outputFormat: string;
    maxFileSize: number; // in MB
    acceptedFormats: string[];
  };
  // Links
  links: {
    huggingface?: string;
    github?: string;
    documentation?: string;
    paper?: string;
  };
}

export const models: ModelConfig[] = [
  {
    id: "rmbg-2.0",
    slug: "bria-rmbg-2.0",
    name: "BRIA RMBG 2.0",
    version: "2.0",
    category: "Image Segmentation",
    description:
      "Next-gen background removal with improved accuracy and edge detection",
    detailedDescription:
      "BRIA RMBG 2.0 is an advanced background removal model trained on enterprise-safe, licensed data. It offers superior edge detection, handles complex scenarios like hair and transparent objects, and provides production-grade results suitable for commercial use. The model runs entirely in your browser using WebAssembly and WebGPU.",
    provider: "BRIA AI",
    likes: "2.1k",
    tags: ["Image Segmentation", "Transformers.js", "Browser-Ready", "WebGPU"],
    status: "active",
    pipeline: {
      task: "image-segmentation",
      model: "briaai/RMBG-2.0",
      options: {
        return_mask: true,
      },
    },
    ui: {
      inputTypes: ["file", "url"],
      outputFormat: "png",
      maxFileSize: 10,
      acceptedFormats: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    links: {
      huggingface: "https://huggingface.co/briaai/RMBG-2.0",
      documentation: "https://huggingface.co/docs/transformers.js",
    },
  },
  // Add more models here as you expand your collection
  {
    id: "placeholder-1",
    slug: "coming-soon",
    name: "More Models Coming",
    version: "—",
    category: "Various",
    description: "Expanding the collection with more AI models",
    detailedDescription:
      "We're continuously adding new AI models to this hub. Stay tuned for text generation, image classification, object detection, and more!",
    provider: "Community",
    likes: "—",
    tags: ["Placeholder"],
    status: "coming-soon",
    pipeline: {
      task: "",
      model: "",
    },
    ui: {
      inputTypes: [],
      outputFormat: "",
      maxFileSize: 0,
      acceptedFormats: [],
    },
    links: {},
  },
];

export function getModelBySlug(slug: string): ModelConfig | undefined {
  return models.find((model) => model.slug === slug);
}

export function getActiveModels(): ModelConfig[] {
  return models.filter((model) => model.status === "active");
}
