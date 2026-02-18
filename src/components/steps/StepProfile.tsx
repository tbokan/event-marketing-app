import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/lib/validators";
import { uiContent, profiles } from "@/config/content.config";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface StepProfileProps {
  defaultValues?: Partial<ProfileFormValues>;
  onNext: (data: ProfileFormValues) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function StepProfile({
  defaultValues,
  onNext,
  onBack,
  isSubmitting,
}: StepProfileProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      answer: defaultValues?.answer,
    },
  });

  const selectedAnswer = form.watch("answer");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <h1 className="mb-8 text-center text-2xl font-bold">
        {uiContent.step3.title}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onNext)}
          className="w-full max-w-sm space-y-6"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    {profiles.map((profile) => (
                      <label
                        key={profile.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all",
                          selectedAnswer === profile.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <RadioGroupItem value={profile.id} />
                        <span className="text-base font-medium">
                          {profile.label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Nazaj
            </Button>
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={!selectedAnswer || isSubmitting}
            >
              {isSubmitting ? "Pošiljam..." : uiContent.step3.nextButton}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
