import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
  CartesianGrid,
  Defs,
  LinearGradient,
  Stop,
} from "recharts";
import React from "react";

interface Props {
  data: {
    time: string;
    precip_probability: number;
    clouds: number;
    temp_c?: number;
  }[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    const chuva = payload.find((p: any) => p.dataKey === "precip_probability");
    const nuvens = payload.find((p: any) => p.dataKey === "clouds");

    return (
      <div
        style={{
          background: "rgba(255,255,255,0.9)",
          padding: "10px 14px",
          borderRadius: "12px",
          backdropFilter: "blur(6px)",
          border: "1px solid #e6e6e6",
          fontSize: "13px",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>

        {chuva && (
          <div style={{ color: "#0A66FF", marginBottom: 4 }}>
            🌧 Chuva: <strong>{chuva.value.toFixed(0)}%</strong>
          </div>
        )}

        {nuvens && (
          <div style={{ color: "#F59E0B" }}>
            ☁️ Nuvens: <strong>{nuvens.value.toFixed(0)}%</strong>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const WeatherChart: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border p-4">
        <p className="text-muted-foreground">Carregando gráfico de clima...</p>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-2xl border p-4">
        <p className="text-muted-foreground">Sem dados climáticos.</p>
      </div>
    );
  }

  const formatted = data.map((d) => {
    const dateObj = new Date(d.time);
    return {
      ...d,
      hour: dateObj.getHours(), // para reduzir rótulos
      label:
        dateObj.getDate() +
        "/" +
        (dateObj.getMonth() + 1) +
        " • " +
        dateObj.getHours().toString().padStart(2, "0") +
        "h",
      day: dateObj.getDate(),
    };
  });

  const uniqueDays = [...new Set(formatted.map((d) => d.day))];

  return (
    <div className="rounded-2xl border border-border p-6 shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-2">🌦️ Clima (por horário)</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Chance de chuva e cobertura de nuvens ao longo do dia.
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={formatted} margin={{ top: 30, right: 25, bottom: 10 }}>
          {/* === Suaves divisões entre dias === */}
          {uniqueDays.map((day, i) => {
            const f = formatted.findIndex((x) => x.day === day);
            const l = formatted.map((x) => x.day).lastIndexOf(day);

            return (
              <ReferenceArea
                key={day}
                x1={formatted[f].label}
                x2={formatted[l].label}
                fill={i % 2 === 0 ? "#f7faff" : "#fdfdfd"}
                opacity={0.6}
              />
            );
          })}

          {/* Grade mais leve */}
          <CartesianGrid stroke="#e9e9e9" strokeDasharray="3 3" opacity={0.6} />

          {/* Gradiente das linhas */}
          <Defs>
            <LinearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#0A66FF" stopOpacity={0.25} />
              <Stop offset="100%" stopColor="#0A66FF" stopOpacity={0} />
            </LinearGradient>

            <LinearGradient id="cloudFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
            </LinearGradient>
          </Defs>

          <XAxis
            dataKey="label"
            interval={5} // reduz rótulos
            tick={{ fontSize: 11 }}
            height={40}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            width={30}
            label={{
              value: "%",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            iconSize={14}
            formatter={(value: string) =>
              value === "precip_probability"
                ? "Chance de Chuva"
                : "Cobertura de Nuvens"
            }
          />

          {/* 🌧 Linha de chuva */}
          <Line
            type="monotoneX"
            dataKey="precip_probability"
            stroke="#0A66FF"
            strokeWidth={2.3}
            dot={{ r: 2, fill: "#0A66FF" }}
            fill="url(#rainFill)"
          />

          {/* ☁️ Linha de nuvens */}
          <Line
            type="monotoneX"
            dataKey="clouds"
            stroke="#F59E0B"
            strokeWidth={2.3}
            dot={{ r: 2, fill: "#F59E0B" }}
            fill="url(#cloudFill)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;

