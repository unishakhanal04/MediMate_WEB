import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../dashboard/Card";
import { AdherenceSeriesPoint } from "../../services/reports.service";

interface AdherenceChartProps {
  series: AdherenceSeriesPoint[];
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { payload: AdherenceSeriesPoint }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-bold text-gray-900">{label}</p>
      <p className="flex justify-between gap-4 text-xs text-gray-500">
        <span>Adherence</span>
        <strong className="text-gray-700">{point.percentage}%</strong>
      </p>
      <p className="flex justify-between gap-4 text-xs text-gray-500">
        <span>Taken</span>
        <strong className="text-gray-700">{point.taken}</strong>
      </p>
      <p className="flex justify-between gap-4 text-xs text-gray-500">
        <span>Missed</span>
        <strong className="text-gray-700">{point.missed}</strong>
      </p>
    </div>
  );
}

export function AdherenceChart({ series }: AdherenceChartProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-bold text-gray-900">Adherence Trend</h2>

      {series.length === 0 ? (
        <p className="py-6 text-sm text-gray-500">No adherence data yet for this period.</p>
      ) : (
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="percentage" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
