interface ScoreCardProps {
  label: string;
  score: number;
  size?: "sm" | "lg";
}

export default function ScoreCard({ label, score, size = "sm" }: ScoreCardProps) {
  const color =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-yellow-400" : "text-red-400";
  const dim = size === "lg" ? "text-5xl" : "text-3xl";

  return (
    <div className={`flex ${size === "lg" ? "flex-col items-center gap-2" : "items-center gap-3"}`}>
      <div className="relative">
        <svg className={`${size === "lg" ? "w-24 h-24" : "w-14 h-14"}`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-gray-800" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            className={color}
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 264} 264`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center ${dim} font-bold ${color}`}>
          {score}
        </span>
      </div>
      <span className={`${size === "lg" ? "text-sm" : "text-xs"} text-gray-400 uppercase tracking-wider`}>{label}</span>
    </div>
  );
}
