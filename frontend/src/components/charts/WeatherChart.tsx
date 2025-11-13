import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

interface Props {
  data: {
    time: string;
    precip_probability: number;
    clouds: number;
    temp_c?: number;
    precip_mm?: number;
  }[];
}

const WeatherChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map((p) => ({
    time: new Date(p.time).getHours() + "h",
    precip_probability: p.precip_probability ?? 0,
    clouds: p.clouds ?? 0,
    precip_mm: p.precip_mm ?? 0,
    temp_c: p.temp_c ?? null,
  }));

  return (
    <div className="rounded-2xl border border-border p-4">
      <h3 className="text-lg font-semibold mb-2">🌦️ Chance de Chuva & Céu</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          {/* Gradiente do céu */}
          <defs>
            <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#66b3ff" stopOpacity={0.7} />
              <stop offset="50%" stopColor="#4d88ff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="clouds"
            stroke="none"
            fill="url(#cloudGradient)"
            opacity={0.35}
          />

          <Line
            type="monotone"
            dataKey="precip_probability"
            stroke="#0077ff"
            strokeWidth={2}
            dot={false}
          />

          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />

          <Tooltip
            formatter={(value, name) => {
              if (name === "precip_probability") return [`${value}%`, "Chance de Chuva"];
              if (name === "clouds") return [`${value}%`, "Nuvens"];
              return value;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
