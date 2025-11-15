import { NextResponse } from "next/server";

const HUGGING_FACE_FIBO_ENDPOINT =
  "https://router.huggingface.co/hf-inference/models/briaai/FIBO";

type GenerationMode = "generate" | "refine" | "inspire";

interface FiboRequest {
  mode: GenerationMode;
  prompt: string;
  jsonPrompt?: string;
  image?: string;
  hfToken?: string;
}

export async function POST(request: Request) {
  try {
    const { mode, prompt, jsonPrompt, image, hfToken } =
      (await request.json()) as FiboRequest;

    // Validate request
    if (!mode || !["generate", "refine", "inspire"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Must be 'generate', 'refine', or 'inspire'." },
        { status: 400 }
      );
    }

    if (mode === "inspire" && !image) {
      return NextResponse.json(
        { error: "Image is required for Inspire mode." },
        { status: 400 }
      );
    }

    // Get API token
    const token = hfToken?.trim() || process.env.HUGGINGFACE_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Missing Hugging Face token. Set HUGGINGFACE_API_TOKEN in your environment or pass it in the request.",
        },
        { status: 400 }
      );
    }

    // Build the request payload based on mode
    let payload: Record<string, unknown>;

    switch (mode) {
      case "generate":
        // FIBO uses a different API format - it expects a JSON prompt structure
        payload = {
          inputs: {
            prompt: prompt,
            mode: "generate",
          },
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 5,
          },
        };
        break;

      case "refine":
        payload = {
          inputs: {
            prompt: prompt,
            json_prompt: jsonPrompt || undefined,
            mode: "refine",
          },
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 5,
          },
        };
        break;

      case "inspire":
        // For inspire mode, we need to send the image data
        payload = {
          inputs: {
            prompt: prompt || "",
            image: image,
            mode: "inspire",
          },
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 5,
          },
        };
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported mode" },
          { status: 400 }
        );
    }

    // Call Hugging Face Inference API
    const hfResponse = await fetch(HUGGING_FACE_FIBO_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-use-cache": "false",
      },
      body: JSON.stringify(payload),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("Hugging Face API error:", errorText);
      console.error("Status:", hfResponse.status);
      console.error(
        "Headers:",
        Object.fromEntries(hfResponse.headers.entries())
      );

      // Check for common errors
      if (hfResponse.status === 401 || hfResponse.status === 403) {
        return NextResponse.json(
          {
            error:
              "Authentication failed. Verify your Hugging Face token has access to briaai/FIBO (gated model). You may need to request access on the model page.",
            details: errorText,
          },
          { status: hfResponse.status }
        );
      }

      if (hfResponse.status === 503) {
        return NextResponse.json(
          {
            error:
              "Model is loading or temporarily unavailable. Please wait a few moments and try again.",
            details: errorText,
          },
          { status: 503 }
        );
      }

      if (hfResponse.status === 400) {
        return NextResponse.json(
          {
            error:
              "Bad request. FIBO may not be available through the standard inference API.",
            details: errorText,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: "FIBO inference failed.",
          details: errorText,
          status: hfResponse.status,
        },
        { status: hfResponse.status }
      );
    }

    // Handle the response
    const contentType = hfResponse.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      // Response might include JSON with image data and structured prompt
      const jsonResponse = await hfResponse.json();

      // Check if response contains image data
      if (jsonResponse.image || jsonResponse[0]?.image) {
        const imageData = jsonResponse.image || jsonResponse[0].image;
        const structuredPrompt =
          jsonResponse.json_prompt || jsonResponse[0]?.json_prompt;

        return NextResponse.json({
          imageBase64: imageData.startsWith("data:")
            ? imageData
            : `data:image/png;base64,${imageData}`,
          jsonPrompt: structuredPrompt
            ? JSON.stringify(structuredPrompt)
            : undefined,
        });
      }

      return NextResponse.json(
        {
          error: "Unexpected response format from Hugging Face API.",
          details: JSON.stringify(jsonResponse),
        },
        { status: 500 }
      );
    }

    // Response is binary image data
    const imageBuffer = Buffer.from(await hfResponse.arrayBuffer());
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString(
      "base64"
    )}`;

    return NextResponse.json({
      imageBase64,
      jsonPrompt: undefined, // Binary response doesn't include structured prompt
    });
  } catch (error) {
    console.error("FIBO API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected server error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
