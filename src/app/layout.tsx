import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Analyser",
  description: "Get AI-powered analysis, scoring, and feedback on your resume",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg text-emerald-400">
              ResumeAI
            </Link>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link href="/analyze" className="hover:text-gray-100 transition-colors">Analyze</Link>
              <Link href="/match" className="hover:text-gray-100 transition-colors">Match</Link>
              <Link href="/ats" className="hover:text-gray-100 transition-colors">ATS Check</Link>
              <Link href="/compare" className="hover:text-gray-100 transition-colors">Compare</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
