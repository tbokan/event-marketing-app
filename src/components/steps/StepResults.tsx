import { useRealtimeResults } from "@/hooks/useRealtimeResults";
import { uiContent, getProfileLabel } from "@/config/content.config";
import { PieChart } from "@/components/PieChart";
import type { ProfileAnswer } from "@/types";

interface StepResultsProps {
  userAnswer: ProfileAnswer;
}

export function StepResults({ userAnswer }: StepResultsProps) {
  const { results, userPercentage, loading } = useRealtimeResults(userAnswer);

  const message = uiContent.step4.userMessage
    .replace("{percentage}", String(userPercentage))
    .replace("{answer}", getProfileLabel(userAnswer));

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {uiContent.step4.title}
      </h1>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Nalagam rezultate...
        </div>
      ) : (
        <>
          <PieChart data={results} userAnswer={userAnswer} />
          <p className="mt-6 text-center text-lg font-medium">{message}</p>
        </>
      )}
    </div>
  );
}
