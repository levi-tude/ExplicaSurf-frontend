import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";

export interface EnergyPoint {
  time: string;
  energy: number | null;
  energy_level: string | null;
}

interface EnergyChartProps {
  data: EnergyPoint[];
}

const getColor = (level: string | null) => {
  switch (level) {
    case "Baixa":
      return "#2ecc71"; // verde
    case "Média":
      return "#f1c40f"; // amarelo
    case "Alta":
      return "#e74c3c"; // vermelho
    default:
      return "#95a5a6"; // cinza
  }
};

const formatHour = (isoTime: string) => {
  const d = new Date(isoTime);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const EnergyChart: React.FC<EnergyChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72 bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Energia das Ondas</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="time" tickFormatter={formatHour} />
          <YAxis label={{ value: "Energia (altura × período)", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value: number) => `${value?.toFixed(1)} kW/m`}
            labelFormatter={(label) => `Hora: ${formatHour(label)}`}
          />
          <Legend />
          <Bar dataKey="energy" name="Energia" >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.energy_level)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyChart;
