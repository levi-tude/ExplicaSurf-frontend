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
  forecast: Forecast | null;   // <- deve vir de forecast_day OU forecast_now
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

  // ================================
  // Desestruturação
  // ================================
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
    precip_mm,
    precip_probability,
    clouds,
    temp_c,
    tide,
  } = forecast;

  // período compatível
  const periodo =
    typeof wave_period_s === "number"
      ? wave_period_s
      : typeof period_s === "number"
      ? period_s
      : null;

  // direção compatível
  const direcaoSwell =
    typeof wave_direction_deg === "number"
      ? wave_direction_deg
      : typeof wave_dir_deg === "number"
      ? wave_dir_deg
      : null;

  // ================================
  // Ícone do céu
  // ================================
  const getSkyIcon = () => {
    if (typeof precip_probability === "number" && precip_probability >= 70)
      return "🌧️";
    if (typeof clouds === "number" && clouds >= 70) return "☁️";
    if (typeof clouds === "number" && clouds >= 40) return "⛅";
    if (typeof clouds === "number" && clouds >= 10) return "🌤️";
    return "☀️";
  };

  const skyIcon = getSkyIcon();

  // ================================
  // Próxima maré
  // ================================
  let tideNextText = "--";

  const nextType = tide?.next_extreme?.type;
  const nextDate = tide?.next_extreme?.date;

  if (nextType && nextDate) {
    let hora = "--";
    try {
      hora = new Date(nextDate).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {}

    if (nextType.toLowerCase() === "high") {
      tideNextText = `Maré toda cheia às ${hora}`;
    } else if (nextType.toLowerCase() === "low") {
      tideNextText = `Maré toda seca às ${hora}`;
    }
  }

  // ================================
  // Render
  // ================================
  return (
    <div className="rounded-2xl border border-border p-4">
      <h3 className="text-lg font-semibold mb-2">🌊 Condições do Mar & Tempo</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        
        {/* Temperatura */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Temperatura</span>
          <span className="text-base font-medium">
            {typeof temp_c === "number" ? `${temp_c.toFixed(1)}°C` : "--"}
          </span>
        </div>

        {/* Condição do Céu */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Condição do Céu</span>
          <span className="text-base font-medium">
            {skyIcon} {typeof clouds === "number" ? `${clouds}%` : "--"}
          </span>
        </div>

        {/* Chance de chuva */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Chance de Chuva</span>
          <span className="text-base font-medium">
            {typeof precip_probability === "number"
              ? `${precip_probability}%`
              : "--"}
          </span>
        </div>

        {/* Precipitação */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Precipitação</span>
          <span className="text-base font-medium">
            {typeof precip_mm === "number" ? `${precip_mm.toFixed(1)} mm` : "--"}
          </span>
        </div>

        {/* Altura das ondas */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Altura das Ondas</span>
          <span className="text-base font-medium">
            {typeof wave_height_m === "number"
              ? `${wave_height_m.toFixed(1)} m`
              : "--"}
          </span>
        </div>

        {/* Período */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Período</span>
          <span className="text-base font-medium">
            {periodo != null ? `${periodo.toFixed(1)} s` : "--"}
          </span>
        </div>

        {/* Direção do swell */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Direção do Swell</span>
          <span className="text-base font-medium">
            {direcaoSwell != null ? `${Math.round(direcaoSwell)}°` : "--"}
          </span>
        </div>

        {/* Vento */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Vento</span>
          <span className="text-base font-medium">
            {typeof wind_speed_kmh === "number"
              ? `${wind_speed_kmh.toFixed(1)} km/h`
              : "--"}{" "}
            {typeof wind_dir_deg === "number"
              ? `@ ${Math.round(wind_dir_deg)}°`
              : ""}
          </span>
        </div>

        {/* Energia */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Energia</span>
          <span className="text-base font-medium">
            {energy != null ? `${energy} (${energy_level})` : "--"}
          </span>
        </div>

        {/* Maré agora */}
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">Maré Agora</span>
          <span className="text-base font-medium">
            {typeof tide?.now?.height_m === "number"
              ? `${tide.now.height_m.toFixed(2)} m`
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


