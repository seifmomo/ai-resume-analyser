import { NextRequest, NextResponse } from "next/server";
import { matchJobDescription, LLMError } from "@/lib/llm";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Both resume text and job description are required" },
        { status: 400 }
      );
    }

    const result = await matchJobDescription(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LLMError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("match failed:", error);
    return NextResponse.json({ error: "Failed to match resume" }, { status: 500 });
  }
}
