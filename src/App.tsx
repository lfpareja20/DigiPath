import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { QuestionnaireProvider } from "./contexts/QuestionnaireContext";
import { ResultProvider } from "./contexts/ResultContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Questionnaire from "./pages/Questionnaire";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // isLoading se refiere a la carga INICIAL de la autenticación.
  // Si estamos en esa carga inicial, mostramos un spinner.
  // Esto evita que se redirija al login antes de tiempo al refrescar la página.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Si ya terminó la carga Y el usuario NO está autenticado, entonces redirigimos.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si ya terminó la carga Y el usuario SÍ está autenticado, mostramos el contenido.
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* 1. BrowserRouter AHORA ENVUELVE A TODO LO DEMÁS */}
    <BrowserRouter>
      <AuthProvider>
        <QuestionnaireProvider>
          <ResultProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route 
                  path="/dashboard" 
                  element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } 
                />
                <Route 
                  path="/questionnaire" 
                  element={ <ProtectedRoute> <Questionnaire /> </ProtectedRoute> } 
                />
                <Route 
                  path="/results/:diagnosisId" 
                  element={ <ProtectedRoute> <Results /> </ProtectedRoute> } 
                />
                <Route 
                  path="/profile"
                  element={ <ProtectedRoute> <Profile /> </ProtectedRoute> }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ResultProvider>
        </QuestionnaireProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;