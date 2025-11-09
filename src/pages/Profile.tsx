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

const Profile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [ruc, setRuc] = useState('');

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
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "No se pudo actualizar el perfil.";
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="outline" asChild className="mb-4">
            <Link to="/dashboard">&larr; Volver al Dashboard</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Editar Perfil de la Empresa</CardTitle>
            <CardDescription>
              Aquí puede actualizar el nombre y RUC de su empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" value={user.correo_electronico} disabled />
                <p className="text-xs text-gray-500">El correo electrónico no se puede modificar.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre_empresa">Nombre de la Empresa</Label>
                <Input 
                  id="nombre_empresa" 
                  value={nombreEmpresa} 
                  onChange={(e) => setNombreEmpresa(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input 
                  id="ruc" 
                  value={ruc} 
                  onChange={(e) => setRuc(e.target.value)} 
                  required 
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar Cambios'}
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