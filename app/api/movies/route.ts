import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const folderId = process.env.DRIVE_FOLDER_ID;

  if (!apiKey || !folderId) {
    return NextResponse.json(
      { error: "Server config missing. Vercel এ GOOGLE_API_KEY ও DRIVE_FOLDER_ID env variable সেট করো।" },
      { status: 500 }
    );
  }

  const url =
    `https://www.googleapis.com/drive/v3/files` +
    `?q='${folderId}'+in+parents+and+mimeType+contains+'video/'` +
    `&key=${apiKey}` +
    `&fields=files(id,name,thumbnailLink)` +
    `&pageSize=100`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ files: data.files || [] });
  } catch {
    return NextResponse.json({ error: "Google Drive API fetch failed" }, { status: 500 });
  }
}
