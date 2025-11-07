import React from "react";

interface Forecast {
  wave_height_m: number | null;
  period_s?: number | null;
  wave_period_s?: number | null;
  wave_dir_deg?: number | null;
  wave_direction_deg?: number | null;
  wind_speed_kmh: number | null;
  wind_dir_deg: number | null;
  energy: number | null;
  energy_level: string | null;
  tide?: {
    now?: {
      height_m?: number;
    };
    next_extreme?: {
      date?: string;
      type?: "High" | "Low" | "high" | "low";
    };
  } | null;
}

interface Props {
  forecast: Forecast | null;
  isLoading: boolean;
}

/* ✅ Conversão correta para português */
function degToCardinalBR(deg: number | null | undefined): string {
  if (deg === null || deg === undefined) return "--";

  const direcoes = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(deg / 45) % 8;

  return direcoes[index];
}

const OceanDataCard: React.FC<Props> = ({ forecast, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border p-4">
        <p className="text-muted-foreground">Carregando condições do mar...</p>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="rounded-2xl border border-border p-4">
        <p className="text-muted-foreground">Sem dados disponíveis no momento.</p>
      </div>
    );
  }

  // ✅ Correções importantes
  const periodo = forecast.wave_period_s ?? forecast.period_s ?? null;
  const direcaoSwell =
    forecast.wave_direction_deg ?? forecast.wave_dir_deg ?? null;

  const direcaoSwellCardinal = degToCardinalBR(direcaoSwell);
  const direcaoVentoCardinal = degToCardinalBR(forecast.wind_dir_deg);

  // ✅ Próxima maré
  let tideNextText = "--";
  const next = forecast.tide?.next_extreme;

  if (next?.date && next?.type) {
    const hora = new Date(next.date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    tideNextText =
      next.type.toLowerCase() === "high"
        ? `Maré toda cheia às ${hora}`
        : `Maré toda seca às ${hora}`;
  }

  return (
    <div className="rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">🌊 Condições do Mar</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        {/* ✅ Altura das Ondas */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Altura das Ondas</span>
          <span className="text-base font-semibold">
            {forecast.wave_height_m != null
              ? `${forecast.wave_height_m.toFixed(1)} m`
              : "--"}
          </span>
        </div>

        {/* ✅ Período */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Período</span>
          <span className="text-base font-semibold">
            {periodo != null ? `${periodo.toFixed(1)} s` : "--"}
          </span>
        </div>

        {/* ✅ Direção do Swell */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Direção do Swell</span>
          <span className="text-base font-semibold">
            {direcaoSwell != null
              ? `${direcaoSwellCardinal} (${direcaoSwell.toFixed(0)}°)`
              : "--"}
          </span>
        </div>

        {/* ✅ Vento (separado e limpo) */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Vento</span>
          <span className="text-base font-semibold">
            {forecast.wind_speed_kmh != null
              ? `${forecast.wind_speed_kmh.toFixed(1)} km/h`
              : "--"}
            {forecast.wind_dir_deg != null &&
              ` • ${direcaoVentoCardinal} (${forecast.wind_dir_deg.toFixed(0)}°)`}
          </span>
        </div>

        {/* ✅ Maré Agora */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Maré Agora</span>
          <span className="text-base font-semibold">
            {forecast.tide?.now?.height_m != null
              ? `${forecast.tide.now.height_m.toFixed(2)} m`
              : "--"}
          </span>
        </div>

        {/* ✅ Próxima Maré */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Próxima Maré</span>
          <span className="text-base font-semibold">{tideNextText}</span>
        </div>
      </div>
    </div>
  );
};

export default OceanDataCard;
