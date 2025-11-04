import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import * as diagnosisService from '@/services/diagnosisService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Para el estado de carga

// Helper para formatear la fecha de una manera más amigable
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Dashboard = () => {
  const { user, logout } = useAuthContext();

  // Usamos useQuery para obtener el historial de diagnósticos del usuario
  const { data: history, isLoading, isError } = useQuery({
    queryKey: ['diagnosisHistory'],
    queryFn: diagnosisService.getDiagnosisHistory,
  });
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera con el nombre de la empresa y botón de logout */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Bienvenido, {user?.nombre_empresa || 'Empresa'}
          </h1>
          <Button onClick={logout} variant="outline">Cerrar Sesión</Button>
        </header>

        {/* Tarjeta de acción principal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>¿Listo para su diagnóstico?</CardTitle>
            <CardDescription>
              Complete nuestro cuestionario de 20 preguntas y descubra el nivel de madurez digital de su empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/questionnaire">Realizar Nuevo Diagnóstico</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Sección de Historial de Diagnósticos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Historial de Diagnósticos</h2>
          
          {isLoading && (
            // Mostramos 'skeletons' mientras cargan los datos
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          )}

          {isError && (
            <p className="text-red-500">Error al cargar el historial.</p>
          )}

          {!isLoading && !isError && history && history.length > 0 && (
            history.map((diag) => (
              <Link to={`/results/${diag.id_diagnostico}`} key={diag.id_diagnostico}>
                <Card className="hover:bg-gray-100 transition-colors">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{formatDate(diag.fecha_diagnostico)}</p>
                      <p className="text-sm text-gray-500">
                        Nivel Alcanzado: 
                        <span className="font-medium text-primary ml-2">{diag.nivel_madurez_predicho}</span>
                      </p>
                    </div>
                    <Button variant="secondary">Ver Reporte</Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
          
          {!isLoading && !isError && (!history || history.length === 0) && (
            <p className="text-gray-500">Aún no ha realizado ningún diagnóstico.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;