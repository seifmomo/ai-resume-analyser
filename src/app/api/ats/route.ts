import { NextRequest, NextResponse } from "next/server";
import { checkATSCompatibility } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    const result = await checkATSCompatibility(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to check ATS compatibility" }, { status: 500 });
  }
}
