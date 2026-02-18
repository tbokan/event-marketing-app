-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  answer TEXT NOT NULL CHECK (answer IN ('podatkovni', 'produktni', 'performance', 'ne_vem')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast aggregation queries (pie chart counts)
CREATE INDEX idx_submissions_answer ON public.submissions(answer);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public marketing form, no auth)
CREATE POLICY "anon_insert" ON public.submissions
  FOR INSERT WITH CHECK (true);

-- Allow anonymous selects (for realtime pie chart)
CREATE POLICY "anon_select" ON public.submissions
  FOR SELECT USING (true);

-- Enable Realtime for the submissions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
