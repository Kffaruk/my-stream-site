import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!id || !apiKey) {
    return new NextResponse("Missing id or API key", { status: 400 });
  }

  const range = req.headers.get("range") || "";
  const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${apiKey}`;

  const upstream = await fetch(driveUrl, {
    headers: range ? { range } : {},
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new NextResponse("Failed to fetch video", { status: upstream.status });
  }

  const headers = new Headers();
  ["content-type", "content-length", "content-range", "accept-ranges"].forEach((h) => {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  });
  headers.set("cache-control", "private, max-age=3600");

  return new NextResponse(upstream.body, { status: upstream.status, headers });
}