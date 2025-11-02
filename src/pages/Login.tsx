import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { token, user } = await apiService.login(email, password);
      login(token, user);
      
      toast({
        title: '¡Bienvenido!',
        description: `Hola ${user.nombre_empresa}`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error de autenticación',
        description: 'Credenciales incorrectas. Por favor intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Acceda a su panel de diagnóstico digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="empresa@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tiene una cuenta?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Regístrese gratis
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline font-medium">
                ← Volver al inicio
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
