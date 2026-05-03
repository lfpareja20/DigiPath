import { useEffect, useState } from "react";

interface CircularProgressProps {
  percentage: number;
  className?: string;
}

export const CircularProgress = ({ percentage, className }: CircularProgressProps) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // estado para la animación: inicia en el círculo vacío (completo)
  const [animatedOffset, setAnimatedOffset] = useState<number>(circumference);

  useEffect(() => {
    // animar en el siguiente frame para que la transición funcione al montar
    const raf = requestAnimationFrame(() => {
      setAnimatedOffset(offset);
    });

    return () => cancelAnimationFrame(raf);
  }, [offset, circumference]);

  // Lógica de color dinámico
  let colorClass = "text-red-500";
  if (percentage >= 100) colorClass = "text-emerald-500";
  else if (percentage >= 50) colorClass = "text-amber-500";
  else if (percentage >= 25) colorClass = "text-orange-500";

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        className="w-full h-full transform -rotate-90 drop-shadow-sm"
        viewBox="0 0 120 120"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="8"
          className="text-slate-100"
          fill="transparent"
          stroke="currentColor"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="8"
          className={colorClass}
          fill="transparent"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s ease-in-out, color 0.5s ease",
          }}
        />
      </svg>
      <span
        className={`absolute font-black ${percentage === 100 ? "text-xl" : "text-2xl"} ${colorClass}`}
      >
        {Math.round(percentage)}%
      </span>
    </div>
  );
};