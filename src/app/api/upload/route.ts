import { NextRequest, NextResponse } from "next/server";
import { parsePDF } from "@/lib/pdf-parser";

export const maxDuration = 30;

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large — maximum size is 4MB" }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resume = await parsePDF(buffer, file.name);

    return NextResponse.json(resume);
  } catch (error) {
    console.error("upload failed:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
