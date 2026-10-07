import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { ResumeData } from "@/types";

export async function parsePDF(buffer: Buffer, fileName: string): Promise<ResumeData> {
  const bytes = new Uint8Array(buffer);
  const data = await pdfParse(bytes);
  return {
    id: crypto.randomUUID(),
    fileName,
    text: data.text,
    uploadedAt: new Date().toISOString(),
  };
}
