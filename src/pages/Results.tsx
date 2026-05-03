/**
 * Página de resultados del diagnóstico
 * Muestra el análisis detallado del nivel de madurez digital
 * Incluye visualizaciones, fortalezas, debilidades y recomendaciones
 */
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as diagnosisService from "@/services/diagnosisService";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from 'react';
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FactorImpacto } from "@/types";
import { CircularProgress } from "@/components/customs/CircularProgress";
import { BarChart, ArrowUpCircle, TrendingDown, TrendingUp, Lightbulb, ArrowRight, Target, PartyPopper, Award, Rocket, MessageSquare, ArrowLeft, BrainCircuit } from "lucide-react";
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

/**
 * Componente que muestra una tarjeta de factor de impacto
 * Visualiza las fortalezas y debilidades identificadas en el diagnóstico
 * Incluye información sobre el impacto y recomendaciones de mejora
 */
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
            <CardContent className="pl-12 flex-grow flex flex-col justify-between">
                <p className="text-sm text-muted-foreground leading-relaxed">{factor.porque}</p>
                
                {/* "Call to Action" solo para las debilidades */}
                {isDebilidad && (
                    <div className="mt-4 pt-3 border-t border-destructive/10 flex items-center text-xs font-semibold text-destructive/80 group-hover:text-destructive transition-colors">
                        Ver plan de acción <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                )}
            </CardContent>
        </Card>
    );

    // Si es una debilidad, envolvemos la tarjeta en un Dialog para mostrar la acción
    if (isDebilidad) {
        const renderRespuestaVisual = (respuesta: string) => {
            const num = parseInt(respuesta);
            if (!isNaN(num) && num >= 1 && num <= 7) {
                return (
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <div key={i} className={`h-2 w-4 rounded-sm ${i <= num ? 'bg-primary' : 'bg-slate-200'}`} />
                        ))}
                        <span className="ml-2 font-black text-primary">{num}/7</span>
                    </div>
                );
            }
            return <span className="font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-md">{respuesta}</span>;
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <div className="h-full"><CardContentLayout /></div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl border-slate-200 shadow-2xl bg-white">
                    
                    {/* HEADER ELEGANTE */}
                    <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start gap-4">
                        <div className="bg-red-50 p-3 rounded-2xl">
                            <Lightbulb className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-extrabold text-slate-800 tracking-tight">{factor.titulo}</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 mt-1">
                                Oportunidad estratégica detectada
                            </DialogDescription>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        
                        {/* EL CONTEXTO: ¿Qué preguntó y qué respondió? */}
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 shadow-inner">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-slate-400" />
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contexto de tu evaluación</h4>
                            </div>
                            <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed">
                                "{factor.texto_pregunta}"
                            </p>
                            <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase">Tu Respuesta:</span>
                                {renderRespuestaVisual(factor.respuesta_usuario || "")}
                            </div>
                        </div>

                        {/* DIAGNÓSTICO DE LA IA */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <BrainCircuit className="w-4 h-4 text-primary" />
                                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Análisis de la IA</h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed pl-6 border-l-2 border-primary/20">
                                {factor.porque}
                            </p>
                        </div>
                        
                        {/* PLAN DE ACCIÓN */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-emerald-600" />
                                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Paso Sugerido</h4>
                            </div>
                            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-sm font-medium text-slate-800 leading-relaxed shadow-sm">
                                {factor.accion}
                            </div>
                        </div>

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

  const[showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (report) {
      // Mostrar el modal solo la primera vez que se visita este reporte en la sesión
      if (!sessionStorage.getItem(`welcome_modal_${report.id_diagnostico}`)) {
        setShowWelcomeModal(true);
        sessionStorage.setItem(`welcome_modal_${report.id_diagnostico}`, 'true');
      }
    }
  }, [report]);

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
      {/* MODAL UNIFICADO: BIENVENIDA A RESULTADOS (DISEÑO PREMIUM PARA TODOS) */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-[500px] border-0 p-0 overflow-hidden shadow-2xl rounded-2xl">
          {/* Cabecera dinámica según el nivel */}
          <div
            className={`p-8 text-center relative overflow-hidden ${
              report?.nivel_madurez_predicho === "Maestro Digital"
                ? "bg-gradient-to-r from-emerald-600 to-teal-800"
                : "bg-gradient-to-r from-slate-900 to-slate-800"
            }`}
          >
            <div className="absolute top-0 right-0 opacity-10">
              {report?.nivel_madurez_predicho === "Maestro Digital" ? (
                <PartyPopper className="w-32 h-32 transform translate-x-8 -translate-y-8" />
              ) : (
                <Target className="w-32 h-32 transform translate-x-8 -translate-y-8" />
              )}
            </div>

            <div className="relative z-10">
              <div className="bg-white/20 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ring-4 ring-white/30 backdrop-blur-sm">
                {report?.nivel_madurez_predicho === "Maestro Digital" ? (
                  <Award className="w-8 h-8 text-white" />
                ) : (
                  <Rocket className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {report?.nivel_madurez_predicho === "Maestro Digital"
                  ? "¡Objetivo Alcanzado!"
                  : "¡Tu Diagnóstico está Listo!"}
              </h2>
              <p className="text-white/80 mt-2 font-medium">
                Eres nivel:{" "}
                <span className="font-bold text-white">
                  {report?.nivel_madurez_predicho}
                </span>
              </p>
            </div>
          </div>

          {/* Cuerpo del mensaje dinámico */}
          <div className="p-6 text-center space-y-4 bg-white">
            <p className="text-slate-600 leading-relaxed">
              {report?.nivel_madurez_predicho === "Maestro Digital"
                ? "¡Excelente trabajo! Mantienes la excelencia en tus capacidades, pero la mejora continua es clave. Hemos detectado algunos puntos de perfeccionamiento."
                : "La Inteligencia Artificial ha analizado tus respuestas y ha creado una ruta de mejora priorizada específicamente para tu empresa."}
            </p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <p className="text-sm text-blue-800 font-medium">
                🚀 Pasa a la acción en tu <b>Centro de Transformación</b>.
                Podrás simular tu crecimiento y gestionar tus tareas en tiempo
                real.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto shadow-md"
              >
                <Link to={`/action-plan/${report?.id_diagnostico}`}>
                  Ir al Centro de Transformación
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWelcomeModal(false)}
                className="w-full sm:w-auto"
              >
                Ver Reporte Completo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        asChild
        className="text-slate-700 hover:text-primary hover:bg-primary/10 transition-colors group"
      >
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Volver al Dashboard
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* CABECERA CON BOTÓN SUPERIOR */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Resultados del Diagnóstico
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Realizado el{" "}
              {new Date(report.fecha_diagnostico).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md whitespace-nowrap"
          >
            <Link to={`/action-plan/${report.id_diagnostico}`}>
              Ir al Centro de Transformación <Target className="w-5 h-5 ml-2" />
            </Link>
          </Button>
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
              <BarChart className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Desglose de Rendimiento por Dominio</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              Su puntaje promedio (escala 1-7) en cada una de las 7 áreas clave
              de la madurez digital.
            </p>
          </CardHeader>
          <CardContent>
            {/* Damos una altura fija al contenedor para un mejor layout */}
            <div style={{ height: "400px" }}>
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
            Ha completado su diagnóstico. Aplique las recomendaciones en el
            centro de transformación para medir su progreso y descubrir nuevas
            oportunidades.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to={`/action-plan/${report.id_diagnostico}`}>
                Ir a mi Centro de Transformación{" "}
                <Target className="w-5 h-5 ml-2" />
              </Link>
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
