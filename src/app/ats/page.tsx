"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";
import { ResumeData, ATSResult } from "@/types";

export default function ATSPage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (r: ResumeData) => {
    setResume(r);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: r.text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "ATS check failed");
      }
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "ATS check failed");
    } finally {
      setLoading(false);
    }
  };

  const severityColor = { high: "text-red-400 bg-red-500/10", medium: "text-yellow-400 bg-yellow-500/10", low: "text-blue-400 bg-blue-500/10" };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">ATS Compatibility Check</h1>
      {!resume && <FileUpload onUpload={handleCheck} />}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Checking ATS compatibility...</p>
        </div>
      )}
      {error && <p className="text-red-400 text-center py-10">{error}</p>}
      {result && (
        <div className="space-y-8">
          <div className="flex justify-center">
            <ScoreCard label="ATS Score" score={result.atsScore} size="lg" />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h3 className="font-semibold mb-3">Compatibility Checks</h3>
            <div className="space-y-2">
              {result.passes.map((p, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className={p.passed ? "text-emerald-400" : "text-red-400"}>
                    {p.passed ? "PASS" : "FAIL"}
                  </span>
                  <span className="font-medium">{p.category}</span>
                  <span className="text-gray-500">— {p.details}</span>
                </div>
              ))}
            </div>
          </div>

          {result.issues.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <h3 className="font-semibold mb-3">Issues Found</h3>
              <div className="space-y-3">
                {result.issues.map((issue, i) => (
                  <div key={i} className={`p-3 rounded-lg ${severityColor[issue.severity]}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase">{issue.severity}</span>
                      <span className="text-sm font-medium">{issue.category}</span>
                    </div>
                    <p className="text-xs text-gray-300">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <button
            onClick={() => { setResume(null); setResult(null); }}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
          >
            Check another resume
          </button>
        </div>
      )}
    </div>
  );
}
