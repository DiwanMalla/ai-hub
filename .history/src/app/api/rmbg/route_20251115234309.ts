import { NextResponse } from "next/server";

const HUGGING_FACE_ENDPOINT =
  "https://api-inference.huggingface.co/models/briaai/RMBG-1.4";

export async function POST(request: Request) {
  try {
    const { imageUrl, hfToken } = (await request.json()) as {
      imageUrl?: string;
      hfToken?: string;
    };

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required." },
        { status: 400 }
      );
    }

    const token = hfToken?.trim() || process.env.HUGGINGFACE_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Missing Hugging Face token. Pass it in the request or configure HUGGINGFACE_API_TOKEN.",
        },
        { status: 400 }
      );
    }

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return NextResponse.json(
        {
          error:
            "Unable to fetch the source image. Check the URL and CORS settings.",
        },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const hfResponse = await fetch(HUGGING_FACE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          imageResponse.headers.get("content-type") ?? "image/png",
        "x-use-cache": "false",
      },
      body: imageBuffer,
    });

    if (!hfResponse.ok) {
      const errorPayload = await hfResponse.text();
      return NextResponse.json(
        {
          error:
            "Hugging Face inference failed. Confirm the token has access to briaai/RMBG-1.4.",
          details: errorPayload,
        },
        { status: hfResponse.status }
      );
    }

    const resultBuffer = Buffer.from(await hfResponse.arrayBuffer());
    const imageBase64 = `data:image/png;base64,${resultBuffer.toString(
      "base64"
    )}`;

    return NextResponse.json({ imageBase64 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unexpected server error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
