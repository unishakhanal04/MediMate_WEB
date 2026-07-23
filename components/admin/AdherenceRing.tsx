const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface AdherenceRingProps {
  percent: number;
}

export function AdherenceRing({ percent }: AdherenceRingProps) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <svg width="104" height="104" viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="9" className="stroke-gray-100 dark:stroke-gray-800" />
      <circle
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        className="stroke-blue-700 transition-[stroke-dashoffset] duration-500 dark:stroke-blue-400"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90 fill-gray-900 text-[20px] font-extrabold dark:fill-white"
        style={{ transformOrigin: "50px 50px" }}
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}
