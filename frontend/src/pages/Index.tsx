import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SkillLevelSelector from "@/components/SkillLevelSelector";
import OceanDataCard from "@/components/OceanDataCard";
import TideChart from "@/components/charts/TideChart";
import WaveHeightChart from "@/components/charts/WaveHeightChart";
import WindChart from "@/components/charts/WindChart";
import ExplanationCard from "@/components/ExplanationCard";
import WeatherChart from "@/components/charts/WeatherChart";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Cache simples
const forecastCache: Record<string, any> = {};

const Index = () => {
  const [oceanData, setOceanData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [level, setLevel] = useState("iniciante");
  const [explanation, setExplanation] = useState<string>("");

  const [selectedDayOcean, setSelectedDayOcean] = useState(0);
  const [selectedDayExplain, setSelectedDayExplain] = useState(0);

  const API_BASE = "https://explicasurf-backend.onrender.com";

  // === Buscar dados do mar ===
  useEffect(() => {
    const fetchOcean = async () => {
      const cacheKey = `${level}-${selectedDayOcean}`;

      if (forecastCache[cacheKey]) {
        setOceanData(forecastCache[cacheKey]);
        return;
      }

      try {
        setLoadingData(true);

        const res = await fetch(
          `${API_BASE}/api/explain?level=${level}&day=${selectedDayOcean}`
        );

        if (!res.ok) throw new Error("Falha ao buscar dados");

        const json = await res.json();
        forecastCache[cacheKey] = json;
        setOceanData(json);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados do oceano");
      } finally {
        setLoadingData(false);
      }
    };

    fetchOcean();
  }, [selectedDayOcean, level]);

  // === Gerar explicação IA ===
  const handleGenerateExplanation = async () => {
    try {
      setLoadingExplain(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Usuário não autenticado");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, stance, surf_level, experience_months")
        .eq("id", user.id)
        .single();

      const name = profileData?.name || "Surfista";
      const stance = profileData?.stance || "regular";
      const experience = profileData?.experience_months || 0;

      const res = await fetch(
        `${API_BASE}/api/explain?level=${level}&day=${selectedDayExplain}&ai=on` +
          `&name=${encodeURIComponent(name)}` +
          `&stance=${encodeURIComponent(stance)}` +
          `&experience_months=${encodeURIComponent(experience)}`
      );

      if (!res.ok) throw new Error("Falha ao gerar explicação");

      const json = await res.json();
      setExplanation(json.explanation_pt || "Erro ao gerar explicação.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar explicação com IA");
    } finally {
      setLoadingExplain(false);
    }
  };

  // === Interface ===
  return (
    <main className="flex flex-col gap-8 max-w-6xl mx-auto px-4 py-8">
      <Header />
      <Hero />

      {/* === SELETOR DE DIA PARA CONDIÇÕES DO MAR === */}
      <section className="text-center">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          🌊 Selecione o dia para ver as condições do mar
        </h2>

        <div className="flex gap-3 justify-center mb-4">
          {["Hoje", "Amanhã", "Depois"].map((label, index) => (
            <button
              key={label}
              onClick={() => setSelectedDayOcean(index)}
              className={`px-4 py-1 rounded-full border font-medium transition-all ${
                selectedDayOcean === index
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Card de condições */}
        {(() => {
          const cardData =
            selectedDayOcean === 0
              ? oceanData?.forecast_now
              : oceanData?.forecast_day;

          return (
            <OceanDataCard
              forecast={cardData || null}
              isLoading={loadingData}
            />
          );
        })()}
      </section>

      {/* === PAINEL DE PERSONALIZAÇÃO === */}
      <section className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 border border-blue-200 rounded-2xl p-6 shadow-md flex flex-col items-center gap-5 transition-all">
        <h2 className="text-xl font-semibold text-blue-800 text-center">
          🎚️ Personalize sua explicação
        </h2>

        <SkillLevelSelector level={level} onLevelChange={setLevel} />

        {/* Seletor de dia da explicação */}
        <div className="flex gap-3 justify-center mt-2">
          {["Hoje", "Amanhã", "Depois"].map((label, index) => (
            <button
              key={label}
              onClick={() => setSelectedDayExplain(index)}
              className={`px-4 py-1 rounded-full border font-medium transition-all ${
                selectedDayExplain === index
                  ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                  : "bg-white text-teal-700 border-teal-200 hover:bg-teal-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* === Único botão final === */}
        <button
          onClick={handleGenerateExplanation}
          disabled={loadingExplain}
          className="mt-3 px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-xl font-semibold shadow-md transition hover:scale-105 disabled:opacity-50"
        >
          {loadingExplain ? "Gerando explicação..." : "Gerar explicação com IA"}
        </button>
      </section>

      {/* === EXPLICAÇÃO === */}
      {explanation && (
        <ExplanationCard
          explanation={explanation}
          isLoading={loadingExplain}
        />
      )}

      {/* === GRÁFICOS === */}
      {oceanData?.forecast_day?.tide && (
        <TideChart
          data={(oceanData.forecast_day.tide.heights ?? []).map((h: any) => ({
            date: h.date,
            height: h.height,
          }))}
          currentHeight={oceanData.forecast_day.tide.now?.height_m ?? 0}
          extremes={oceanData.forecast_day.tide.extremes ?? []}
        />
      )}

      <WaveHeightChart
        data={(oceanData?.forecast_series ?? []).map((p: any) => ({
          time: p.time,
          wave_height_m: p.wave_height_m ?? 0,
          period_s: p.wave_period_s ?? 0,
        }))}
        isLoading={loadingData}
      />

      <WindChart
        data={(oceanData?.forecast_series ?? []).map((p: any) => ({
          time: p.time,
          wind_speed_kmh: p.wind_speed_kmh ?? 0,
          wind_wave_direction_deg:
            p.wind_dir_deg ?? p.wind_wave_direction_deg ?? undefined,
        }))}
        isLoading={loadingData}
      />

      <WeatherChart
        data={(oceanData?.forecast_series ?? []).map((p: any) => ({
          time: p.time,
          precip_probability: p.precip_probability,
          clouds: p.clouds,
          precip_mm: p.precip_mm,
          temp_c: p.temp_c,
        }))}
      />
    </main>
  );
};

export default Index;



