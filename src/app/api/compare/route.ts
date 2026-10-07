import { NextRequest, NextResponse } from "next/server";
import { compareResumes, LLMError } from "@/lib/llm";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { resumes } = await request.json();

    if (!resumes || !Array.isArray(resumes) || resumes.length < 2) {
      return NextResponse.json(
        { error: "At least two resumes are required for comparison" },
        { status: 400 }
      );
    }

    const result = await compareResumes(resumes);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LLMError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("compare failed:", error);
    return NextResponse.json({ error: "Failed to compare resumes" }, { status: 500 });
  }
}
