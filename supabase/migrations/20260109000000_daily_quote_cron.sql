-- ============================================
-- Daily Quote Notification Cron Job
-- Triggers at 14:00 UTC (8 AM Costa Rica)
-- ============================================

-- Enable pg_net extension for HTTP requests from cron
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Add push_token column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Remove existing job if it exists (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('daily-quote-notification');
EXCEPTION WHEN OTHERS THEN
  -- Job doesn't exist, ignore
END;
$$;

-- Schedule daily at 14:00 UTC (8 AM Costa Rica)
SELECT cron.schedule(
  'daily-quote-notification',
  '0 14 * * *',
  $$
  SELECT
    extensions.http_post(
      url := 'https://ifjbatvmxeujewbrfjzg.supabase.co/functions/v1/send-daily-quote-notification',
      headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmamJhdHZteGV1amV3YnJmanpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NjI2NjgsImV4cCI6MjA4MDUzODY2OH0.YmSBO9UhKJRM3o5HXRHq-irQrvDT2s9X7ivveUqFpAc", "Content-Type": "application/json"}'::jsonb,
      body := '{}'::jsonb
    );
  $$
);
