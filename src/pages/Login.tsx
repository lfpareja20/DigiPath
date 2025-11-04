import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import * as authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login: loginContext } = useAuthContext();
  const { toast } = useToast();

  // useMutation para manejar la llamada a la API
  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Si la API responde con éxito, usamos la función del contexto para guardar el estado
      loginContext(data.access_token);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta.",
      });
      navigate('/dashboard'); // Redirigimos al panel principal
    },
    onError: (error) => {
      // Si la API devuelve un error (ej. 401 Unauthorized), mostramos una notificación
      console.error("Error de inicio de sesión:", error);
      toast({
        title: "Error de inicio de sesión",
        description: "Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Llamamos a la mutación con las credenciales
    loginUser({ username: email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tiene una cuenta?{' '}
            <Link to="/register" className="underline">
              Regístrese gratis
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;