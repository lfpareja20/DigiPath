import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface AnswerOptionsProps {
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

const options = [
  { value: 1, label: 'Nunca', description: 'No implementado' },
  { value: 2, label: 'Reactivo', description: 'Solo cuando es necesario' },
  { value: 3, label: 'En desarrollo', description: 'En proceso de implementación' },
  { value: 4, label: 'Activo', description: 'Implementado y en uso regular' },
  { value: 5, label: 'Optimizado', description: 'Completamente integrado y optimizado' },
];

export const AnswerOptions = ({ selectedValue, onSelect }: AnswerOptionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border bg-card hover:border-primary/50'
            }`}
            aria-pressed={isSelected}
          >
            {isSelected && (
              <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
            )}
            <div className="space-y-1">
              <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {option.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {option.description}
              </div>
              <div className={`text-xs font-medium mt-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                Valor: {option.value}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
