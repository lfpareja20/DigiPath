import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [ruc, setRuc] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutate: registerUser, isPending } = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
          toast({
            title: "¡Registro exitoso!",
            description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
          });
          navigate('/login');
        },
        onError: (error: any) => {
          console.error("Error de registro:", error.response?.data);
          
          // Lógica mejorada para manejar diferentes tipos de errores
          let errorMessage = "Ocurrió un error inesperado. Por favor, inténtelo de nuevo.";
          
          const errorDetail = error.response?.data?.detail;

          if (typeof errorDetail === 'string') {
            // Caso 1: El error es un texto simple (ej. "El usuario ya existe")
            errorMessage = errorDetail;
          } else if (Array.isArray(errorDetail)) {
            // Caso 2: El error es un array de validación de Pydantic
            // Tomamos el mensaje del PRIMER error del array.
            const firstError = errorDetail[0];
            if (firstError && firstError.msg) {
              errorMessage = firstError.msg;
            }
          }

          toast({
            title: "Error de registro",
            description: errorMessage, // Ahora errorMessage es siempre un texto
            variant: "destructive",
          });
        },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({
      nombre_empresa: nombreEmpresa,
      ruc: ruc,
      correo_electronico: email,
      contrasena: password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_empresa">Nombre de la Empresa</Label>
              <Input id="nombre_empresa" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input id="ruc" value={ruc} onChange={(e) => setRuc(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tiene una cuenta?{' '}
            <Link to="/login" className="underline">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;