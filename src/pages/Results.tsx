import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as diagnosisService from "@/services/diagnosisService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FactorImpacto } from "@/types";
import { CircularProgress } from "@/components/customs/CircularProgress";
import { BarChart, ArrowUpCircle, TrendingDown, TrendingUp, Lightbulb } from "lucide-react";
import { InfoPopover } from "@/components/customs/InfoPopover";

// Registramos los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- COMPONENTES INTERNOS PARA EL REPORTE ---

// Componente para mostrar las tarjetas de drivers (Fortalezas y Debilidades)
const ImpactFactorCard = ({ factor, type }: { factor: FactorImpacto, type: 'DEBILIDAD' | 'FORTALEZA' }) => {
    const isDebilidad = type === 'DEBILIDAD';
    const accentColor = isDebilidad ? 'text-destructive' : 'text-success';
    const bgColor = isDebilidad ? 'bg-destructive/10' : 'bg-success/10';
    const ringColor = isDebilidad ? 'ring-destructive/20' : 'ring-success/20';
    const Icon = isDebilidad ? TrendingDown : TrendingUp;

    const CardContentLayout = () => (
        <Card className={`shadow-sm hover:shadow-lg hover:ring-2 ${ringColor} transition-all duration-300 cursor-pointer`}>
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${accentColor}`} />
                        <CardTitle className="text-base font-semibold">{factor.titulo}</CardTitle>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${bgColor} ${accentColor} ring-1 ${ringColor}`}>
                        {factor.peso_impacto.toFixed(0)}% DE IMPACTO
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-12">
                <p className="text-sm text-muted-foreground">{factor.porque}</p>
            </CardContent>
        </Card>
    );

    // Si es una debilidad, envolvemos la tarjeta en un Dialog para mostrar la acción
    if (isDebilidad) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {/* El contenido visible de la tarjeta es el trigger del pop-up */}
                    <div><CardContentLayout /></div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                           <Lightbulb className="h-5 w-5 text-yellow-500" />
                           Acción Recomendada
                        </DialogTitle>
                        <DialogDescription>
                           Para mejorar en: <span className="font-semibold text-foreground">{factor.titulo}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <h4 className="font-semibold mb-2">Problema Identificado:</h4>
                        <p className="text-muted-foreground mb-4">{factor.porque}</p>
                        
                        <h4 className="font-semibold mb-2">Próximo Paso Sugerido:</h4>
                        <p className="text-foreground bg-primary/10 p-4 rounded-md border border-primary/20">
                           {factor.accion}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Si es una fortaleza, solo mostramos la tarjeta (no es clicable, no hay acción)
    return <CardContentLayout />;
};

const Results = () => {
  const { diagnosisId } = useParams<{ diagnosisId: string }>();
  const navigate = useNavigate();

  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["diagnosisReport", diagnosisId],
    queryFn: () => diagnosisService.getDiagnosisReport(Number(diagnosisId)),
    enabled: !!diagnosisId, // Solo ejecuta la consulta si diagnosisId existe
  });

  // --- RENDERIZADO CONDICIONAL ---
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error al cargar el reporte.
      </div>
    );
  }

   const domainLabels = Object.keys(report.desglose_dominios);
    const domainScores = Object.values(report.desglose_dominios);

    // 2. Lógica para el color dinámico de las barras
    const barColors = domainScores.map(score => {
        if (score < 3) return 'rgba(239, 68, 68, 0.6)';   // Rojo (Destructive)
        if (score < 5) return 'rgba(245, 158, 11, 0.6)';  // Amarillo (Warning)
        return 'rgba(34, 197, 94, 0.6)';                 // Verde (Success)
    });
    const borderColors = domainScores.map(score => {
        if (score < 3) return 'rgba(239, 68, 68, 1)';
        if (score < 5) return 'rgba(245, 158, 11, 1)';
        return 'rgba(34, 197, 94, 1)';
    });

    const domainChartData = {
        labels: domainLabels,
        datasets: [{
            label: 'Puntaje por Dominio',
            data: domainScores,
            backgroundColor: barColors,
            borderColor: borderColors,
            borderWidth: 1,
        }],
    };

    const domainChartOptions = {
        indexAxis: 'y' as const, // <-- La clave para hacerlo horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Ocultamos la leyenda, los colores son auto-explicativos
            },
            tooltip: {
                // Mantenemos y mejoramos el tooltip
                callbacks: {
                    label: function(context: any) {
                        return `Puntaje: ${context.raw.toFixed(2)} de 7`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 7, // Mantenemos la escala consistente de 0 a 7
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)', // Hacemos la grilla más sutil
                }
            },
            y: {
                grid: {
                    display: false, // Quitamos la grilla vertical para un look más limpio
                }
            }
        },
    };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Button variant="outline" asChild className="mb-4">
        <Link to="/dashboard">&larr; Volver al Dashboard</Link>
      </Button>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabecera del Reporte */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800">
            Resultados de su Diagnóstico
          </h1>
          <p className="text-gray-500">
            Realizado el{" "}
            {new Date(report.fecha_diagnostico).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        {/* Resumen Ejecutivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Nivel de Madurez */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Nivel de Madurez Digital
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {report.nivel_madurez_predicho}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <span>Basado en su desempeño actual.</span>
                <InfoPopover
                  title="¿Cómo se determina este nivel?"
                  content={
                    <p>
                      Su nivel se calcula mediante un modelo de IA que analiza
                      sus 20 respuestas, comparándolas con patrones
                      identificados en el sector para clasificar su perfil en
                      una de las cuatro etapas de madurez digital.
                    </p>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Card Potencial de Avance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Potencial de Avance
              </CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CircularProgress
                percentage={report.potencial_avance}
                className="w-24 h-24 mx-auto my-2"
              />
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
                <span>Probabilidad de avanzar al siguiente nivel.</span>
                <InfoPopover
                  title="¿Qué significa este porcentaje?"
                  content={
                    <p>
                      Representa la confianza del modelo de IA en que, dadas sus
                      respuestas actuales, su empresa podría ser clasificada en
                      el siguiente nivel de madurez. Un porcentaje alto indica
                      que está muy cerca de dar el salto.
                    </p>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Desglose por Dominios */}
        <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <BarChart className="h-5 w-5 text-muted-foreground"/>
                <CardTitle>Desglose de Rendimiento por Dominio</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground pt-1">
                Su puntaje promedio (escala 1-7) en cada una de las 7 áreas clave de la madurez digital.
            </p>
        </CardHeader>
        <CardContent>
            {/* Damos una altura fija al contenedor para un mejor layout */}
            <div style={{ height: '400px' }}>
                <Bar data={domainChartData} options={domainChartOptions} />
            </div>
        </CardContent>
    </Card>

        {/* Áreas de Mejora Prioritarias (Debilidades) */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Áreas de Mejora Prioritarias
          </h2>
          <div className="space-y-4">
            {report.areas_mejora_prioritarias.map((factor) => (
              <ImpactFactorCard
                key={factor.pregunta_id}
                factor={factor}
                type="DEBILIDAD"
              />
            ))}
          </div>
        </div>

        {/* Fortalezas a Mantener */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Fortalezas a Mantener</h2>
          <div className="space-y-4">
            {report.fortalezas_a_mantener.map((factor) => (
              <ImpactFactorCard
                key={factor.pregunta_id}
                factor={factor}
                type="FORTALEZA"
              />
            ))}
          </div>
        </div>
        {/* Call to Action Final */}
            <div className="text-center p-8 bg-card border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">¿Qué sigue?</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Ha completado su diagnóstico. Aplique las recomendaciones y realice una nueva evaluación en 3 meses para medir su progreso y descubrir nuevas oportunidades.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild>
                        <Link to="/questionnaire">Realizar Nuevo Diagnóstico</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/dashboard">Ver Historial</Link>
                    </Button>
                </div>
            </div>
      </div>
    </div>
  );
};

export default Results;
