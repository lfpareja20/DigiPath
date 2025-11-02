import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useResultContext } from '@/contexts/ResultContext';
import { apiService } from '@/services/api';
import { 
  Loader2, 
  ArrowLeft, 
  TrendingUp,
  Target,
  Lightbulb,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Results = () => {
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  const navigate = useNavigate();
  const { result, setResult, isLoading, setIsLoading } = useResultContext();
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      if (!diagnosisId) {
        navigate('/dashboard');
        return;
      }

      setIsLoading(true);
      setError(false);

      try {
        const data = await apiService.getDiagnosisResult(parseInt(diagnosisId));
        setResult(data);
      } catch (err) {
        console.error('Error loading results:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [diagnosisId, setResult, setIsLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Generando sus resultados...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No se pudieron cargar los resultados
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Maestro': return 'bg-accent text-accent-foreground';
      case 'Seguidor': return 'bg-primary text-primary-foreground';
      case 'Conservador': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'Maestro':
        return 'Su empresa lidera la transformación digital en su sector';
      case 'Seguidor':
        return 'Su empresa está adoptando activamente tecnologías digitales';
      case 'Conservador':
        return 'Su empresa está comenzando su camino hacia la digitalización';
      default:
        return 'Su empresa tiene grandes oportunidades de crecimiento digital';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Resultados de su Diagnóstico
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(result.fecha_diagnostico), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Nivel de Madurez Digital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${getLevelColor(result.nivel_madurez_predicho)} text-lg px-4 py-2`}>
                    {result.nivel_madurez_predicho}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-3">
                    {getLevelDescription(result.nivel_madurez_predicho)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Potencial de Avance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-accent">
                  {result.probabilidad_exito}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Probabilidad de avanzar al siguiente nivel implementando las recomendaciones
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analysis Section */}
        <Card className="shadow-xl mb-8">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Su Ruta de Éxito Personalizada</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Factores clave identificados mediante análisis de IA
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">
              Estos son los factores más importantes que definen su diagnóstico actual. 
              Enfocarse en las áreas de mejora tendrá el mayor impacto en su progreso digital.
            </p>
          </CardContent>
        </Card>

        {/* Improvement Areas */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-6 w-6 text-destructive" />
            <h2 className="text-2xl font-bold text-foreground">
              Áreas de Mejora Prioritarias
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Estos factores están limitando su avance. Mejorarlos generará el mayor retorno de inversión.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.drivers_principales.map((driver, index) => (
              <RecommendationCard
                key={index}
                data={driver}
                type="improvement"
              />
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">
              Fortalezas a Mantener
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Estas son sus ventajas competitivas. Manténgalas y profundícelas.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.fortalezas_principales.map((strength, index) => (
              <RecommendationCard
                key={index}
                data={strength}
                type="strength"
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">¿Qué sigue?</h3>
            <p className="text-muted-foreground mb-6">
              Realice un nuevo diagnóstico en 3 meses para medir su progreso
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => navigate('/questionnaire')}
              >
                Realizar Nuevo Diagnóstico
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Ver Historial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
