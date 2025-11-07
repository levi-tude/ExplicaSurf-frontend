import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ nova página
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// rota protegida (só acessa se estiver logado)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-10">Carregando...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

// rotas da aplicação
const AppRoutes = () => (
  <Routes>
    {/* login / cadastro */}
    <Route path="/auth" element={<AuthPage />} />

    {/* home protegida */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />

    {/* página de perfil protegida */}
    <Route
      path="/perfil"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />

    {/* rota 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// app principal
const App = () => (
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

export default App;
