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
import { History, FileText } from 'lucide-react'

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
    queryKey: ['diagnosisHistory'],
    queryFn: diagnosisService.getDiagnosisHistory,
  });
  
  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Bienvenido, {user?.nombre_empresa || 'Empresa'}
            </h1>
            <p className="text-muted-foreground">Panel de Diagnóstico de Madurez Digital</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link to="/profile">Editar Perfil</Link>
            </Button>
            <Button onClick={logout} variant="outline">Cerrar Sesión</Button>
          </div>
        </header>

        <Card className="mb-8 bg-gradient-to-r from-primary to-green-500 text-primary-foreground shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <CardTitle className="text-2xl mb-2">¿Listo para su próximo diagnóstico?</CardTitle>
              <CardDescription className="text-primary-foreground/80 mb-4">
                Evalúe su progreso o realice su primera evaluación para obtener una ruta de mejora personalizada.
              </CardDescription>
              <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/questionnaire">Realizar Nuevo Diagnóstico</Link>
              </Button>
            </div>
            <FileText className="h-24 w-24 text-primary-foreground/30 hidden md:block" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground"/>
              <h2 className="text-xl font-semibold">Historial de Diagnósticos</h2>
          </div>
          
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {isError && <p className="text-destructive">Error al cargar el historial.</p>}

          {!isLoading && !isError && history && history.length > 0 && (
            <div className="space-y-3">
                {history.map((diag) => (
                <Link to={`/results/${diag.id_diagnostico}`} key={diag.id_diagnostico}>
                    <Card className="hover:border-primary/50 hover:shadow-sm transition-all">
                    <CardContent className="p-4 grid grid-cols-3 items-center gap-4">
                        <p className="font-semibold">{formatDate(diag.fecha_diagnostico)}</p>
                        <div className="text-center">
                            <span className="font-medium text-sm text-primary">{diag.nivel_madurez_predicho}</span>
                        </div>
                        <div className="text-right">
                            <Button variant="ghost" size="sm">Ver Reporte &rarr;</Button>
                        </div>
                    </CardContent>
                    </Card>
                </Link>
                ))}
            </div>
          )}
          
          {!isLoading && !isError && (!history || history.length === 0) && (
             <Card className="flex flex-col items-center justify-center p-12 border-dashed">
                <p className="text-muted-foreground mb-4">Aún no ha realizado ningún diagnóstico.</p>
                <Button asChild variant="secondary">
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