import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/types";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface SubmitResponse {
  success: boolean;
  id: string;
}

export function useSubmission() {
  return useMutation({
    mutationFn: async (data: FormData): Promise<SubmitResponse> => {
      const { data: result, error } = await supabase.functions.invoke(
        "submit",
        { body: data }
      );

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const body = await error.context.json();
          throw new Error(body.message ?? body.error ?? error.message);
        }
        throw new Error(error.message);
      }

      return result as SubmitResponse;
    },
  });
}
