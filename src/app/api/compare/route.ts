import { NextRequest, NextResponse } from "next/server";
import { compareResumes } from "@/lib/openai";

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
  } catch {
    return NextResponse.json({ error: "Failed to compare resumes" }, { status: 500 });
  }
}
