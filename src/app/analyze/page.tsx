"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";
import { ResumeData, AnalysisResult } from "@/types";

export default function AnalyzePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (r: ResumeData) => {
    setResume(r);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: r.text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Analysis failed");
      }
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Resume Analysis</h1>
      {!resume && <FileUpload onUpload={handleAnalyze} />}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Analyzing your resume...</p>
        </div>
      )}
      {error && <p className="text-red-400 text-center py-10">{error}</p>}
      {result && resume && (
        <div className="space-y-8">
          <div className="text-center text-sm text-gray-500">
            Analyzed: {resume.fileName}
          </div>

          <div className="flex justify-center">
            <ScoreCard label="Overall" score={result.overallScore} size="lg" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(result.sections).map(([key, section]) => (
              <div key={key} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                <ScoreCard label={key} score={section.score} />
                <p className="mt-2 text-xs text-gray-400">{section.feedback}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <h3 className="font-semibold text-emerald-400 mb-3">Strengths</h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-emerald-400 shrink-0">+</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <h3 className="font-semibold text-yellow-400 mb-3">Improvements</h3>
              <ul className="space-y-2">
                {result.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-yellow-400 shrink-0">!</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold mb-3">Full Feedback</h3>
            <p className="text-sm text-gray-300 whitespace-pre-line">{result.fullFeedback}</p>
          </div>

          <button
            onClick={() => { setResume(null); setResult(null); }}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
          >
            Upload another resume
          </button>
        </div>
      )}
    </div>
  );
}
