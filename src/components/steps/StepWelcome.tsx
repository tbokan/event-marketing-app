import { uiContent } from "@/config/content.config";

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <img
        src="/ps-logo.svg"
        alt="Logo"
        className="mb-8 h-24 w-24 rounded-[20%]"
      />

      <h1 className="text-center text-3xl font-bold">
        {uiContent.welcome.title}
      </h1>

      <p className="mt-3 text-center text-lg text-muted-foreground">
        {uiContent.welcome.subtitle}
      </p>

      <p className="mt-6 max-w-sm text-center text-base text-foreground/80">
        {uiContent.welcome.copy}
      </p>

      <button
        onClick={onNext}
        className="mt-10 w-full max-w-sm rounded-lg bg-[#ffd541] px-6 py-3.5 text-base font-semibold text-black transition-opacity hover:opacity-90 active:opacity-80"
      >
        {uiContent.welcome.button}
      </button>
    </div>
  );
}
