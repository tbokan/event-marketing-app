import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nameSchema, type NameFormValues } from "@/lib/validators";
import { uiContent } from "@/config/content.config";
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

interface StepNameProps {
  defaultValues?: Partial<NameFormValues>;
  onNext: (data: NameFormValues) => void;
}

export function StepName({ defaultValues, onNext }: StepNameProps) {
  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      lastname: defaultValues?.lastname ?? "",
    },
  });

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <h1 className="mb-8 text-center text-2xl font-bold">
        {uiContent.step1.title}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onNext)}
          className="w-full max-w-sm space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{uiContent.step1.nameLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={uiContent.step1.namePlaceholder}
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{uiContent.step1.lastnameLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={uiContent.step1.lastnamePlaceholder}
                    autoComplete="family-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg">
            {uiContent.step1.nextButton}
          </Button>
        </form>
      </Form>
    </div>
  );
}
