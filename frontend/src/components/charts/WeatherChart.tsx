import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
} from "recharts";
import React from "react";

interface Props {
  data: {
    time: string;
    precip_probability: number;
    clouds: number;
    temp_c?: number;
  }[];
  dayOffset: number;
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const chuva = payload.find((p: any) => p.dataKey === "precip_probability");
    const nuvens = payload.find((p: any) => p.dataKey === "clouds");

    return (
      <div
        style={{
          background: "white",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          fontSize: "13px",
        }}
      >
        <div style={{ marginBottom: 6, fontWeight: 600, color: "#333" }}>
          {label}
        </div>

        {chuva && (
          <div style={{ color: "#0077ff", marginBottom: 4 }}>
            🌧️ <strong>Chuva:</strong> {chuva.value.toFixed(0)}%
          </div>
        )}

        {nuvens && (
          <div style={{ color: "#ff9900" }}>
            ☁️ <strong>Nuvens:</strong> {nuvens.value.toFixed(0)}%
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
      <div className="rounded-2xl border border-border p-4">
        <p className="text-muted-foreground">Carregando gráfico de clima...</p>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-border p-4">
        <p className="text-muted-foreground">Sem dados climáticos disponíveis.</p>
      </div>
    );
  }

  // 🔹 Formatar rótulos para exibir data + hora
  const formatted = data.map((d) => {
    const dateObj = new Date(d.time);
    const hour = dateObj.getHours().toString().padStart(2, "0") + "h";
    const label = `${dateObj.getDate()}/${dateObj.getMonth() + 1} • ${hour}`;

    return {
      ...d,
      label,
      dayDate: dateObj.getDate(),
    };
  });

  // 🔹 Separar dias com faixas visuais
  const uniqueDays = [...new Set(formatted.map((d) => d.dayDate))];

  return (
    <div className="rounded-2xl border border-border p-4">
      <h3 className="text-lg font-semibold mb-2">🌦️ Clima (por horário)</h3>

      <p className="text-muted-foreground text-sm mb-3">
        O gráfico mostra chance de chuva (%) e cobertura de nuvens (%).
        Cada dia está destacado com uma faixa de cor clara.
      </p>

      <ResponsiveContainer width="100%" height={330}>
        <LineChart
          data={formatted}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          {/* === Faixas que marcam cada dia === */}
          {uniqueDays.map((day, i) => {
            const firstIndex = formatted.findIndex((d) => d.dayDate === day);
            const lastIndex = formatted
              .map((d) => d.dayDate)
              .lastIndexOf(day);

            return (
              <ReferenceArea
                key={day}
                x1={formatted[firstIndex].label}
                x2={formatted[lastIndex].label}
                fill={i % 2 === 0 ? "#eef7ff" : "#f7faff"}
                opacity={0.55}
              />
            );
          })}

          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            interval={3}
            height={40}
            label={{
              value: "Horários do dia",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            label={{
              value: "%",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* 🌧️ CHANCE DE CHUVA */}
          <Line
            type="monotone"
            dataKey="precip_probability"
            stroke="#0077ff"
            name="Chance de Chuva (%)"
            strokeWidth={2.3}
            dot={false}
          />

          {/* ☁️ NUVENS */}
          <Line
            type="monotone"
            dataKey="clouds"
            stroke="#ff9900"
            name="Cobertura de Nuvens (%)"
            strokeWidth={2.3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;

