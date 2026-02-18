import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileAnswer, ResultsDistribution } from "@/types";
import { profiles } from "@/config/content.config";

export function useRealtimeResults(userAnswer?: ProfileAnswer) {
  const [results, setResults] = useState<ResultsDistribution[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    const { data, error } = await supabase.from("submissions").select("answer");

    if (error || !data) return;

    const counts: Record<string, number> = {};
    profiles.forEach((p) => (counts[p.id] = 0));
    data.forEach((row) => {
      if (counts[row.answer] !== undefined) counts[row.answer]++;
    });

    const total = data.length;
    setTotalCount(total);
    setResults(
      profiles.map((p) => ({
        answer: p.id,
        count: counts[p.id],
        percentage: total > 0 ? Math.round((counts[p.id] / total) * 100) : 0,
        label: p.label,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel("submissions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "submissions" },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchResults]);

  const userPercentage =
    results.find((r) => r.answer === userAnswer)?.percentage ?? 0;

  return { results, totalCount, userPercentage, loading };
}
