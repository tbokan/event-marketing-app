import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <motion.div
          key={i}
          className={cn(
            "h-2 rounded-full",
            i === currentStep
              ? "bg-primary"
              : i < currentStep
                ? "bg-primary/50"
                : "bg-muted-foreground/30"
          )}
          animate={{
            width: i === currentStep ? 32 : 8,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      ))}
    </div>
  );
}
