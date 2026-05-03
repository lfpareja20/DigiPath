/**
 * Página de perfil de empresa
 * Permite a los usuarios ver y actualizar la información de su empresa
 * Gestiona la actualización de datos como nombre y RUC
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import * as authService from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Building2 } from 'lucide-react'; // Añadido Building2 para diseño UI

const Profile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [ruc, setRuc] = useState("");

  /**
   * Inicializa el formulario con los datos actuales del usuario
   */
  useEffect(() => {
    if (user) {
      setNombreEmpresa(user.nombre_empresa);
      setRuc(user.ruc);
    }
  }, [user]);

  /**
   * Gestiona la actualización de datos del usuario
   */
  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: authService.updateCurrentUser,
    onSuccess: (updatedUser) => {
      toast({
        title: "Perfil actualizado",
        description: "La información de su empresa ha sido guardada.",
        duration: 3000,
      });
      // Actualizamos el 'user' en el AuthContext invalidando la query de 'currentUser'
      // TanStack Query volverá a llamar a /me para obtener los datos frescos.
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "No se pudo actualizar el perfil.";
      toast({
        title: "Error al actualizar",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ nombre_empresa: nombreEmpresa, ruc });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-100 relative overflow-hidden">
      
      {/* Brillos de fondo (Background Glows) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Botón de regreso mejorado */}
        <div className="mb-8 -ml-2">
          <Button
            variant="ghost"
            asChild
            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors group px-3 h-10 rounded-xl"
          >
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold">Volver al Dashboard</span>
            </Link>
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-900/5 rounded-[2rem] overflow-hidden">
          
          <CardHeader className="pb-8 pt-10 px-8 sm:px-12 border-b border-slate-100/50">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-white shadow-sm">
              <Building2 className="w-7 h-7" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Editar Perfil de la Empresa</CardTitle>
            <CardDescription className="text-base text-slate-500 mt-2 font-medium">
              Aquí puede actualizar el nombre y RUC de su empresa.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 sm:px-12 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.correo_electronico}
                  disabled
                  className="h-12 bg-slate-100 border-slate-200 text-slate-500 rounded-xl cursor-not-allowed opacity-70 px-4"
                />
                <p className="text-xs font-medium text-slate-400 ml-1">
                  El correo electrónico no se puede modificar.
                </p>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="nombre_empresa" className="text-slate-700 font-bold ml-1">Nombre de la Empresa</Label>
                <Input
                  id="nombre_empresa"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  required
                  className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4 font-medium"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="ruc" className="text-slate-700 font-bold ml-1">RUC</Label>
                <Input
                  id="ruc"
                  value={ruc}
                  onChange={(e) => {
                    // 1. Reemplaza cualquier cosa que NO sea un número por una cadena vacía
                    const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                    // 2. Solo actualiza el estado si la longitud es 11 o menos
                    if (soloNumeros.length <= 11) {
                      setRuc(soloNumeros);
                    }
                  }}
                  maxLength={11} // Evita que el navegador deje escribir más visualmente
                  required
                  className="h-12 bg-slate-50/50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all px-4 font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95 border-0 h-12 px-8"
                >
                  {isPending ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;