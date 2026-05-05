/**
 * Página de error 404 (Not Found)
 * Se muestra cuando el usuario intenta acceder a una ruta inexistente
 * Registra el intento de acceso para propósitos de monitoreo
 */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SearchX, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans selection:bg-blue-100 p-4">
      
      {/* Brillos de fondo (Background Glows) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-blue-900/5 rounded-[2.5rem] p-10 sm:p-16 max-w-md w-full text-center relative z-10 flex flex-col items-center">
        
        {/* Ícono decorativo */}
        <div className="bg-blue-50 p-5 rounded-full mb-6 border border-blue-100 shadow-sm">
          <SearchX className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="mb-2 text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-emerald-400 drop-shadow-sm tracking-tight">
          404
        </h1>
        
        <p className="mb-10 text-xl sm:text-2xl font-bold text-slate-600 tracking-tight">
          Oops! Page not found
        </p>
        
        <a 
          href="/" 
          className="inline-flex items-center justify-center gap-2 w-full h-14 bg-[#0B0F19] text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 border-0"
        >
          <ArrowLeft className="w-5 h-5" /> Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;