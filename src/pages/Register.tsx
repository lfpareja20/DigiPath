import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    ruc: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre_empresa || !formData.ruc || !formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    if (formData.ruc.length !== 11) {
      toast({
        title: 'Error',
        description: 'El RUC debe tener 11 dígitos',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiService.register(
        formData.nombre_empresa,
        formData.ruc,
        formData.email,
        formData.password
      );
      
      toast({
        title: '¡Registro exitoso!',
        description: 'Su cuenta ha sido creada. Por favor inicie sesión.',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error en el registro',
        description: 'Hubo un problema al crear su cuenta. Por favor intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Regístrese para acceder al diagnóstico de madurez digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_empresa">Nombre de la Empresa</Label>
              <Input
                id="nombre_empresa"
                type="text"
                placeholder="Mi Empresa SAC"
                value={formData.nombre_empresa}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                type="text"
                placeholder="20123456789"
                maxLength={11}
                value={formData.ruc}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="contacto@miempresa.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿Ya tiene una cuenta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Inicie sesión
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline font-medium">
                ← Volver al inicio
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
