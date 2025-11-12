import React from "react";

interface Forecast {
  wave_height_m: number | null;
  wave_period_s?: number | null;
  period_s?: number | null;
  wave_dir_deg?: number | null;
  wave_direction_deg?: number | null;

  wind_speed_kmh: number | null;
  wind_dir_deg: number | null;

  energy: number | null;
  energy_level: string | null;

  precip_mm?: number | null;
  precip_probability?: number | null;
  clouds?: number | null;
  temp_c?: number | null;

  tide?: {
    now?: { time?: string; height_m?: number };
    next_extreme?: { date?: string; height?: number; type?: string };
  } | null;
}

interface Props {
  forecast: Forecast | null;
  isLoading: boolean;
}

const OceanDataCard: React.FC<Props> = ({ forecast, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border p-4 text-center">
        <p className="text-muted-foreground">Carregando condições do mar...</p>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="rounded-2xl border border-border p-4 text-center">
        <p className="text-muted-foreground">
          Sem dados disponíveis no momento.
        </p>
      </div>
    );
  }

  // Desestruturação segura
  const {
    wave_height_m,
    wave_period_s,
    period_s,
    wave_dir_deg,
    wave_direction_deg,
    wind_speed_kmh,
    wind_dir_deg,
    energy,
    energy_level,
    precip_mm,
    precip_probability,
    clouds,
    temp_c,
    tide,
  } = forecast;

  // Usa o campo disponível (alguns dias vêm com "wave_period_s", outros "period_s")
  const periodo =
    typeof wave_period_s === "number"
      ? wave_period_s
      : typeof period_s === "number"
      ? period_s
      : null;

  const direcaoSwell =
    typeof wave_direction_deg === "number"
      ? wave_direction_deg
      : typeof wave_dir_deg === "number"
      ? wave_dir_deg
      : null;

  // === CÉU ===
  const getSkyIcon = () => {
    if (typeof precip_probability === "number" && precip_probability >= 70)
      return "🌧️";
    if (typeof clouds === "number" && clouds >= 70) return "☁️";
    if (typeof clouds === "number" && clouds >= 40) return "⛅";
    if (typeof clouds === "number" && clouds >= 10) return "🌤️";
    return "☀️";
  };

  const skyIcon = getSkyIcon();

  // === PRÓXIMA MARÉ ===
  let tideNextText = "--";
  const nextType = tide?.next_extreme?.type;
  const nextDate = tide?.next_extreme?.date;

  if (nextType && nextDate) {
    try {
      const hora = new Date(nextDate).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      tideNextText =
        nextType.toLowerCase() === "high"
          ? `Maré toda cheia às ${hora}`
          : `Maré toda seca às ${hora}`;
    } catch {
      tideNextText = "--";
    }
  }

  return (
    <div className="rounded-2xl border border-border p-4 bg-white/70 backdrop-blur-sm shadow-sm transition-all">
      <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2 justify-center">
        🌊 Condições do Mar & Tempo
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        {/* 🌡️ Temperatura */}
        <div>
          <p className="text-muted-foreground text-sm">Temperatura</p>
          <p className="text-base font-medium">
            {typeof temp_c === "number" ? `${temp_c.toFixed(1)}°C` : "--"}
          </p>
        </div>

        {/* 🌥️ Céu */}
        <div>
          <p className="text-muted-foreground text-sm">Condição do Céu</p>
          <p className="text-base font-medium">
            {skyIcon} {typeof clouds === "number" ? `${clouds}%` : "--"}
          </p>
        </div>

        {/* 🌧️ Chance de chuva */}
        <div>
          <p className="text-muted-foreground text-sm">Chance de Chuva</p>
          <p className="text-base font-medium">
            {typeof precip_probability === "number"
              ? `${precip_probability}%`
              : "--"}
          </p>
        </div>

        {/* 🌦️ Precipitação */}
        <div>
          <p className="text-muted-foreground text-sm">Precipitação</p>
          <p className="text-base font-medium">
            {typeof precip_mm === "number"
              ? `${precip_mm.toFixed(1)} mm`
              : "--"}
          </p>
        </div>

        {/* 🌊 Altura das ondas */}
        <div>
          <p className="text-muted-foreground text-sm">Altura das Ondas</p>
          <p className="text-base font-medium">
            {typeof wave_height_m === "number"
              ? `${wave_height_m.toFixed(1)} m`
              : "--"}
          </p>
        </div>

        {/* 🔁 Período */}
        <div>
          <p className="text-muted-foreground text-sm">Período</p>
          <p className="text-base font-medium">
            {periodo != null ? `${periodo.toFixed(1)} s` : "--"}
          </p>
        </div>

        {/* 🧭 Direção do swell */}
        <div>
          <p className="text-muted-foreground text-sm">Direção do Swell</p>
          <p className="text-base font-medium">
            {direcaoSwell != null ? `${Math.round(direcaoSwell)}°` : "--"}
          </p>
        </div>

        {/* 💨 Vento */}
        <div>
          <p className="text-muted-foreground text-sm">Vento</p>
          <p className="text-base font-medium">
            {typeof wind_speed_kmh === "number"
              ? `${wind_speed_kmh.toFixed(1)} km/h`
              : "--"}
            {typeof wind_dir_deg === "number"
              ? ` @ ${Math.round(wind_dir_deg)}°`
              : ""}
          </p>
        </div>

        {/* ⚡ Energia */}
        <div>
          <p className="text-muted-foreground text-sm">Energia</p>
          <p className="text-base font-medium">
            {energy != null ? `${energy} (${energy_level})` : "--"}
          </p>
        </div>

        {/* 🌊 Maré agora */}
        <div>
          <p className="text-muted-foreground text-sm">Maré Agora</p>
          <p className="text-base font-medium">
            {typeof tide?.now?.height_m === "number"
              ? `${tide.now.height_m.toFixed(2)} m`
              : "--"}
          </p>
        </div>

        {/* 🌊 Próxima maré */}
        <div>
          <p className="text-muted-foreground text-sm">Próxima Maré</p>
          <p className="text-base font-medium">{tideNextText}</p>
        </div>
      </div>
    </div>
  );
};

export default OceanDataCard;


