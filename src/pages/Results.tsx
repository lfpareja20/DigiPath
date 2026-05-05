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
    const accentColor = isDebilidad ? 'text-red-500' : 'text-emerald-500';
    const bgColor = isDebilidad ? 'bg-red-50' : 'bg-emerald-50';
    const borderColor = isDebilidad ? 'border-red-100' : 'border-emerald-100';
    const hoverBorderColor = isDebilidad ? 'group-hover:border-red-300' : 'group-hover:border-emerald-300';
    const Icon = isDebilidad ? TrendingDown : TrendingUp;

    const CardContentLayout = () => (
        <Card className={`bg-white border ${borderColor} rounded-[1.5rem] shadow-sm hover:shadow-lg ${hoverBorderColor} transition-all duration-300 cursor-pointer group relative overflow-hidden h-full flex flex-col`}>
            {/* Pequeño resplandor de fondo en hover */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none -mr-10 -mt-10`}></div>
            
            <CardHeader className="pb-2 shrink-0">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className={`${bgColor} p-2.5 rounded-xl border ${borderColor}`}>
                           <Icon className={`h-5 w-5 ${accentColor}`} />
                        </div>
                        <CardTitle className="text-base font-bold text-slate-800 leading-tight">{factor.titulo}</CardTitle>
                    </div>
                    <div className={`text-[11px] font-black px-2.5 py-1 rounded-full ${bgColor} ${accentColor} border ${borderColor} whitespace-nowrap shadow-sm relative z-10`}>
                        {factor.peso_impacto.toFixed(0)}% IMPACTO
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-[4.5rem] flex-grow flex flex-col justify-between relative z-10 pb-5">
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{factor.porque}</p>
                
                {/* "Call to Action" solo para las debilidades */}
                {isDebilidad && (
                    <div className="mt-4 pt-3 border-t border-red-100/50 flex items-center text-xs font-bold text-red-500/80 group-hover:text-red-600 transition-colors">
                        Ver plan de acción <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (isDebilidad) {
        const renderRespuestaVisual = (respuesta: string) => {
            const num = parseInt(respuesta);
            if (!isNaN(num) && num >= 1 && num <= 7) {
                return (
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <div key={i} className={`h-2.5 w-4 sm:w-5 rounded-full transition-all ${i <= num ? 'bg-blue-500 shadow-sm' : 'bg-slate-100'}`} />
                        ))}
                        <span className="ml-2 font-black text-blue-600 text-lg">{num}/7</span>
                    </div>
                );
            }
            return <span className="font-black text-blue-700 uppercase bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-lg">{respuesta}</span>;
        };

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <div className="h-full block"><CardContentLayout /></div>
                </DialogTrigger>
                {/* AÑADIDO: max-h-[90vh] y flex-col para que no desborde la pantalla */}
                <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white flex flex-col">
                    
                    {/* HEADER FIJO */}
                    <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-start gap-4 shrink-0">
                        <div className="bg-red-100 border border-red-200 p-3 rounded-2xl shadow-sm shrink-0">
                            <Lightbulb className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight leading-tight">{factor.titulo}</DialogTitle>
                            <DialogDescription className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                Oportunidad estratégica detectada
                            </DialogDescription>
                        </div>
                    </div>
                    
                    {/* CUERPO CON SCROLL INTERNO */}
                    <div className="p-6 space-y-6 overflow-y-auto">
                        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Contexto de tu evaluación</h4>
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                "{factor.texto_pregunta}"
                            </p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-xl gap-2">
                                <span className="text-xs font-black text-blue-800 uppercase">Tu Respuesta:</span>
                                {renderRespuestaVisual(factor.respuesta_usuario || "")}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <BrainCircuit className="w-4 h-4 text-purple-500" />
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Análisis de la IA</h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed pl-5 border-l-4 border-purple-200 font-medium">
                                {factor.porque}
                            </p>
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Paso Sugerido</h4>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-sm font-bold text-emerald-900 leading-relaxed shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/40 rounded-full blur-xl -mr-10 -mt-10 pointer-events-none"></div>
                                {factor.accion}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold">Generando reporte inteligente...</p>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-red-500 font-sans font-bold">
        Error al cargar el reporte.
      </div>
    );
  }

   const domainLabels = Object.keys(report.desglose_dominios);
    const domainScores = Object.values(report.desglose_dominios);

    // 2. Lógica para el color dinámico de las barras (Adaptado a colores de marca)
    const barColors = domainScores.map(score => {
        if (score < 3) return 'rgba(239, 68, 68, 0.8)';   // Red-500
        if (score < 5) return 'rgba(245, 158, 11, 0.8)';  // Amber-500
        return 'rgba(16, 185, 129, 0.8)';                 // Emerald-500 (Marca)
    });
    const borderColors = domainScores.map(score => {
        if (score < 3) return 'rgb(239, 68, 68)';
        if (score < 5) return 'rgb(245, 158, 11)';
        return 'rgb(16, 185, 129)';
    });

    const domainChartData = {
        labels: domainLabels,
        datasets:[{
            label: 'Puntaje por Dominio',
            data: domainScores,
            backgroundColor: barColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 4, // Bordes redondeados en las barras
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
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { size: 14, family: 'Inter' },
                bodyFont: { size: 13, family: 'Inter' },
                padding: 12,
                cornerRadius: 8,
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
                    color: 'rgba(0, 0, 0, 0.03)', // Hacemos la grilla más sutil
                },
                ticks: { font: { family: 'Inter', weight: 'normal' as const } }
            },
            y: {
                grid: {
                    display: false, // Quitamos la grilla vertical para un look más limpio
                },
                ticks: { font: { family: 'Inter', weight: 'bold' as const } }
            }
        },
    };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-100 relative overflow-hidden">
      
      {/* Brillos de fondo (Background Glows) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* MODAL UNIFICADO: BIENVENIDA A RESULTADOS */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-[450px] w-[95vw] border-0 p-0 overflow-hidden shadow-2xl rounded-[2rem]">
          
          <div
            className={`p-8 pb-10 text-center relative overflow-hidden flex flex-col items-center ${
              report?.nivel_madurez_predicho === "Maestro Digital"
                ? "bg-gradient-to-br from-[#1E40AF] via-[#3B82F6] to-[#10B981]"
                : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            }`}
          >
            {/* Fondo decorativo NO intrusivo */}
            <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none">
              {report?.nivel_madurez_predicho === "Maestro Digital" ? (
                <PartyPopper className="w-40 h-40" />
              ) : (
                <Target className="w-40 h-40" />
              )}
            </div>

            <div className="relative z-10 flex flex-col items-center w-full mt-2">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/30 backdrop-blur-md shadow-xl">
                {report?.nivel_madurez_predicho === "Maestro Digital" ? (
                  <Award className="w-8 h-8 text-white" />
                ) : (
                  <Rocket className="w-8 h-8 text-white" />
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm mb-2">
                {report?.nivel_madurez_predicho === "Maestro Digital"
                  ? "¡Objetivo Alcanzado!"
                  : "¡Tu Diagnóstico Listo!"}
              </h2>
              <div className="flex items-center gap-2">
                  <span className="text-white/90 font-medium text-base">Eres nivel:</span>
                  <span className="font-black text-white bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                    {report?.nivel_madurez_predicho}
                  </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 text-center space-y-5 bg-white">
            <p className="text-slate-600 leading-relaxed font-medium text-sm">
              {report?.nivel_madurez_predicho === "Maestro Digital"
                ? "¡Excelente trabajo! Mantienes la excelencia en tus capacidades. Hemos detectado algunos puntos de perfeccionamiento."
                : "La Inteligencia Artificial ha analizado tus respuestas y ha creado una ruta de mejora priorizada específicamente para tu empresa."}
            </p>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-inner">
              <p className="text-xs text-blue-800 font-bold leading-relaxed">
                🚀 Pasa a la acción en tu <span className="text-blue-900 bg-blue-100/50 px-2 py-0.5 rounded">Centro de Transformación</span>.
                Podrás simular tu crecimiento en tiempo real.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center w-full">
              <Button
                asChild
                className="bg-[#0B0F19] hover:bg-slate-800 text-white font-bold h-12 px-4 rounded-xl w-full sm:flex-1 shadow-lg shadow-slate-200 transition-all border-0"
              >
                <Link to={`/action-plan/${report?.id_diagnostico}`}>
                  Ir al Centro
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWelcomeModal(false)}
                className="h-12 px-4 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors w-full sm:flex-1"
              >
                Ver Reporte
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="mb-6 -ml-2">
            <Button
                variant="ghost"
                asChild
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors group px-3 h-10 rounded-xl"
            >
                <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="font-bold">Volver al Dashboard</span>
                </Link>
            </Button>
        </div>

        <div className="space-y-8">
            {/* CABECERA CON BOTÓN SUPERIOR */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-sm">
            <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Resultados del Diagnóstico
                </h1>
                <p className="text-slate-500 font-bold mt-2 uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
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
                className="bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95 h-14 px-8 border-0 whitespace-nowrap"
            >
                <Link to={`/action-plan/${report.id_diagnostico}`}>
                Ir al Centro de Transformación <Target className="w-5 h-5 ml-2" />
                </Link>
            </Button>
            </header>

            {/* Resumen Ejecutivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Nivel de Madurez */}
            <Card className="bg-white border-slate-200 rounded-[2rem] shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-wider">
                    Nivel de Madurez Digital
                </CardTitle>
                <div className="bg-blue-100/50 p-2 rounded-xl">
                    <BarChart className="h-5 w-5 text-blue-600" />
                </div>
                </CardHeader>
                <CardContent className="relative z-10">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
                    {report.nivel_madurez_predicho}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
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
            <Card className="bg-white border-slate-200 rounded-[2rem] shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-wider">
                    Potencial de Avance
                </CardTitle>
                <div className="bg-emerald-100/50 p-2 rounded-xl">
                    <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center relative z-10">
                <div className="relative transform hover:scale-105 transition-transform duration-500">
                    <CircularProgress
                        percentage={report.potencial_avance}
                        className="w-28 h-28 my-2 drop-shadow-md"
                    />
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 w-full">
                    <span>Probabilidad de avanzar nivel.</span>
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
            <Card className="bg-white border-slate-200 rounded-[2rem] shadow-sm">
            <CardHeader className="pb-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                        <BarChart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black text-slate-900">Desglose por Dominio</CardTitle>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                        Su puntaje promedio (escala 1-7) en cada una de las 7 áreas clave.
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div style={{ height: "420px" }} className="w-full">
                <Bar data={domainChartData} options={domainChartOptions} />
                </div>
            </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Áreas de Mejora Prioritarias (Debilidades) */}
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                        <div className="bg-red-50 p-2 rounded-xl border border-red-100">
                            <TrendingDown className="w-6 h-6 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Áreas Prioritarias
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 h-full">
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
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                        <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Fortalezas Actuales
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 h-full">
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

            {/* Call to Action Final */}
            <div className="text-center p-12 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl shadow-blue-900/5 relative overflow-hidden mt-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">¿Qué sigue ahora?</h3>
                <p className="text-slate-500 font-medium text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                    Ha completado su diagnóstico exitosamente. Aplique las recomendaciones en el
                    centro de transformación para medir su progreso en tiempo real y descubrir nuevas
                    oportunidades.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 h-14 px-8 border-0">
                    <Link to={`/action-plan/${report.id_diagnostico}`}>
                        Ir a mi Centro de Transformación{" "}
                        <Target className="w-5 h-5 ml-2" />
                    </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg" className="h-14 px-8 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                    <Link to="/dashboard">Ver Historial</Link>
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Results;