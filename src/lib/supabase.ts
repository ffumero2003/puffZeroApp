import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ifjbatvmxeujewbrfjzg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmamJhdHZteGV1amV3YnJmanpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NjI2NjgsImV4cCI6MjA4MDUzODY2OH0.YmSBO9UhKJRM3o5HXRHq-irQrvDT2s9X7ivveUqFpAc",
  {
    auth: {
      storage: AsyncStorage,          // 🔴 OBLIGATORIO
      persistSession: true,           // 🔴 OBLIGATORIO
      autoRefreshToken: true,
      detectSessionInUrl: false,      // 🔴 OBLIGATORIO EN MOBILE
    },
  }
);
