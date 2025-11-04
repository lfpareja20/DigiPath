import React, { useEffect, useState } from "react";

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

  return (
    <div className={`relative flex items-center justify-center ${className ?? ""}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120" aria-hidden>
        {/* Círculo de fondo */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          stroke="currentColor"
          className="text-gray-200"
          fill="transparent"
        />
        {/* Círculo de progreso (animado) */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          stroke="currentColor"
          className="text-green-500"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <span className="absolute text-2xl font-bold text-green-600">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};