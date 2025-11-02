import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground">Progreso del Diagnóstico</span>
        <span className="text-muted-foreground">
          Pregunta {current + 1} de {total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};
