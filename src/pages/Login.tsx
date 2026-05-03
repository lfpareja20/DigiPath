/**
 * Página de inicio de sesión
 * Maneja la autenticación de usuarios mediante correo y contraseña
 * Proporciona acceso al registro y recuperación de contraseña
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import * as authService from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Rocket } from "lucide-react"; // Añadido solo para el logo UI

/**
 * Componente principal de la página de inicio de sesión
 * Gestiona el formulario y el proceso de autenticación
 */
const Login = () => {
  const[email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login: loginContext } = useAuthContext();
  const { toast } = useToast();
  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta.",
        duration: 2500,
      });
      loginContext(data.access_token);
    },
    onError: (error) => {
      console.error("Error de inicio de sesión:", error);
      toast({
        title: "Error de inicio de sesión",
        description:
          "Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.",
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
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans selection:bg-blue-100 p-4">
      
      {/* Brillos de fondo (Background Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100/40 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-100/40 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-900/5 rounded-[2rem] p-2 sm:p-4 z-10">
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
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="empresa@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4"
              />
            </div>
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
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 border-0 mt-2" 
              disabled={isPending}
            >
              {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="text-center text-sm font-medium text-slate-500">
              ¿No tiene una cuenta?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
                Regístrese gratis
              </Link>
            </div>
            <div>
              <Link to="/forgot-password" className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors hover:underline">
                ¿Olvidó su contraseña?
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;