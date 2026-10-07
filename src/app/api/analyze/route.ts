import { NextRequest, NextResponse } from "next/server";
import { analyzeResume, LLMError } from "@/lib/llm";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    const result = await analyzeResume(text);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LLMError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("analyze failed:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
