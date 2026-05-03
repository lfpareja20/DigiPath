import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Rocket, CheckCircle2, XCircle } from 'lucide-react'; // Añadido para el diseño de estados y logo

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('');

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
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans selection:bg-blue-100 p-4">
            {/* Brillos de fondo (Background Glows) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-900/5 rounded-[2rem] p-8 text-center z-10">
                <div className="flex justify-center mb-6">
                  {isSuccess ? (
                    <div className="bg-emerald-50/50 p-4 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="bg-red-50/50 p-4 rounded-full border border-red-100">
                      <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                  )}
                </div>
                
                {isSuccess ? (
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">¡Éxito!</CardTitle>
                ) : (
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Enlace Inválido</CardTitle>
                )}
                
                <p className="mt-4 text-slate-500 font-medium leading-relaxed">
                    {isSuccess ? "Tu contraseña se ha restablecido correctamente." : "El enlace de recuperación es inválido o ha expirado."}
                </p>
                
                <Button asChild className="mt-8 w-full h-12 bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 border-0">
                    <Link to="/login">Ir a Iniciar Sesión</Link>
                </Button>
            </Card>
        </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans selection:bg-blue-100 p-4">
      {/* Brillos de fondo (Background Glows) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-900/5 rounded-[2rem] p-2 sm:p-6 z-10">
        <CardHeader className="flex flex-col items-center space-y-4 pb-6">
          {/* Logo DigiPath */}
          <div className="flex items-center gap-2 group cursor-default">
            <div className="bg-gradient-to-br from-blue-600 to-emerald-400 p-2 rounded-xl text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Digi<span className="text-blue-600">Path</span>
            </span>
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight text-center">
            Restablecer Contraseña
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="new_password" className="text-slate-700 font-bold ml-1">Nueva Contraseña</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="confirm_password" className="text-slate-700 font-bold ml-1">Confirmar Contraseña</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 border-0 mt-2" 
              disabled={isPending}
            >
              {isPending ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;