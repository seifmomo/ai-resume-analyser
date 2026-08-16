import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    const result = await analyzeResume(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
