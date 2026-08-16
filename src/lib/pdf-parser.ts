import pdfParse from "pdf-parse";
import { ResumeData } from "@/types";

export async function parsePDF(buffer: Buffer, fileName: string): Promise<ResumeData> {
  const data = await pdfParse(buffer);
  return {
    id: crypto.randomUUID(),
    fileName,
    text: data.text,
    uploadedAt: new Date().toISOString(),
  };
}
