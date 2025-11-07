import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const { mutate: requestReset, isPending, isSuccess } = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast({
        title: "Solicitud enviada",
        description: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error("Error en forgot password:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud. Inténtelo más tarde.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestReset({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4">
                <p>¡Revisa tu bandeja de entrada! Hemos enviado un enlace a tu correo.</p>
                <Button variant="outline" asChild>
                    <Link to="/login">Volver a Iniciar Sesión</Link>
                </Button>
            </div>
          ) : (
            <>
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
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                </Button>
              </form>
              {/* AÑADIMOS ESTE BLOQUE */}
              <div className="mt-4 text-center text-sm">
                  <Link to="/login" className="underline text-gray-500 hover:text-primary">
                      &larr; Volver a Iniciar Sesión
                  </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;