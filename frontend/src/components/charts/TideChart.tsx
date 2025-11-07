import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine,
  ReferenceDot,
  CartesianGrid,
} from "recharts";
import { Sun, Moon, Waves } from "lucide-react";

interface TidePoint {
  date: string;
  height: number;
}

interface TideExtreme {
  date: string;
  height: number;
  type: "High" | "Low";
}

interface TideChartProps {
  data: TidePoint[];
  currentHeight?: number;
  extremes?: TideExtreme[];
}

const TideChart = ({ data, currentHeight, extremes }: TideChartProps) => {
  // === Utilitários ===
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDayHour = (d: string) =>
    new Date(d).toLocaleString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const uniqueDays = Array.from(
    new Set(data.map((p) => new Date(p.date).toDateString()))
  );

  // === Cálculo da tendência da maré (enchendo ou vazando) ===
  let tideTrend: "enchendo" | "vazando" | null = null;
  if (data.length > 2 && typeof currentHeight === "number") {
    const closestIndex = data.findIndex(
      (p) => Math.abs(new Date(p.date).getTime() - Date.now()) < 3600000
    );
    if (closestIndex > 0 && closestIndex < data.length - 1) {
      const prev = data[closestIndex - 1]?.height;
      const next = data[closestIndex + 1]?.height;
      if (prev !== undefined && next !== undefined) {
        tideTrend = next > prev ? "enchendo" : "vazando";
      }
    }
  }

  // === Ícones de sol e lua ===
  const sunTimes = [
    { time: "06:00", icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { time: "18:00", icon: <Moon className="w-4 h-4 text-indigo-500" /> },
  ];

  // === Cor e texto da tendência ===
  const trendColor = tideTrend === "enchendo" ? "#38bdf8" : "#0ea5e9";
  const trendText =
    tideTrend === "enchendo"
      ? "Maré subindo (enchente)"
      : tideTrend === "vazando"
      ? "Maré descendo (vazante)"
      : "Sem dados de tendência";

  return (
    <div className="rounded-2xl shadow-md bg-gradient-to-b from-sky-50 via-blue-50/60 to-white p-4 border border-blue-100">
      {/* === Cabeçalho === */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Maré
          </h3>
          <p className="text-sm text-slate-600">
            Altura e picos diários — {trendText}
          </p>
        </div>
      </div>

      {/* === Gráfico === */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />

          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleString("pt-BR", {
                weekday: "short",
                hour: "2-digit",
              })
            }
            tick={{ fill: "#334155", fontSize: 11 }}
            minTickGap={28}
          />
          <YAxis
            tick={{ fill: "#334155", fontSize: 12 }}
            domain={["auto", "auto"]}
            label={{
              value: "Altura (m)",
              angle: -90,
              position: "insideLeft",
              fill: "#334155",
              fontSize: 13,
            }}
          />

          <Area
            type="monotone"
            dataKey="height"
            stroke={trendColor}
            strokeWidth={0}
            fill="url(#tideFill)"
          />
          <Line
            type="monotone"
            dataKey="height"
            stroke={trendColor}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={true}
          />

          {/* Maré agora */}
          {typeof currentHeight === "number" && (
            <ReferenceLine
              y={currentHeight}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                position: "right",
                value: `Maré agora: ${currentHeight.toFixed(2)} m`,
                fill: "#ef4444",
                fontSize: 12,
              }}
            />
          )}

          {/* Separação de dias */}
          {uniqueDays.slice(1).map((day, i) => (
            <ReferenceLine
              key={`day-${day}-${i}`}
              x={
                data.find(
                  (p) => new Date(p.date).toDateString() === day
                )?.date || ""
              }
              stroke="#94a3b8"
              strokeDasharray="3 3"
              label={{
                value: new Date(day).toLocaleDateString("pt-BR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                }),
                position: "top",
                fill: "#475569",
                fontSize: 11,
              }}
            />
          ))}

          {/* Cheia / Seca */}
          {extremes?.map((e, i) => (
            <ReferenceDot
              key={`extreme-${e.date}-${i}`}
              x={e.date}
              y={e.height}
              r={5}
              fill={e.type === "High" ? "#1e3a8a" : "#0ea5e9"}
              stroke="white"
              label={{
                value: `${
                  e.type === "High" ? "⬆" : "⬇"
                } ${e.height.toFixed(1)} m • ${formatTime(e.date)}`,
                position: e.type === "High" ? "top" : "bottom",
                fill: "#1e3a8a",
                fontSize: 11,
                offset: 10,
              }}
            />
          ))}

          <Tooltip
            formatter={(v: number) => `${v.toFixed(2)} m`}
            labelFormatter={(d) => formatDayHour(d)}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* === Legenda e ícones === */}
      <div className="flex justify-around mt-3 text-sm text-slate-700 font-semibold">
        {uniqueDays.map((day, i) => (
          <div key={`legend-${day}-${i}`} className="flex flex-col items-center gap-1">
            <span className="uppercase">
              {new Date(day).toLocaleDateString("pt-BR", { weekday: "long" })}
            </span>
            <span className="text-slate-500">
              {new Date(day).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500">
        {sunTimes.map((s, i) => (
          <div key={`sun-${s.time}-${i}`} className="flex items-center gap-1">
            {s.icon}
            <span>{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TideChart;
