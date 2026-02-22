import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useFormWizard } from "@/hooks/useFormWizard";
import { useSubmission } from "@/hooks/useSubmission";
import { ProgressDots } from "@/components/ProgressDots";
import { StepWelcome } from "@/components/steps/StepWelcome";
import { StepName } from "@/components/steps/StepName";
import { StepEmail } from "@/components/steps/StepEmail";
import { StepProfile } from "@/components/steps/StepProfile";
import { StepResults } from "@/components/steps/StepResults";
import type { FormData, ProfileAnswer } from "@/types";
import type { NameFormValues } from "@/lib/validators";
import type { EmailFormValues } from "@/lib/validators";
import type { ProfileFormValues } from "@/lib/validators";

const slideVariants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 300 : -300,
    y: 10,
    opacity: 0,
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
  },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -300 : 300,
    y: 10,
    opacity: 0,
  }),
};

export function FormWizard() {
  const {
    currentStep,
    direction,
    formData,
    isSubmitted,
    goNext,
    goBack,
    updateFormData,
    markSubmitted,
  } = useFormWizard();

  const submission = useSubmission();

  const handleNameNext = (data: NameFormValues) => {
    updateFormData(data);
    goNext();
  };

  const handleEmailNext = (data: EmailFormValues) => {
    updateFormData(data);
    goNext();
  };

  const handleProfileNext = async (data: ProfileFormValues) => {
    const completeData: FormData = {
      name: formData.name!,
      lastname: formData.lastname!,
      email: formData.email!,
      answer: data.answer as ProfileAnswer,
    };

    updateFormData({ answer: data.answer as ProfileAnswer });

    try {
      await submission.mutateAsync(completeData);
      markSubmitted();
      goNext();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Prišlo je do napake";
      toast.error(message);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepWelcome onNext={goNext} />;
      case 1:
        return (
          <StepName
            defaultValues={formData}
            onNext={handleNameNext}
          />
        );
      case 2:
        return (
          <StepEmail
            defaultValues={formData}
            onNext={handleEmailNext}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <StepProfile
            defaultValues={formData}
            onNext={handleProfileNext}
            onBack={goBack}
            isSubmitting={submission.isPending}
          />
        );
      case 4:
        return isSubmitted && formData.answer ? (
          <StepResults userAnswer={formData.answer} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="fixed left-0 right-0 top-0 z-10 pt-6">
        <ProgressDots currentStep={currentStep} totalSteps={5} />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
