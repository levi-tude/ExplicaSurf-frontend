import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import React from "react";

interface Props {
  data: {
    time: string;
    precip_probability: number;
    clouds: number;
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
          background: "white",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          fontSize: "13px",
        }}
      >
        <strong>{label}</strong>
        <br />
        🌧 Chuva: {chuva?.value.toFixed(0)}%
        <br />
        ☁️ Nuvens: {nuvens?.value.toFixed(0)}%
      </div>
    );
  }
  return null;
};

const WeatherChart: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (!data?.length) {
    return <div className="p-4">Sem dados climáticos.</div>;
  }

  // -------------------------------
  // 1. Reformata o dataset
  // -------------------------------
  const formatted = data.map((d) => {
    const dt = new Date(d.time);
    return {
      ...d,
      hour: dt.getHours().toString().padStart(2, "0") + "h",
      date: dt.getDate() + "/" + (dt.getMonth() + 1),
      dayKey: dt.getDate(), // separação sólida
    };
  });

  const days = [...new Set(formatted.map((d) => d.dayKey))];

  // Mapear cada início de dia no gráfico
  const dayBoundaries = days.map((day) => {
    const first = formatted.find((d) => d.dayKey === day);
    return { label: first?.hour, date: first?.date };
  });

  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">🌦️ Clima (por horário)</h3>
      <p className="text-muted-foreground text-sm mb-3">
        Chance de chuva (%) e cobertura de nuvens (%).
      </p>

      <ResponsiveContainer width="100%" height={330}>
        <LineChart data={formatted} margin={{ top: 40, right: 25, left: 0 }}>

          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />

          {/* ===============================
              2. FAIXAS DE FUNDO POR DIA
              =============================== */}
          {days.map((day, idx) => {
            const f = formatted.findIndex((d) => d.dayKey === day);
            const l = formatted.map((d) => d.dayKey).lastIndexOf(day);

            return (
              <ReferenceArea
                key={day}
                x1={formatted[f].hour}
                x2={formatted[l].hour}
                fill={idx % 2 === 0 ? "#f5f9ff" : "#fafcff"}
                opacity={0.9}
              />
            );
          })}

          {/* ===============================
              3. TÍTULOS (rótulo grande do dia)
              =============================== */}
          {dayBoundaries.map((d, i) => (
            <text
              key={i}
              x={0}
              y={20 + i * 0} // alinhado
              fill="#444"
              fontSize={13}
              fontWeight="600"
            >
              📅 {d.date}
            </text>
          ))}

          {/* ===============================
              4. LINHAS VERTICAIS PARA "INÍCIO DO DIA"
              =============================== */}
          {dayBoundaries.map((d, i) => (
            <ReferenceLine
              key={i}
              x={d.label}
              stroke="#bbb"
              strokeDasharray="4 4"
            />
          ))}

          <XAxis
            dataKey="hour"
            tick={{ fontSize: 12 }}
            interval={3} // somente horários principais
            height={30}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            width={30}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend />

          <Line
            type="monotone"
            dataKey="precip_probability"
            stroke="#0A66FF"
            name="Chuva (%)"
            strokeWidth={2.3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="clouds"
            stroke="#FF9900"
            name="Nuvens (%)"
            strokeWidth={2.3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;


export default WeatherChart;


