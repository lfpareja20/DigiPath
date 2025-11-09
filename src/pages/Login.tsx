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

/**
 * Componente principal de la página de inicio de sesión
 * Gestiona el formulario y el proceso de autenticación
 */
const Login = () => {
  const [email, setEmail] = useState("");
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
              {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tiene una cuenta?{" "}
            <Link to="/register" className="underline">
              Regístrese gratis
            </Link>
          </div>
          <div>
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:underline">
                ¿Olvidó su contraseña?
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
