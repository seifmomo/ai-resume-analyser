export interface ResumeData {
  id: string;
  fileName: string;
  text: string;
  uploadedAt: string;
}

export interface AnalysisResult {
  resumeId: string;
  overallScore: number;
  sections: {
    contact: { score: number; feedback: string };
    summary: { score: number; feedback: string };
    experience: { score: number; feedback: string };
    education: { score: number; feedback: string };
    skills: { score: number; feedback: string };
    formatting: { score: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
  fullFeedback: string;
}

export interface MatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  fullAnalysis: string;
}

export interface ATSResult {
  atsScore: number;
  issues: { category: string; severity: "high" | "medium" | "low"; description: string }[];
  passes: { category: string; passed: boolean; details: string }[];
  recommendations: string[];
}

export interface ComparisonResult {
  resumes: { name: string; score: number; highlights: string[] }[];
  ranking: { name: string; overallScore: number; strengths: string[]; weaknesses: string[] }[];
  recommendation: string;
}
