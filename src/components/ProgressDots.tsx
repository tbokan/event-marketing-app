import { cn } from "@/lib/utils";

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === currentStep
              ? "w-8 bg-primary"
              : i < currentStep
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}
