/**
 * Página de inicio (Landing Page)
 * Presenta la herramienta de diagnóstico digital y sus beneficios principales
 * Primera interacción del usuario con la aplicación
 */
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Lightbulb,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

/**
 * Componente principal de la página de inicio
 * Gestiona la navegación y la presentación de características principales
 * Adapta la experiencia según el estado de autenticación del usuario
 */
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Diagnóstico Predictivo',
      description: 'Evaluación basada en IA que predice su nivel de madurez digital actual'
    },
    {
      icon: TrendingUp,
      title: 'Ruta Personalizada',
      description: 'Recomendaciones específicas para avanzar al siguiente nivel'
    },
    {
      icon: Target,
      title: 'Factores Clave',
      description: 'Identificación de las áreas con mayor impacto en su progreso'
    },
    {
      icon: Lightbulb,
      title: 'Acciones Concretas',
      description: 'Pasos prácticos y alcanzables para MYPEs peruanas'
    }
  ];

  const benefits = [
    'Diagnóstico completamente gratuito',
    'Resultados en menos de 10 minutos',
    'Recomendaciones basadas en evidencia',
    'Seguimiento de su progreso en el tiempo',
    'Sin necesidad de conocimientos técnicos'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Transformación Digital para MYPEs
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Diagnóstico Predictivo de{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Madurez Digital
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubra su nivel de madurez digital y reciba una ruta personalizada 
            de mejora impulsada por inteligencia artificial
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              variant="hero" 
              size="xl"
              onClick={handleGetStarted}
              className="w-full sm:w-auto"
            >
              Iniciar Diagnóstico Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!isAuthenticated && (
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
              >
                Ya tengo cuenta
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <Card className="shadow-xl border-2">
            <CardContent className="p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                ¿Por qué realizar este diagnóstico?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t text-center">
                <p className="text-muted-foreground mb-4">
                  Únase a cientos de MYPEs que ya están transformando su negocio
                </p>
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={handleGetStarted}
                >
                  Comenzar ahora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;