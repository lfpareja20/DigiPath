/**
 * Dashboard principal de la aplicación
 * Muestra el resumen del usuario, acciones principales y el historial de diagnósticos
 * Permite iniciar nuevos diagnósticos y ver resultados anteriores
 */
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import * as diagnosisService from '@/services/diagnosisService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { History, FileText, Sparkles } from 'lucide-react'

/**
 * Formatea una fecha ISO a un formato legible en español
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada (ejemplo: "15 de noviembre de 2025")
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Componente principal del Dashboard
 * Gestiona la visualización de la información del usuario,
 * sus diagnósticos previos y el acceso a nuevas evaluaciones
 */
const Dashboard = () => {
  const { user, logout } = useAuthContext();

  // Usamos useQuery para obtener el historial de diagnósticos del usuario
  const { data: history, isLoading, isError } = useQuery({
    queryKey:['diagnosisHistory'],
    queryFn: diagnosisService.getDiagnosisHistory,
  });
  
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-100 text-slate-600">
      <div className="max-w-5xl mx-auto">

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Bienvenido,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400 pb-1">
              {user?.nombre_empresa || 'Empresa'}
            </span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium flex items-center gap-3">
            <span className="w-10 h-[3px] bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"></span>
            Panel de Diagnóstico de Madurez Digital
          </p>
        </header>

        {/* BANNER PRINCIPAL CALL TO ACTION */}
        <Card className="mb-14 relative overflow-hidden border-0 rounded-[2.5rem] shadow-2xl shadow-blue-200/50 group">
          {/* Fondo base con Degradado fluido de 3 puntos (Azul profundo -> Celeste -> Verde Claro) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-500 to-emerald-400"></div>
          
          {/* Elementos Decorativos Tecnológicos (Protegidos con pointer-events-none para no dar errores) */}
          <div className="absolute top-0 right-1/4 w-1/2 h-full bg-white/10 skew-x-12 pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-300/40 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-900/30 rounded-full blur-[80px] pointer-events-none"></div>

          <CardContent className="p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="text-center md:text-left flex-1">
              
              {/* Badge superior cristalino */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-6 tracking-wider uppercase border border-white/20 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Estado Actual: Activo
              </div>
              
              <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-white tracking-tight leading-tight drop-shadow-sm">
                ¿Listo para su próximo <br className="hidden sm:block" /> diagnóstico oficial?
              </CardTitle>
              
              <CardDescription className="text-blue-50/90 text-lg mb-8 max-w-xl leading-relaxed font-medium">
                Evalúe su progreso en tiempo real y obtenga una ruta de mejora optimizada por nuestros algoritmos.
              </CardDescription>
              
              {/* Botón oscuro estilo SaaS premium */}
              <Button asChild size="lg" className="bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 h-14 px-10 text-lg border-0">
                <Link to="/questionnaire">Iniciar Evaluación Ahora</Link>
              </Button>
            </div>

            {/* Ícono Flotante con Glassmorphism */}
            <div className="relative hidden md:block mt-8 md:mt-0">
              {/* Sombra de luz trasera que reacciona al hover */}
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 transition-opacity duration-500 opacity-60 group-hover:opacity-100"></div>
              {/* Tarjeta de cristal */}
              <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/30 shadow-2xl rotate-3 group-hover:-rotate-3 transition-transform duration-500 ease-out">
                <FileText className="h-24 w-24 text-white drop-shadow-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECCIÓN DE HISTORIAL */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <History className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Historial de Diagnósticos
            </h2>
          </div>

          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl bg-slate-200/50" />
              <Skeleton className="h-24 w-full rounded-2xl bg-slate-200/50" />
            </div>
          )}

          {isError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-medium">
              Error al cargar el historial.
            </div>
          )}

          {!isLoading && !isError && history && history.length > 0 && (
            <div className="space-y-4">
              {history.map((diag) => (
                <Link
                  to={`/results/${diag.id_diagnostico}`}
                  key={diag.id_diagnostico}
                  className="block group"
                >
                  <Card className="bg-white border-slate-200 rounded-2xl shadow-sm group-hover:border-blue-400 group-hover:shadow-md transition-all duration-300">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Fecha */}
                      <div className="flex-1">
                        <p className="font-bold text-slate-700 text-lg">
                          {formatDate(diag.fecha_diagnostico)}
                        </p>
                      </div>

                      {/* Etiqueta de Nivel (Badge) */}
                      <div className="flex-1 flex justify-start sm:justify-center">
                        <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-bold text-blue-700">
                          {diag.nivel_madurez_predicho}
                        </span>
                      </div>

                      {/* Botón Acción */}
                      <div className="flex-1 flex justify-start sm:justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-500 font-semibold group-hover:text-blue-600 group-hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Ver Reporte{" "}
                          <span className="ml-1 group-hover:translate-x-1 transition-transform">
                            &rarr;
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* ESTADO VACÍO (Empty State) */}
          {!isLoading && !isError && (!history || history.length === 0) && (
            <Card className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl mt-4">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium mb-6 text-lg text-center">
                Aún no ha realizado ningún diagnóstico oficial.
              </p>
              <Button
                asChild
                variant="outline"
                className="bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-xl font-bold transition-colors"
              >
                <Link to="/questionnaire">Realizar mi primer diagnóstico</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;