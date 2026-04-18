import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const Register = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [ruc, setRuc] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { mutate: registerUser, isPending } = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
          toast({
            title: "¡Registro exitoso!",
            description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
            duration: 2500,
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
            const firstError = errorDetail[0];
        
        if (firstError.loc.includes('ruc')) {
            errorMessage = "El RUC debe contener exactamente 11 números.";
        } else if (firstError.loc.includes('contrasena')) {
            errorMessage = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.";
        } else {
            errorMessage = "Por favor, revise que todos los campos estén llenos correctamente.";
        }
      }

      toast({
        title: "Error al registrarse",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast({
        title: 'Términos y Condiciones',
        description: 'Debe aceptar los términos y condiciones para continuar.',
        variant: 'destructive',
      });
      return; // Detiene el envío del formulario
    }

    if (password !== confirmPassword) {
        toast({
            title: "Las contraseñas no coinciden",
            description: "Asegúrese de escribir exactamente la misma contraseña en ambos campos.",
            variant: "destructive",
        });
        return; // Detenemos el envío
    }

    registerUser({
      nombre_empresa: nombreEmpresa,
      ruc: ruc,
      correo_electronico: email,
      contrasena: password,
      acepta_terminos: agreedToTerms,
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
              <p className="text-xs text-gray-500">Mín. 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo especial.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isPending}
              />
              <Label htmlFor="terms" className="text-sm font-light text-muted-foreground">
                He leído y acepto los{' '}
                <Link
                  to="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary font-medium"
                >
                  Términos y Condiciones
                </Link>
              </Label>
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