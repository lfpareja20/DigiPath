import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { IShapValue } from '@/contexts/ResultContext';

interface RecommendationCardProps {
  data: IShapValue;
  type: 'improvement' | 'strength';
}

export const RecommendationCard = ({ data, type }: RecommendationCardProps) => {
  const isImprovement = type === 'improvement';
  const Icon = isImprovement ? TrendingDown : TrendingUp;
  const impactColor = isImprovement ? 'text-destructive' : 'text-accent';
  const badgeVariant = isImprovement ? 'destructive' : 'default';

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Icon className={`h-5 w-5 ${impactColor}`} />
            {data.pregunta}
          </CardTitle>
          <Badge variant={badgeVariant as any} className="ml-2">
            {Math.abs(data.impacto * 100).toFixed(0)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            {isImprovement ? '¿Por qué es una oportunidad?' : '¿Por qué es una fortaleza?'}
          </h4>
          <p className="text-sm text-foreground">{data.explicacion}</p>
        </div>
        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium text-primary mb-1">
            💡 Recomendación
          </h4>
          <p className="text-sm text-foreground font-medium">{data.recomendacion}</p>
        </div>
      </CardContent>
    </Card>
  );
};
