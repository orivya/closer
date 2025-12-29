import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Decision {
  id: string;
  title: string;
  context: string | null;
  category: string | null;
  status: string | null;
  starred: boolean | null;
  resolved_at: string | null;
  created_at: string;
}

export function useDecisions() {
  const { user } = useAuth();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDecisions = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from("decisions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching decisions:", error);
    } else {
      setDecisions((data || []) as Decision[]);
    }
    
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const openDecisions = decisions.filter(d => d.status === "open" || !d.status);
  const resolvedDecisions = decisions.filter(d => d.status === "resolved");

  return {
    decisions,
    openDecisions,
    resolvedDecisions,
    isLoading,
    fetchDecisions,
  };
}
