import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Radar, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Target, TrendingUp, Award, Rocket, CheckCircle2, Calendar, PartyPopper, Clock, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CircularProgress } from '@/components/customs/CircularProgress';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ActionPlan() {
  const { id_diagnostico } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const[showCelebration, setShowCelebration] = useState(false);
  
  const { data: planInit, isLoading: isLoadingInit } = useQuery({
    queryKey: ['initActionPlan', id_diagnostico],
    queryFn: async () => (await apiClient.post(`/action-plan/diagnostico/${id_diagnostico}`)).data,
    enabled: !!id_diagnostico,
  });

  const id_plan = planInit?.id_plan;

  const { data: dashboard, isLoading: isLoadingDash } = useQuery({
    queryKey: ['dashboardTransformacion', id_plan],
    queryFn: async () => (await apiClient.get(`/action-plan/${id_plan}/dashboard`)).data,
    enabled: !!id_plan,
  });

  const { mutate: updateTask } = useMutation({
    mutationFn: async ({ id_tarea, estado, progreso, fecha_limite }: any) => {
      return await apiClient.put(`/action-plan/tareas/${id_tarea}`, { estado, progreso, fecha_limite });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['dashboardTransformacion', id_plan] });
    }
  });

  // Calcula el porcentaje real basado en los sliders (suma de todos los progresos / cantidad de tareas)
  const progresoReal = dashboard ? Math.round(dashboard.tareas.reduce((acc: number, curr: any) => acc + curr.progreso, 0) / dashboard.tareas.length) : 0;

  useEffect(() => {
    if (progresoReal === 100 && dashboard) {
      setShowCelebration(true);
    }
  }, [progresoReal, dashboard]);

  if (isLoadingInit || isLoadingDash) return <div className="min-h-screen flex items-center justify-center">Sincronizando Proyecciones con IA...</div>;
  if (!dashboard) return <div>Error al cargar.</div>;

  // --- CONFIGURACIÓN DE GRÁFICOS ---
  const radarOptions = {
    scales: { r: { min: 0, max: 7, ticks: { display: false } } }, // Números del 1-7 eliminados
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } }
  };

  const radarData = {
    labels: Object.keys(dashboard.dominios_actuales),
    datasets:[
      {
        label: 'Estado Actual',
        data: Object.values(dashboard.dominios_actuales),
        backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 1)', borderWidth: 2,
      },
      {
        label: 'Proyección (En Vivo)',
        data: Object.values(dashboard.dominios_proyectados),
        backgroundColor: 'rgba(34, 197, 94, 0.25)', borderColor: 'rgba(34, 197, 94, 1)', borderWidth: 2,
      },
    ],
  };

  // Gráfico de Barras Horizontal
  const barData = {
    labels: Object.keys(dashboard.dominios_actuales),
    datasets:[{
        label: 'Puntos Ganados (+)',
        data: Object.keys(dashboard.dominios_actuales).map(key => dashboard.dominios_proyectados[key] - dashboard.dominios_actuales[key]),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 4,
    }]
  };

  // Helper para el widget de tiempo
  const renderDiferenciaDias = (fecha_limite: string, estado: string, fecha_completada: string) => {
    if (estado === 'Completada') {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-sm text-xs py-1 px-3">🎉 Logrado el {new Date(fecha_completada).toLocaleDateString()}</Badge>;
    }
    if (!fecha_limite) return <Badge variant="outline" className="text-slate-400 bg-slate-50">Sin fecha definida</Badge>;
    
    const faltan = Math.ceil((new Date(fecha_limite).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (faltan < 0) return <Badge variant="destructive" className="shadow-sm">Atrasado ({Math.abs(faltan)} días)</Badge>;
    if (faltan === 0) return <Badge className="bg-orange-500 shadow-sm">Vence Hoy</Badge>;
    return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-bold">Faltan {faltan} días</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans pb-20">
      {/* POP-UP FELICITACIÓN */}
      <AlertDialog open={showCelebration} onOpenChange={setShowCelebration}>
        <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden border-slate-200 rounded-3xl shadow-2xl shadow-blue-900/10">
          {/* Decoración superior sutil */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-emerald-400"></div>

          <div className="p-6 sm:p-8">
            <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
              {/* Ícono de Celebración */}
              <div className="relative flex justify-center items-center w-20 h-20 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-full border-8 border-white shadow-sm mb-2">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping opacity-20"></div>
                <PartyPopper className="w-10 h-10 text-emerald-500" />
              </div>

              <AlertDialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                ¡Objetivo Alcanzado!
              </AlertDialogTitle>

              <AlertDialogDescription className="text-base text-slate-600 leading-relaxed max-w-sm">
                {dashboard.nivel_actual === "Maestro Digital"
                  ? "¡Excelente! Has simulado la corrección de tus puntos ciegos. Si implementas estas mejoras en la realidad, tu empresa se consolidará como líder del sector."
                  : `¡Gran trabajo planificando tu mejora! Las proyecciones matemáticas indican que, al completar estas tareas al 100%, tus indicadores se elevarán al nivel de un `}
                {dashboard.nivel_actual !== "Maestro Digital" && (
                  <span className="font-bold text-blue-600">
                    {dashboard.nivel_proyectado}
                  </span>
                )}
                .
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Caja de Recomendación (Callout Box) */}
            <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-left">
              <div className="bg-blue-100/50 p-2 rounded-full h-fit shrink-0">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  ¿Ya implementaste estos cambios?
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Te sugerimos realizar un nuevo diagnóstico oficial para
                  recalibrar tus datos y certificar tu nuevo nivel en la
                  plataforma.
                </p>
              </div>
            </div>

            {/* Footer con Botón Mejorado */}
            <AlertDialogFooter className="mt-8 sm:justify-center w-full">
              <AlertDialogAction className="w-full bg-[#0B0F19] hover:bg-slate-800 text-white font-bold text-base h-12 rounded-xl shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95">
                Entendido
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER: Alinear a los extremos, flotante y limpio */}
        <div className="flex justify-between items-center w-full mb-2">
          <Button
            variant="ghost"
            asChild
            className="text-slate-700 hover:text-primary hover:bg-primary/10 transition-colors group"
          >
            <Link to={`/results/${id_diagnostico}`}>
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />{" "}
              Volver a Resultados
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
            Centro de Transformación <Rocket className="w-8 h-8 text-primary" />
          </h1>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-none text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-24 h-24" />
            </div>
            <CardContent className="p-8 relative z-10">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                Nivel Actual
              </p>
              <h3 className="text-3xl font-black">{dashboard.nivel_actual}</h3>
            </CardContent>
          </Card>
          <Card className="flex items-center justify-center border-slate-200 shadow-sm bg-white">
            <CardContent className="p-6 text-center flex flex-col items-center">
              <CircularProgress
                percentage={progresoReal}
                className="w-24 h-24 mb-3 drop-shadow-md"
              />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Avance del Plan
              </p>
            </CardContent>
          </Card>
          <Card
            className={`border-none shadow-xl relative overflow-hidden transition-all duration-500 ${dashboard.nivel_proyectado !== dashboard.nivel_actual ? "bg-gradient-to-br from-emerald-500 to-teal-700 text-white transform hover:scale-105" : "bg-white border-slate-200 text-slate-800"}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="w-24 h-24" />
            </div>
            <CardContent className="p-8 relative z-10">
              <p
                className={`text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2 ${dashboard.nivel_proyectado !== dashboard.nivel_actual ? "text-emerald-100" : "text-slate-400"}`}
              >
                <TrendingUp className="w-4 h-4" /> Nivel Proyectado
              </p>
              <h3 className="text-3xl font-black">
                {dashboard.nivel_proyectado}
              </h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* COLUMNA IZQUIERDA: To-Do List y Tiempos */}
          <div className="xl:col-span-5 space-y-6">
            {/* Tareas (Acordeón) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">
                  Mis Acciones Prioritarias
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Registra tu avance en vivo.
                </p>
              </div>
              <div className="p-2">
                {/* defaultValue="item-0" hace que el primero siempre esté abierto al cargar */}
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="item-0"
                  className="w-full"
                >
                  {dashboard.tareas.map((tarea: any, index: number) => (
                    <AccordionItem
                      value={`item-${index}`}
                      key={tarea.id_tarea}
                      className={`px-4 my-2 border rounded-lg transition-colors ${tarea.estado === "Completada" ? "bg-slate-50 border-slate-200" : "bg-white hover:border-primary/30"}`}
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 text-left w-full pr-4">
                          {tarea.estado === "Completada" ? (
                            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0">
                              {tarea.progreso}%
                            </div>
                          )}
                          <p
                            className={`font-bold ${tarea.estado === "Completada" ? "line-through text-slate-400" : "text-slate-800"}`}
                          >
                            {tarea.titulo}
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-6 px-2">
                        <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-600 mb-6 border border-slate-100">
                          <strong className="text-slate-800 block mb-1">
                            Recomendación:
                          </strong>
                          {tarea.recomendacion}
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                              <span>Progreso de implementación</span>
                              <span className="text-primary">
                                {tarea.progreso}%
                              </span>
                            </div>
                            <Slider
                              defaultValue={[tarea.progreso]}
                              max={100}
                              step={10}
                              // Eliminado el 'disabled' para que siempre pueda interactuar
                              onValueCommit={(val) => {
                                const nuevoProgreso = val[0];
                                const nuevoEstado =
                                  nuevoProgreso === 100
                                    ? "Completada"
                                    : "Pendiente";
                                updateTask({
                                  id_tarea: tarea.id_tarea,
                                  progreso: nuevoProgreso,
                                  estado: nuevoEstado,
                                  fecha_limite: tarea.fecha_limite,
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">
                              Establecer Fecha Límite
                            </label>
                            <Input
                              type="date"
                              defaultValue={tarea.fecha_limite || ""}
                              onBlur={(e) => {
                                updateTask({
                                  id_tarea: tarea.id_tarea,
                                  progreso: tarea.progreso,
                                  estado: tarea.estado,
                                  fecha_limite: e.target.value || null,
                                });
                              }}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            {/* Seguimiento de Tiempos */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500" /> Control de
                  Tiempos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-slate-100">
                  {dashboard.tareas.map((tarea: any) => (
                    <li
                      key={tarea.id_tarea}
                      className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 w-full">
                        <p className="text-sm font-bold text-slate-800 leading-tight">
                          {tarea.titulo}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {renderDiferenciaDias(
                          tarea.fecha_limite,
                          tarea.estado,
                          tarea.fecha_completada,
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* COLUMNA DERECHA: ANALÍTICA (Ocupa 7 columnas) */}
          <div className="xl:col-span-7 space-y-6">
            {/* Gráfico de Radar */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Radar de Expansión Digital
                </CardTitle>
                <CardDescription>
                  Visualiza en tiempo real cómo crecen tus dominios al avanzar
                  tus tareas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[450px] w-full flex items-center justify-center">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Barras Horizontal Mejorado */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Impacto Directo de tus Acciones
                </CardTitle>
                <CardDescription>
                  Puntos adicionales proyectados en cada dominio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full mt-4">
                  <Bar
                    data={barData}
                    options={{
                      indexAxis: "y", // <-- Esto lo hace Horizontal
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          beginAtZero: true,
                          title: { display: true, text: "Puntos Ganados" },
                        },
                        y: { grid: { display: false } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}