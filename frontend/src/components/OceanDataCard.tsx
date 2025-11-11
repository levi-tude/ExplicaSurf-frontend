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

  // 🌧️ NOVOS CAMPOS DE CLIMA
  precip_mm?: number | null;
  precip_probability?: number | null;
  clouds?: number | null;
  temp_c?: number | null;

  tide?: {
    now?: {
      time?: string;
      height_m?: number;
    };
    next_extreme?: {
      date?: string;
      height?: number;
      type?: "High" | "Low" | "high" | "low";
    };
  } | null;
}

interface Props {
  forecast: Forecast | null;
  isLoading: boolean;
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

  // ===================== DADOS =====================
  const {
    wave_height_m,
    period_s,
    wave_period_s,
    wave_dir_deg,
    wave_direction_deg,
    wind_speed_kmh,
    wind_dir_deg,
    energy,
    energy_level,

    // 🌧️ CLIMA
    precip_mm,
    precip_probability,
    clouds,
    temp_c,
  } = forecast;

  const periodo = wave_period_s ?? period_s ?? null;
  const direcaoSwell = wave_direction_deg ?? wave_dir_deg ?? null;

  // ===================== STATUS DO CÉU =====================
  const getSkyIcon = () => {
    if (precip_probability && precip_probability >= 70) return "🌧️";
    if (clouds && clouds >= 70) return "☁️";
    if (clouds && clouds >= 40) return "⛅";
    if (clouds && clouds >= 10) return "🌤️";
    return "☀️";
  };

  const skyIcon = getSkyIcon();

  // ===================== PRÓXIMA MARÉ =====================
  let tideNextText = "--";
  const nextType = forecast?.tide?.next_extreme?.type;
  const nextDate = forecast?.tide?.next_extreme?.date;

  if (nextType && nextDate) {
    const hora = new Date(nextDate).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (nextType.toLowerCase() === "high") {
      tideNextText = `Maré toda cheia às ${hora}`;
    } else if (nextType.toLowerCase() === "low") {
      tideNextText = `Maré toda seca às ${hora}`;
    }
  }

  // ===================== RENDER =====================
  return (
    <div className="rounded-2xl border border-border p-4">
      <h3 className="text-lg font-semibold mb-2">🌊 Condições do Mar & Tempo</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {/* 🌡️ Temperatura */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Temperatura</span>
          <span className="text-base font-medium">
            {temp_c != null ? `${temp_c.toFixed(1)}°C` : "--"}
          </span>
        </div>

        {/* ☁️ Céu */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Condição do Céu</span>
          <span className="text-base font-medium">
            {skyIcon} {clouds != null ? `${clouds}%` : "--"}
          </span>
        </div>

        {/* 🌧️ Chance de chuva */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Chance de Chuva</span>
          <span className="text-base font-medium">
            {precip_probability != null ? `${precip_probability}%` : "--"}
          </span>
        </div>

        {/* 🌧️ Precipitação */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Precipitação</span>
          <span className="text-base font-medium">
            {precip_mm != null ? `${precip_mm.toFixed(1)} mm` : "--"}
          </span>
        </div>

        {/* 🌊 Altura das Ondas */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Altura das Ondas</span>
          <span className="text-base font-medium">
            {wave_height_m != null ? `${wave_height_m.toFixed(1)} m` : "--"}
          </span>
        </div>

        {/* 🕒 Período */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Período</span>
          <span className="text-base font-medium">
            {periodo != null ? `${periodo.toFixed(1)} s` : "--"}
          </span>
        </div>

        {/* 🌊 Direção do Swell */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Direção do Swell</span>
          <span className="text-base font-medium">
            {direcaoSwell != null ? `${Number(direcaoSwell).toFixed(0)}°` : "--"}
          </span>
        </div>

        {/* 💨 Vento */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Vento</span>
          <span className="text-base font-medium">
            {wind_speed_kmh != null ? `${wind_speed_kmh.toFixed(1)} km/h` : "--"}
            {wind_dir_deg != null ? ` @ ${wind_dir_deg}°` : ""}
          </span>
        </div>

        {/* ⚡ Energia */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Energia</span>
          <span className="text-base font-medium">
            {energy != null ? `${Number(energy).toFixed(1)} (${energy_level})` : "--"}
          </span>
        </div>

        {/* 🌊 Maré Agora */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Maré Agora</span>
          <span className="text-base font-medium">
            {forecast?.tide?.now?.height_m != null
              ? `${forecast.tide.now.height_m.toFixed(2)} m`
              : "--"}
          </span>
        </div>

        {/* Próxima Maré */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Próxima Maré</span>
          <span className="text-base font-medium">{tideNextText}</span>
        </div>
      </div>
    </div>
  );
};

export default OceanDataCard;

};

export default OceanDataCard;
