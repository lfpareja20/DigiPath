import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface QuestionCardProps {
  question: string;
  domain: string;
  questionNumber: number;
}

export const QuestionCard = ({ question, domain, questionNumber }: QuestionCardProps) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {domain}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Pregunta #{questionNumber}
          </span>
        </div>
        <CardTitle className="text-xl md:text-2xl font-semibold leading-relaxed">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Seleccione la opción que mejor describe la situación actual de su empresa
        </p>
      </CardContent>
    </Card>
  );
};
