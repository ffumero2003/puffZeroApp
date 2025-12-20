import { useAuth } from "@/src/providers/auth-provider";
import { useEffect, useState } from "react";

export function useProgressViewModel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    loadProgressData();
  }, [user]);

  async function loadProgressData() {
    setLoading(true);
    
    // TODO: Load actual progress data from Supabase
    // For now, just simulate loading
    setTimeout(() => {
      setProgressData({
        // Mock data - replace with real data later
      });
      setLoading(false);
    }, 500);
  }

  return {
    loading,
    progressData,
    loadProgressData,
  };
}