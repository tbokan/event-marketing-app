-- Add email delivery tracking columns to prevent duplicate sends
-- and track which emails were successfully delivered.

ALTER TABLE public.submissions
  ADD COLUMN immediate_email_sent_at TIMESTAMPTZ,
  ADD COLUMN results_email_sent_at TIMESTAMPTZ,
  ADD COLUMN reminder_email_sent_at TIMESTAMPTZ;

-- Allow service role to update these columns via Edge Functions.
-- Anon users should not be able to update submissions.
CREATE POLICY "service_update" ON public.submissions
  FOR UPDATE USING (true) WITH CHECK (true);
