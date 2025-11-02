import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { useResultContext } from '@/contexts/ResultContext';
import { apiService } from '@/services/api';
import { 
  PlayCircle, 
  LogOut, 
  Calendar, 
  TrendingUp,
  Loader2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const { history, setHistory } = useResultContext();
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await apiService.getDiagnosisHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [setHistory]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Maestro': return 'bg-accent text-accent-foreground';
      case 'Seguidor': return 'bg-primary text-primary-foreground';
      case 'Conservador': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Bienvenido, {user?.nombre_empresa}
            </h1>
            <p className="text-muted-foreground mt-1">
              Panel de Diagnóstico de Madurez Digital
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Main Action Card */}
        <Card className="shadow-xl border-2 border-primary/20 mb-8">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  ¿Listo para su diagnóstico?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Complete nuestro cuestionario de 19 preguntas y descubra el nivel 
                  de madurez digital de su empresa
                </p>
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate('/questionnaire')}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Realizar Nuevo Diagnóstico
                </Button>
              </div>
              <div className="hidden md:block">
                <FileText className="h-32 w-32 text-primary/20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historial de Diagnósticos
            </CardTitle>
            <CardDescription>
              Revise los resultados de sus diagnósticos anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Aún no tiene diagnósticos realizados
                </p>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/questionnaire')}
                >
                  Realizar su primer diagnóstico
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((diagnosis) => (
                  <div
                    key={diagnosis.id_diagnostico}
                    onClick={() => navigate(`/results/${diagnosis.id_diagnostico}`)}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border-2 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {format(new Date(diagnosis.fecha_diagnostico), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Potencial de avance: {diagnosis.probabilidad_exito}%
                        </p>
                      </div>
                    </div>
                    <Badge className={getLevelColor(diagnosis.nivel_madurez_predicho)}>
                      {diagnosis.nivel_madurez_predicho}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
