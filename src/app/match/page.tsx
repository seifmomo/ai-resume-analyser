"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";
import { ResumeData, MatchResult } from "@/types";

export default function MatchPage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async () => {
    if (!resume || !jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: resume.text, jobDescription }),
      });
      if (!res.ok) throw new Error("Matching failed");
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Matching failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Job Description Matching</h1>
      {!resume && <FileUpload onUpload={(r) => setResume(r)} />}
      {resume && !result && (
        <div className="space-y-6">
          <p className="text-sm text-gray-400">Resume: {resume.fileName}</p>
          <div>
            <label className="block text-sm font-medium mb-2">Paste Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none resize-none"
              placeholder="Paste the job description here..."
            />
          </div>
          <button
            onClick={handleMatch}
            disabled={!jobDescription.trim() || loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? "Matching..." : "Compare with Job"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      )}
      {result && (
        <div className="space-y-8">
          <div className="flex justify-center">
            <ScoreCard label="Match Score" score={result.matchScore} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <h3 className="font-semibold text-emerald-400 mb-3">Matching Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <h3 className="font-semibold text-red-400 mb-3">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-emerald-400 shrink-0">&rarr;</span> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold mb-3">Full Analysis</h3>
            <p className="text-sm text-gray-300 whitespace-pre-line">{result.fullAnalysis}</p>
          </div>

          <button
            onClick={() => { setResume(null); setResult(null); setJobDescription(""); }}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
