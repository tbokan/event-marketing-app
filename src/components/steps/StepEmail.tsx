import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailFormValues } from "@/lib/validators";
import { uiContent } from "@/config/content.config";
import { useEmailTypoSuggestion } from "@/hooks/useEmailTypoSuggestion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";

interface StepEmailProps {
  defaultValues?: Partial<EmailFormValues>;
  onNext: (data: EmailFormValues) => void;
  onBack: () => void;
}

export function StepEmail({ defaultValues, onNext, onBack }: StepEmailProps) {
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: defaultValues?.email ?? "",
    },
  });

  const { suggestion, checkEmail, acceptSuggestion, dismissSuggestion } =
    useEmailTypoSuggestion();

  const handleAcceptSuggestion = () => {
    const corrected = acceptSuggestion();
    if (corrected) {
      form.setValue("email", corrected, { shouldValidate: true });
    }
  };

  const handleSubmit = async (data: EmailFormValues) => {
    setIsChecking(true);
    try {
      const { data: existing } = await supabase
        .from("submissions")
        .select("id")
        .eq("email", data.email)
        .maybeSingle();

      if (existing) {
        form.setError("email", {
          message: "S tem e-naslovom je že nekdo prijavljen.",
        });
        return;
      }

      onNext(data);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <h1 className="mb-8 text-center text-2xl font-bold">
        {uiContent.step2.title}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{uiContent.step2.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={uiContent.step2.emailPlaceholder}
                    autoComplete="email"
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      checkEmail(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {suggestion && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-sm">
                {uiContent.step2.typoSuggestion.replace(
                  "{suggestion}",
                  suggestion
                )}
              </p>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAcceptSuggestion}
                >
                  Da
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={dismissSuggestion}
                >
                  Ne
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onBack}
              disabled={isChecking}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Nazaj
            </Button>
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={isChecking}
            >
              {isChecking ? "Preverjam..." : uiContent.step2.nextButton}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
