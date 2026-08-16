import OpenAI from "openai";
import {
  AnalysisResult,
  MatchResult,
  ATSResult,
  ComparisonResult,
} from "@/types";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function callOpenAI(prompt: string): Promise<string> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });
  return response.choices[0].message.content || "";
}

function parseJSON<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
  return JSON.parse(jsonStr.trim()) as T;
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

  const response = await callOpenAI(prompt);
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

  const response = await callOpenAI(prompt);
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

  const response = await callOpenAI(prompt);
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

  const response = await callOpenAI(prompt);
  return parseJSON<ComparisonResult>(response);
}
