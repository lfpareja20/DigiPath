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
import { Rocket } from 'lucide-react'; // Añadido solo para el logo UI

const Register = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [ruc, setRuc] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const[confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const[agreedToTerms, setAgreedToTerms] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans selection:bg-blue-100 p-4 sm:py-12">
      
      {/* Brillos de fondo (Background Glows) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <Card className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-900/5 rounded-[2rem] p-2 sm:p-6 z-10">
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
            Crear Cuenta
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="nombre_empresa" className="text-slate-700 font-bold ml-1">Nombre de la Empresa</Label>
              <Input 
                id="nombre_empresa" 
                value={nombreEmpresa} 
                onChange={(e) => setNombreEmpresa(e.target.value)} 
                required 
                className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="ruc" className="text-slate-700 font-bold ml-1">RUC</Label>
              <Input 
                id="ruc" 
                value={ruc} 
                onChange={(e) => setRuc(e.target.value)} 
                required 
                className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-slate-700 font-bold ml-1">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-bold ml-1">Confirmar Contraseña</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
                />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-400 ml-1">
              Mín. 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo especial.
            </p>

            <div className="flex items-center space-x-3 pt-3 pb-1 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isPending}
                className="border-slate-300 text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor="terms" className="text-sm font-medium text-slate-600 leading-relaxed cursor-pointer">
                He leído y acepto los{' '}
                <Link
                  to="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 border-0 mt-2" 
              disabled={isPending}
            >
              {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            ¿Ya tiene una cuenta?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;