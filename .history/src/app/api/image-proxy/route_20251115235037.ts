import { NextResponse } from "next/server";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

async function handleImageProxy(url: string | null) {
  if (!url || typeof url !== "string" || !url.trim()) {
    return NextResponse.json(
      { success: false, error: "Image URL is required." },
      { status: 400 }
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid image URL." },
      { status: 400 }
    );
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json(
      { success: false, error: "Only HTTP(S) URLs are supported." },
      { status: 400 }
    );
  }

  try {
    const upstreamResponse = await fetch(parsedUrl, {
      headers: { Accept: "image/*" },
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Unable to fetch the remote image." },
        { status: upstreamResponse.status }
      );
    }

    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "The provided URL does not point to an image." },
        { status: 400 }
      );
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Image exceeds the 10MB limit." },
        { status: 413 }
      );
    }

    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ success: true, dataUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected proxy error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  return handleImageProxy(url);
}

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url?: string };
    return handleImageProxy(url ?? null);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
