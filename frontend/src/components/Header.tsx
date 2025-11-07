import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  // 🔹 Busca o nome do perfil no Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

      if (!error && data) setProfile(data);
    };

    fetchProfile();
  }, [user]);

  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 🌊 Logo / Título */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl">🌊</span>
          <h1 className="text-xl font-bold text-sky-600">ExplicaSurf</h1>
        </div>

        {/* 🔹 Lado direito: nome do usuário + botões */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-700 font-medium">
                👋 Olá, {profile?.name || user.email || "Surfista"}
              </span>

              {/* ✅ Botão Meu Perfil */}
              <button
                onClick={() => navigate("/perfil")}
                className="text-sm px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              >
                Meu Perfil
              </button>

              {/* 🚪 Botão Sair */}
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-700 hover:bg-red-50 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="text-sm px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Entrar
            </button>
          )}
        </div>
      </div>

      {/* Faixa colorida inferior */}
      <div className="w-full h-4 bg-gradient-to-r from-sky-500 to-teal-400" />
    </header>
  );
};

export default Header;
