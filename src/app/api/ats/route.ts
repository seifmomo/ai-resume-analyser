import { NextRequest, NextResponse } from "next/server";
import { checkATSCompatibility, LLMError } from "@/lib/llm";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    const result = await checkATSCompatibility(text);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LLMError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("ats failed:", error);
    return NextResponse.json({ error: "Failed to check ATS compatibility" }, { status: 500 });
  }
}
