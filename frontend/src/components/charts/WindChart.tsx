import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
  ReferenceDot,
} from "recharts";
import { ArrowUp, Wind } from "lucide-react";
import dayjs from "dayjs";

type Point = {
  time: string;
  wind_speed_kmh?: number;
  wind_wave_direction_deg?: number;
};

interface Props {
  data: Point[];
  isLoading?: boolean;
}

const getColorBySpeed = (speed: number) => {
  if (speed < 10) return "#38bdf8"; // fraco
  if (speed < 20) return "#22c55e"; // moderado
  if (speed < 30) return "#facc15"; // forte
  if (speed < 40) return "#f97316"; // muito forte
  return "#ef4444"; // extremo
};

export default function WindChart({ data = [], isLoading = false }: Props) {
  if (isLoading)
    return <div className="p-4">Carregando dados de vento...</div>;

  if (!data || data.length === 0)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Sem dados de vento
      </div>
    );

  const sliced = data.slice(0, 72);
  const now = dayjs();
  const closest = sliced.reduce((prev, curr) =>
    Math.abs(dayjs(curr.time).diff(now)) <
    Math.abs(dayjs(prev.time).diff(now))
      ? curr
      : prev
  );

  // Estatísticas médias
  const avgSpeed =
    sliced.reduce((a, b) => a + (b.wind_speed_kmh ?? 0), 0) / sliced.length;
  const maxSpeed = Math.max(...sliced.map((d) => d.wind_speed_kmh ?? 0));

  return (
    <div className="rounded-2xl shadow-md bg-gradient-to-b from-sky-50 via-blue-50/60 to-white p-4 border border-blue-100">
      {/* === Cabeçalho === */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-600" />
            Vento de Superfície
          </h3>
          <p className="text-sm text-slate-600">
            Média {avgSpeed.toFixed(1)} km/h • Máx {maxSpeed.toFixed(1)} km/h
          </p>
        </div>
      </div>

      {/* === Gráfico === */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sliced}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />

          <XAxis
            dataKey="time"
            tickFormatter={(v) =>
              new Date(v).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
            tick={{ fill: "#334155", fontSize: 11 }}
            interval={5}
          />
          <YAxis
            label={{
              value: "Velocidade (km/h)",
              angle: -90,
              position: "insideLeft",
              fill: "#334155",
              fontSize: 12,
            }}
            tick={{ fill: "#334155", fontSize: 11 }}
            domain={[0, (max: number) => Math.ceil((max as number) * 1.2)]}
          />

          {/* Linha AGORA */}
          <ReferenceLine
            x={closest.time}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{
              value: "Agora",
              position: "top",
              fill: "#ef4444",
              fontSize: 12,
            }}
          />

          {/* Ponto AGORA */}
          <ReferenceDot
            x={closest.time}
            y={closest.wind_speed_kmh}
            r={5}
            fill="#facc15"
            stroke="#eab308"
            label={{
              value: `${closest.wind_speed_kmh?.toFixed(1)} km/h`,
              position: "top",
              fill: "#b45309",
              fontSize: 11,
            }}
          />

          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
            formatter={(value: any) => `${value?.toFixed?.(1) || value} km/h`}
            labelFormatter={(label) =>
              new Date(label).toLocaleString("pt-BR", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />

          <Bar
            dataKey="wind_speed_kmh"
            radius={[4, 4, 0, 0]}
            animationDuration={900}
          >
            {sliced.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorBySpeed(entry.wind_speed_kmh ?? 0)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* === Setas de direção === */}
      <div className="flex justify-around mt-4 flex-wrap gap-2">
        {sliced.slice(0, 16).map((p, i) => (
          <div
            key={i}
            className="flex flex-col items-center w-8 text-[10px] text-slate-600"
          >
            <div
              className="transition-transform duration-700"
              style={{
                transform: `rotate(${p.wind_wave_direction_deg ?? 0}deg)`,
              }}
            >
              <ArrowUp className="w-4 h-4 text-slate-700 opacity-80" />
            </div>
            <span className="mt-1">
              {new Date(p.time).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      {/* === Legenda === */}
      <div className="flex justify-center flex-wrap gap-3 mt-4 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#38bdf8]" /> Fraco
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#22c55e]" /> Moderado
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#facc15]" /> Forte
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#f97316]" /> Muito forte
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#ef4444]" /> Extremo
        </span>
      </div>
    </div>
  );
}
