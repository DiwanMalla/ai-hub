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
    id: "rmbg-1.4",
    slug: "bria-rmbg-1.4",
    name: "BRIA RMBG 1.4",
    version: "1.4",
    category: "Image Segmentation",
    description:
      "Production-grade background removal with enterprise-safe training data",
    detailedDescription:
      "BRIA RMBG 1.4 is a state-of-the-art background removal model trained on enterprise-safe, licensed data. It offers excellent edge detection, handles complex scenarios like hair and semi-transparent objects, and provides production-grade results suitable for commercial use. The model runs entirely in your browser using WebAssembly and WebGPU.",
    provider: "BRIA AI",
    likes: "1.9k",
    tags: ["Image Segmentation", "Transformers.js", "Browser-Ready", "WebGPU"],
    status: "active",
    pipeline: {
      task: "image-segmentation",
      model: "briaai/RMBG-1.4",
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
      huggingface: "https://huggingface.co/briaai/RMBG-1.4",
      documentation: "https://huggingface.co/docs/transformers.js",
    },
  },
  {
    id: "fibo",
    slug: "bria-fibo",
    name: "BRIA FIBO",
    version: "1.0",
    category: "Text-to-Image",
    description:
      "First open-source JSON-native text-to-image model with 1,000+ word structured captions",
    detailedDescription:
      "FIBO is the first open-source, JSON-native text-to-image model trained exclusively on long structured captions. With 8B parameters, FIBO delivers professional-grade control over lighting, composition, color, and camera settings. It supports Generate, Refine, and Inspire modes for iterative image creation. Built with 100% licensed data for enterprise use. Note: This model requires server-side inference and cannot run in the browser.",
    provider: "BRIA AI",
    likes: "274",
    tags: [
      "Text-to-Image",
      "Diffusers",
      "JSON-Native",
      "Professional",
      "Licensed Data",
      "Gated Model",
    ],
    status: "active",
    pipeline: {
      task: "text-to-image",
      model: "briaai/FIBO",
      options: {
        num_inference_steps: 50,
        guidance_scale: 5,
      },
    },
    ui: {
      inputTypes: [],
      outputFormat: "png",
      maxFileSize: 0,
      acceptedFormats: [],
    },
    links: {
      huggingface: "https://huggingface.co/briaai/FIBO",
      github: "https://github.com/bria-ai/FIBO",
      documentation: "https://huggingface.co/briaai/FIBO",
      paper: "https://arxiv.org/abs/2511.06876",
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
