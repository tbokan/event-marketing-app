import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ProfileAnswer, ResultsDistribution } from "@/types";
import { profiles } from "@/config/content.config";

interface PieChartProps {
  data: ResultsDistribution[];
  userAnswer?: ProfileAnswer;
}

const COLORS = profiles.map((p) => p.color);

export function PieChart({ data, userAnswer }: PieChartProps) {
  if (data.every((d) => d.count === 0)) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Čakam na rezultate...
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
            dataKey="count"
            nameKey="label"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.answer}
                fill={COLORS[index]}
                stroke={entry.answer === userAnswer ? "hsl(var(--foreground))" : "none"}
                strokeWidth={entry.answer === userAnswer ? 3 : 0}
                opacity={
                  userAnswer && entry.answer !== userAnswer ? 0.6 : 1
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${value} odgovorov`,
              name,
            ]}
          />
        </RechartsPie>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((entry, index) => (
          <div key={entry.answer} className="flex items-center gap-1.5 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
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
