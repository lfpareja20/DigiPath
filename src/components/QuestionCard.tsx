import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: string;
  domain: string;
  questionNumber: number;
}

export const QuestionCard = ({
  question,
  domain,
  questionNumber,
}: QuestionCardProps) => (
  <Card className="shadow-lg border-2">
    <CardContent className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary" className="text-sm">
          {domain}
        </Badge>
        <span className="text-sm font-medium text-muted-foreground">
          Pregunta #{questionNumber}
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-foreground">
        {question}
      </h2>
      <p className="text-muted-foreground mt-2">
        Seleccione la opción que mejor describe la situación actual de su empresa
      </p>
    </CardContent>
  </Card>
);