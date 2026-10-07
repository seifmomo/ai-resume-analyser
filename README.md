# AI Resume Analyser

AI-powered resume analysis tool built with Next.js, TypeScript, and Groq's free API (GPT-OSS 120B). Upload your PDF resume and get instant scoring, feedback, and improvement suggestions — 100% free to run.

## Features

- **Resume Analysis** — Detailed scoring and feedback on every section (contact, summary, experience, education, skills, formatting)
- **Job Description Matching** — Compare your resume against a job description to assess fit and identify skill gaps
- **ATS Compatibility Check** — Verify your resume passes Applicant Tracking Systems with actionable recommendations
- **Multi-Resume Comparison** — Upload multiple resumes and get AI-powered rankings with strengths and weaknesses

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** [Groq](https://console.groq.com) free tier (OpenAI-compatible API, `openai/gpt-oss-120b`)
- **PDF Parsing:** pdf-parse
- **File Upload:** react-dropzone

## Getting Started

### Prerequisites

- Node.js 18+
- A free Groq API key — create one at [console.groq.com/keys](https://console.groq.com/keys)

### Setup

```bash
git clone https://github.com/your-username/ai-resume-analyser.git
cd ai-resume-analyser
npm install
```

Create a `.env.local` file:

```
GROQ_API_KEY=gsk_your_key_here
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel (free)

1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) and deploy.
3. In the project's **Settings → Environment Variables**, add `GROQ_API_KEY`.
4. Redeploy.

Notes for the free tier:

- Uploads are limited to **4MB** (Vercel request body limit).
- Groq's free plan rate limits (30 req/min, 1,000 req/day per model) are handled gracefully — the app shows a "rate limited, retry shortly" message when hit.
- Set `GROQ_MODEL` in env vars to override the default model if needed.

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
├── lib/               # PDF parser, Groq LLM integration
└── types/             # TypeScript interfaces
```

## License

MIT
