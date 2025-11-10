import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage"; // 
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// ✅ Rota protegida (acesso se estiver logado)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-10">Carregando...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

// ✅ Definição das rotas
const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />

    <Route
      path="/perfil"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

// ✅ App principal
const App = () => {

  // ✅ Acorda o backend automaticamente ao carregar o site
  useEffect(() => {
    fetch("/api/warmup").catch(() => null);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* ✅ BrowserRouter vem antes do AuthProvider */}
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

