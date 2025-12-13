import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://ifjbatvmxeujewbrfjzg.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmamJhdHZteGV1amV3YnJmanpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NjI2NjgsImV4cCI6MjA4MDUzODY2OH0.YmSBO9UhKJRM3o5HXRHq-irQrvDT2s9X7ivveUqFpAc";
  

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
