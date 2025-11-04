import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Extraemos el token de la URL (ej. ?token=...)
  const token = searchParams.get('token');

  const { mutate: reset, isPending, isSuccess } = useMutation({
    mutationFn: authService.resetPassword, 
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada con éxito. Ya puedes iniciar sesión.",
        duration: 5000,
      });
      navigate('/login');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "El enlace es inválido o ha expirado.";
      toast({
        title: "Error al restablecer",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Las contraseñas no coinciden", variant: "destructive", duration: 3000 });
      return;
    }
    if (!token) {
      toast({ title: "Token no encontrado", description: "El enlace parece estar roto.", variant: "destructive", duration: 3000 });
      return;
    }
    reset({ token, new_password: newPassword });
  };

  if (!token || isSuccess) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md text-center p-8">
                {isSuccess ? (
                    <CardTitle>¡Éxito!</CardTitle>
                ) : (
                    <CardTitle className="text-red-500">Enlace Inválido</CardTitle>
                )}
                <p className="mt-4">
                    {isSuccess ? "Tu contraseña se ha restablecido." : "El enlace de recuperación es inválido o ha expirado."}
                </p>
                <Button asChild className="mt-6">
                    <Link to="/login">Ir a Iniciar Sesión</Link>
                </Button>
            </Card>
        </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Restablecer Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">Nueva Contraseña</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmar Contraseña</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;