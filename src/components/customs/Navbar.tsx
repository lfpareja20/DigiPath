// src/components/layout/Navbar.tsx
import { Link } from 'react-router-dom';
import { Rocket, User, LogOut } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return null; // Solo se muestra si está logueado

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo DigiPath */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-emerald-400 p-2 rounded-xl text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              Digi<span className="text-blue-600">Path</span>
            </span>
          </Link>

          {/* Menú de Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2 rounded-full pl-2 pr-4 bg-slate-50 hover:bg-slate-100 border border-slate-200">
                <div className="bg-blue-50 p-1.5 rounded-full"><User className="w-4 h-4 text-blue-600" /></div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block truncate max-w-[150px]">
                  {user?.nombre_empresa}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer"><Link to="/profile">Editar Perfil Empresarial</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700">
                <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
        </div>
      </div>
    </nav>
  );
};