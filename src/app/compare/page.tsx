"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";
import { ResumeData, ComparisonResult } from "@/types";

export default function ComparePage() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (resumes.length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumes: resumes.map((r) => ({ name: r.fileName, text: r.text })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Comparison failed");
      }
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Resume Comparison</h1>

      {resumes.length === 0 && (
        <FileUpload
          onUpload={() => {}}
          multiple
          onMultipleUpload={(r) => setResumes(r)}
        />
      )}

      {resumes.length > 0 && !result && (
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">{resumes.length} resumes uploaded:</p>
            <ul className="list-disc list-inside text-sm text-gray-300">
              {resumes.map((r) => (
                <li key={r.id}>{r.fileName}</li>
              ))}
            </ul>
          </div>

          {resumes.length < 2 && (
            <p className="text-yellow-400 text-sm">Upload at least 2 resumes to compare</p>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleCompare}
              disabled={resumes.length < 2 || loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? "Comparing..." : "Compare Resumes"}
            </button>
            <button
              onClick={() => setResumes([])}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Start Over
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <div className="flex justify-center gap-10">
            {result.resumes.map((r, i) => (
              <ScoreCard key={i} label={r.name} score={r.score} size="lg" />
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold mb-4">Rankings</h3>
            <div className="space-y-4">
              {result.ranking.map((r, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-emerald-400">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-sm text-gray-500">Score: {r.overallScore}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-emerald-400 font-medium">Strengths:</span>
                        <ul className="mt-1 space-y-1 text-gray-400">
                          {r.strengths.map((s, j) => (
                            <li key={j}>+ {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-yellow-400 font-medium">Weaknesses:</span>
                        <ul className="mt-1 space-y-1 text-gray-400">
                          {r.weaknesses.map((w, j) => (
                            <li key={j}>- {w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold mb-3">Recommendation</h3>
            <p className="text-sm text-gray-300 whitespace-pre-line">{result.recommendation}</p>
          </div>

          <button
            onClick={() => { setResumes([]); setResult(null); }}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
