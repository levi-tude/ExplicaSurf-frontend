import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import bgImage from "/surfbackgroundprofile.webp";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    surf_level: "",
    stance: "",
    experience_months: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("name, surf_level, stance, experience_months")
        .eq("id", user.id)
        .single();
      if (error) toast.error("Erro ao carregar perfil");
      else setProfile(data ?? { name: "", surf_level: "", stance: "", experience_months: 0 });
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);

    if (error) toast.error("Erro ao salvar alterações");
    else toast.success("Perfil atualizado com sucesso!");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error("Erro ao alterar senha");
    else {
      toast.success("Senha alterada com sucesso!");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const years = Math.floor(profile.experience_months / 12);
  const months = profile.experience_months % 12;

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Carregando perfil...
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${bgImage})`,
      }}
    >
      <div className="bg-black/60 backdrop-blur-sm shadow-md">
        <Header />
      </div>

      <main className="flex-1 flex items-center justify-center mt-10">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-2xl border border-white/20 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-sky-700 mb-4">Meu Perfil</h2>

          <div className="flex flex-col gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">Nome</label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
            </div>

            {/* Nível de surf */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">Nível de Surf</label>
              <select
                value={profile.surf_level || ""}
                onChange={(e) => setProfile({ ...profile, surf_level: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none"
              >
                <option value="">Selecione</option>
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>

            {/* Posição */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">Posição (Stance)</label>
              <select
                value={profile.stance || ""}
                onChange={(e) => setProfile({ ...profile, stance: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-sky-400 focus:outline-none"
              >
                <option value="">Selecione</option>
                <option value="regular">Regular (pé esquerdo à frente)</option>
                <option value="goofy">Goofy (pé direito à frente)</option>
              </select>
            </div>

            {/* Tempo de experiência */}
            <div>
              <label className="block text-sm text-slate-600 mb-2">Tempo de Experiência</label>
              <div className="flex gap-3">
                <div className="flex flex-col w-1/2">
                  <span className="text-xs text-slate-500 mb-1">Anos</span>
                  <input
                    type="number"
                    min="0"
                    value={years}
                    onChange={(e) => {
                      const newYears = parseInt(e.target.value) || 0;
                      setProfile({
                        ...profile,
                        experience_months: newYears * 12 + months,
                      });
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <span className="text-xs text-slate-500 mb-1">Meses</span>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={months}
                    onChange={(e) => {
                      const newMonths = parseInt(e.target.value) || 0;
                      setProfile({
                        ...profile,
                        experience_months: years * 12 + newMonths,
                      });
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Informe anos e meses (ex: 1 ano e 6 meses)
              </div>
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">E-mail</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-sky-400 text-sky-600 rounded-lg hover:bg-sky-50 transition"
            >
              ← Voltar à Home
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 border border-yellow-400 text-yellow-600 rounded-lg hover:bg-yellow-50 transition"
              >
                Alterar Senha
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
