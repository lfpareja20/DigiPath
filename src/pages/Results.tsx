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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FactorImpacto } from "@/types";
import { CircularProgress } from "@/components/customs/CircularProgress";

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
const ImpactFactorCard = ({
  factor,
  type,
}: {
  factor: FactorImpacto;
  type: "DEBILIDAD" | "FORTALEZA";
}) => {
  const borderColorClass =
    type === "DEBILIDAD" ? "border-red-500" : "border-green-500";
  const textColorClass =
    type === "DEBILIDAD" ? "text-red-500" : "text-green-500";

  return (
    <Card className={`border-l-4 ${borderColorClass}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className={`text-lg ${textColorClass}`}>
            {factor.titulo}
          </CardTitle>
          <span
            className={`text-sm font-bold px-2 py-1 rounded-md bg-opacity-20 ${
              type === "DEBILIDAD"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {factor.peso_impacto.toFixed(0)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold text-sm mb-1">
            ¿Por qué es una {type === "DEBILIDAD" ? "oportunidad" : "fortaleza"}
            ?
          </p>
          <p className="text-gray-600">{factor.porque}</p>
        </div>
        {factor.accion && (
          <div>
            <p className="font-semibold text-sm mb-1">Recomendación:</p>
            <p className="text-gray-600">{factor.accion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
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

  // --- PREPARACIÓN DE DATOS PARA LOS GRÁFICOS ---
  const domainChartData = {
    labels: Object.keys(report.desglose_dominios),
    datasets: [
      {
        label: "Puntaje por Dominio (escala 1-7)",
        data: Object.values(report.desglose_dominios),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
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
          <Card>
            <CardHeader>
              <CardTitle>Nivel de Madurez Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {report.nivel_madurez_predicho}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Potencial de Avance</CardTitle>
              <p className="text-sm text-gray-500 pt-1">
                Probabilidad de avanzar al siguiente nivel.
              </p>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <CircularProgress
                percentage={report.potencial_avance}
                className="w-32 h-32"
              />
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Desglose por Dominios */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose de Rendimiento por Dominio</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={domainChartData}
              options={{ scales: { y: { beginAtZero: true, max: 7 } } }}
            />
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
      </div>
    </div>
  );
};

export default Results;
