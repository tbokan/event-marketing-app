import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ProfileAnswer, ResultsDistribution } from "@/types";

interface PieChartProps {
  data: ResultsDistribution[];
  userAnswer?: ProfileAnswer;
}

const ACCENT_COLOR = "#ffd541";
const MUTED_COLORS = ["#cbd5e1", "#94a3b8", "#b0b5bf", "#a5aab5"];

export function PieChart({ data, userAnswer }: PieChartProps) {
  if (data.every((d) => d.count === 0)) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Čakam na rezultate...
      </div>
    );
  }

  const userEntry = data.find((d) => d.answer === userAnswer);
  const userPercentage = userEntry?.percentage ?? 0;
  const userLabel = userEntry?.label ?? "";

  const getColor = (entry: ResultsDistribution, index: number) =>
    entry.answer === userAnswer
      ? ACCENT_COLOR
      : MUTED_COLORS[index % MUTED_COLORS.length];

  return (
    <div className="w-full rounded-2xl bg-card p-4 shadow-lg">
      <div className="relative" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height={280}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={4}
              cornerRadius={6}
              dataKey="count"
              nameKey="label"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.answer}
                  fill={getColor(entry, index)}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined, name: string | undefined): [string, string] => {
                if (value === undefined || name === undefined) return ["", ""];
                return [`${value}%`, name];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </RechartsPie>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold">{userPercentage}%</div>
            <div className="mt-1 max-w-[120px] text-xs leading-tight text-muted-foreground">
              {userLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((entry, index) => (
          <div
            key={entry.answer}
            className="flex items-center gap-1.5 text-sm"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getColor(entry, index) }}
            />
            <span
              className={
                entry.answer === userAnswer
                  ? "font-semibold"
                  : "text-muted-foreground"
              }
            >
              {entry.label} ({entry.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
