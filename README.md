# AI Resume Analyser

AI-powered resume analysis tool built with Next.js, TypeScript, and OpenAI's GPT-4o. Upload your PDF resume and get instant scoring, feedback, and improvement suggestions.

## Features

- **Resume Analysis** — Detailed scoring and feedback on every section (contact, summary, experience, education, skills, formatting)
- **Job Description Matching** — Compare your resume against a job description to assess fit and identify skill gaps
- **ATS Compatibility Check** — Verify your resume passes Applicant Tracking Systems with actionable recommendations
- **Multi-Resume Comparison** — Upload multiple resumes and get AI-powered rankings with strengths and weaknesses

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** OpenAI GPT-4o API
- **PDF Parsing:** pdf-parse
- **File Upload:** react-dropzone

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Setup

```bash
git clone https://github.com/your-username/ai-resume-analyser.git
cd ai-resume-analyser
npm install
```

Create a `.env.local` file:

```
OPENAI_API_KEY=sk-your-key-here
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (upload, analyze, match, ats, compare)
│   ├── analyze/       # Resume analysis page
│   ├── match/         # Job matching page
│   ├── ats/           # ATS compatibility page
│   └── compare/       # Multi-resume comparison page
├── components/        # FileUpload, ScoreCard
├── lib/               # PDF parser, OpenAI integration
└── types/             # TypeScript interfaces
```

## License

MIT
