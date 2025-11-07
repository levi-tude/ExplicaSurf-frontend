import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";

interface ForecastPoint {
  time: string;
  wave_height_m: number;
  period_s: number;
}

interface WaveHeightChartProps {
  data: ForecastPoint[];
  isLoading?: boolean;
}

const getColorByPeriod = (period: number) => {
  if (period < 6) return "#06b6d4"; // ciano
  if (period < 8) return "#22c55e"; // verde
  if (period < 10) return "#facc15"; // amarelo
  if (period < 12) return "#f97316"; // laranja
  if (period < 14) return "#ef4444"; // vermelho
  if (period < 16) return "#a855f7"; // roxo
  return "#7e22ce"; // roxo escuro
};

const WaveHeightChart = ({ data = [], isLoading = false }: WaveHeightChartProps) => {
  if (isLoading) return <div className="p-4">Carregando dados de ondas...</div>;

  if (!data || data.length === 0)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Sem dados de ondas
      </div>
    );

  // === Filtra e formata dados ===
  const formattedData = (data ?? [])
    .filter((d) => d?.time && typeof d.wave_height_m === "number")
    .map((d) => ({
      time: d.time,
      label: new Date(d.time).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      height: d.wave_height_m,
      period: d.period_s,
      fill: getColorByPeriod(d.period_s),
    }));

  if (formattedData.length === 0)
    return <div className="p-4 text-sm text-muted-foreground">Dados inválidos de ondas</div>;

  // === Dias únicos (para separadores e legendas) ===
  const uniqueDays = Array.from(
    new Set(formattedData.map((p) => new Date(p.time).toDateString()))
  );

  return (
    <div className="rounded-2xl shadow-md bg-gradient-to-b from-sky-50 via-blue-50/60 to-white p-4 border border-blue-100">
      {/* === Cabeçalho === */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-blue-900">
          Altura e Período das Ondas
        </h3>
        <p className="text-sm text-slate-600">
          Variação diária do swell e intensidade das séries
        </p>
      </div>

      {/* === Gráfico principal === */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />

          <XAxis
            dataKey="time"
            tickFormatter={(t) =>
              new Date(t).toLocaleString("pt-BR", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            }
            tick={{ fill: "#334155", fontSize: 11 }}
            minTickGap={30}
          />

          {/* Eixo da altura */}
          <YAxis
            yAxisId="left"
            tick={{ fill: "#334155", fontSize: 11 }}
            label={{
              value: "Altura (m)",
              angle: -90,
              position: "insideLeft",
              fill: "#334155",
              fontSize: 12,
            }}
          />
          {/* Eixo do período */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#334155", fontSize: 11 }}
            label={{
              value: "Período (s)",
              angle: 90,
              position: "insideRight",
              fill: "#334155",
              fontSize: 12,
            }}
            domain={[0, 20]}
          />

          {/* === Divisões verticais entre dias === */}
          {uniqueDays.slice(1).map((day, i) => (
            <ReferenceLine
              key={i}
              yAxisId="left" // ✅ Correção crítica
              x={
                formattedData.find(
                  (p) => new Date(p.time).toDateString() === day
                )?.time || ""
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

          {/* === Tooltip === */}
          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
            formatter={(value: any, name: string) => {
              if (name === "height") return [`${value.toFixed(2)} m`, "Altura"];
              if (name === "period") return [`${value.toFixed(1)} s`, "Período"];
              return [value];
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleString("pt-BR", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />

          {/* === Barras principais === */}
          <Bar
            yAxisId="left"
            dataKey="height"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.9}
            animationDuration={900}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* === Legenda dos dias === */}
      <div className="flex justify-around mt-3 text-sm text-slate-700 font-semibold">
        {uniqueDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="uppercase">
              {new Date(day).toLocaleDateString("pt-BR", {
                weekday: "long",
              })}
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

      {/* === Legenda de cores === */}
      <div className="flex justify-center flex-wrap gap-3 mt-3 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#06b6d4]" /> &lt;6s
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#22c55e]" /> 6–8s
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#facc15]" /> 8–10s
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#f97316]" /> 10–12s
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#ef4444]" /> 12–14s
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#a855f7]" /> 14–16s
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-[#7e22ce]" /> 16+
        </span>
      </div>
    </div>
  );
};

export default WaveHeightChart;
