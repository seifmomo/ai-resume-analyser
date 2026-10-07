import OpenAI, { APIError } from "openai";
import {
  AnalysisResult,
  MatchResult,
  ATSResult,
  ComparisonResult,
} from "@/types";

const BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "openai/gpt-oss-120b";

export class LLMError extends Error {
  status: number;

  constructor(message: string, status = 503) {
    super(message);
    this.name = "LLMError";
    this.status = status;
  }
}

function getClient(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new LLMError(
      "GROQ_API_KEY is not configured — get a free key at console.groq.com/keys",
      503
    );
  }
  return new OpenAI({ apiKey, baseURL: BASE_URL });
}

function getRetryAfterMs(error: APIError): number | null {
  const headers = error.headers as unknown;
  let value: string | null = null;

  if (headers && typeof (headers as Headers).get === "function") {
    value = (headers as Headers).get("retry-after");
  } else if (headers && typeof headers === "object") {
    const raw = (headers as Record<string, unknown>)["retry-after"];
    if (typeof raw === "string") value = raw;
  }

  if (!value) return null;
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  return Math.min(seconds, 15) * 1000;
}

async function callLLM(prompt: string): Promise<string> {
  const client = getClient();
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  const run = async (): Promise<string> => {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    });
    return response.choices[0].message.content || "";
  };

  try {
    return await run();
  } catch (error) {
    if (error instanceof APIError && error.status === 429) {
      const delay = getRetryAfterMs(error) ?? 3000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      try {
        return await run();
      } catch (retryError) {
        if (retryError instanceof APIError && retryError.status === 429) {
          throw new LLMError(
            "The AI service is rate limited — please retry in a moment",
            429
          );
        }
        throw retryError;
      }
    }
    if (error instanceof APIError) {
      throw new LLMError(
        `AI service error (${error.status ?? "unknown"}) — please retry`,
        502
      );
    }
    throw error;
  }
}

function parseJSON<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
  try {
    return JSON.parse(jsonStr.trim()) as T;
  } catch {
    throw new LLMError("The AI returned an unexpected format — please retry", 502);
  }
}

export async function analyzeResume(resumeText: string): Promise<AnalysisResult> {
  const prompt = `Analyze this resume thoroughly and provide a detailed JSON assessment.

Resume:
${resumeText}

Return ONLY valid JSON with this exact structure:
{
  "resumeId": "analysis",
  "overallScore": <number 0-100>,
  "sections": {
    "contact": { "score": <0-100>, "feedback": "<detailed feedback>" },
    "summary": { "score": <0-100>, "feedback": "<detailed feedback>" },
    "experience": { "score": <0-100>, "feedback": "<detailed feedback>" },
    "education": { "score": <0-100>, "feedback": "<detailed feedback>" },
    "skills": { "score": <0-100>, "feedback": "<detailed feedback>" },
    "formatting": { "score": <0-100>, "feedback": "<detailed feedback>" }
  },
  "strengths": ["<strength1>", "<strength2>", ...],
  "improvements": ["<improvement1>", "<improvement2>", ...],
  "fullFeedback": "<comprehensive narrative feedback>"
}`;

  const response = await callLLM(prompt);
  return parseJSON<AnalysisResult>(response);
}

export async function matchJobDescription(
  resumeText: string,
  jobDescription: string
): Promise<MatchResult> {
  const prompt = `Compare this resume against the job description and assess how well they match.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON with this exact structure:
{
  "matchScore": <number 0-100>,
  "matchingSkills": ["<skill1>", "<skill2>", ...],
  "missingSkills": ["<skill1>", "<skill2>", ...],
  "recommendations": ["<recommendation1>", "<recommendation2>", ...],
  "fullAnalysis": "<detailed narrative analysis of the match>"
}`;

  const response = await callLLM(prompt);
  return parseJSON<MatchResult>(response);
}

export async function checkATSCompatibility(
  resumeText: string
): Promise<ATSResult> {
  const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility.

Resume:
${resumeText}

Return ONLY valid JSON with this exact structure:
{
  "atsScore": <number 0-100>,
  "issues": [
    { "category": "<category>", "severity": "<high|medium|low>", "description": "<description>" }
  ],
  "passes": [
    { "category": "<category>", "passed": <true|false>, "details": "<details>" }
  ],
  "recommendations": ["<recommendation1>", "<recommendation2>", ...]
}`;

  const response = await callLLM(prompt);
  return parseJSON<ATSResult>(response);
}

export async function compareResumes(
  resumes: { name: string; text: string }[]
): Promise<ComparisonResult> {
  const resumeTexts = resumes
    .map((r, i) => `--- RESUME ${i + 1}: ${r.name} ---\n${r.text}`)
    .join("\n\n");

  const prompt = `Compare these resumes and rank them.

${resumeTexts}

Return ONLY valid JSON with this exact structure:
{
  "resumes": [
    { "name": "<name>", "score": <0-100>, "highlights": ["<highlight1>", ...] }
  ],
  "ranking": [
    { "name": "<name>", "overallScore": <0-100>, "strengths": ["<strength1>", ...], "weaknesses": ["<weakness1>", ...] }
  ],
  "recommendation": "<overall recommendation comparing the resumes>"
}`;

  const response = await callLLM(prompt);
  return parseJSON<ComparisonResult>(response);
}
