import Link from "next/link";

export default function Home() {
  const features = [
    { title: "Resume Analysis", description: "Get detailed scoring and feedback on every section of your resume", href: "/analyze", icon: "AI" },
    { title: "Job Matching", description: "Compare your resume against a job description to see your fit", href: "/match", icon: "JM" },
    { title: "ATS Compatibility", description: "Check if your resume passes Applicant Tracking Systems", href: "/ats", icon: "AT" },
    { title: "Resume Comparison", description: "Compare multiple resumes side by side with AI ranking", href: "/compare", icon: "CR" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          AI Resume Analyser
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Upload your resume and get instant AI-powered feedback, scoring, and improvement suggestions
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="group block p-6 rounded-xl border border-gray-800 bg-gray-900 hover:border-emerald-500/50 transition-all">
            <div className="text-2xl font-bold text-emerald-400 mb-2">{f.icon}</div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">{f.title}</h2>
            <p className="text-gray-400">{f.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
