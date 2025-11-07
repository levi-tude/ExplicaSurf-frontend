import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import bgImage from "/surfbackground.webp"; // ✅ imagem de fundo

const AuthPage = () => {
  const [name, setName] = useState("");
  const [surfLevel, setSurfLevel] = useState("iniciante");
  const [stance, setStance] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [experienceMonths, setExperienceMonths] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        const user = data.user;
        if (user) {
          const totalMonths = experienceYears * 12 + experienceMonths;
          await supabase.from("profiles").insert([
            {
              id: user.id,
              name,
              surf_level: surfLevel,
              stance,
              experience_months: totalMonths,
            },
          ]);
        }

        toast.success("Conta criada! Você já pode fazer login.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        window.location.href = "/";
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgImage})`,
      }}
    >
      <div className="bg-gray-800/90 text-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center backdrop-blur-md border border-white/10">
        <h1 className="text-3xl font-bold mb-2 flex justify-center items-center gap-2">
          🌊 ExplicaSurf
        </h1>
        <p className="text-sm mb-6 text-gray-300">
          Entenda o mar de forma simples — previsões explicadas para todos os surfistas.
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-3 text-left">
          {isSignUp && (
            <>
              {/* Nome */}
              <label className="text-sm text-gray-300">Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
              />

              {/* Nível */}
              <label className="text-sm text-gray-300">Nível de surf</label>
              <select
                value={surfLevel}
                onChange={(e) => setSurfLevel(e.target.value)}
                className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>

              {/* Posição */}
              <label className="text-sm text-gray-300">Posição (Stance)</label>
              <select
                value={stance}
                onChange={(e) => setStance(e.target.value)}
                className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
              >
                <option value="">Selecione</option>
                <option value="regular">Regular (pé esquerdo à frente)</option>
                <option value="goofy">Goofy (pé direito à frente)</option>
              </select>

              {/* Tempo de experiência */}
              <label className="text-sm text-gray-300">Tempo de experiência</label>
              <div className="flex gap-2">
                <div className="flex flex-col w-1/2">
                  <span className="text-xs text-gray-400 mb-1">Anos</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                    className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-center"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <span className="text-xs text-gray-400 mb-1">Meses</span>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder="0"
                    value={experienceMonths}
                    onChange={(e) => setExperienceMonths(parseInt(e.target.value) || 0)}
                    className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-center"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Informe anos e meses (ex: 1 ano e 6 meses)
              </p>
            </>
          )}

          {/* E-mail */}
          <label className="text-sm text-gray-300">E-mail</label>
          <input
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
          />

          {/* Senha */}
          <label className="text-sm text-gray-300">Senha</label>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
          />

          {/* Botão principal */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition disabled:opacity-60"
          >
            {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        {/* Alternar login/cadastro */}
        <p className="text-sm mt-4 text-gray-300 text-center">
          {isSignUp ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:underline"
          >
            {isSignUp ? "Entrar" : "Cadastrar-se"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
