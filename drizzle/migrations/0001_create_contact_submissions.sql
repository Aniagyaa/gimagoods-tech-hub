CREATE TABLE public.contact_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
 email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
 phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 25),
 subject text NOT NULL CHECK (char_length(subject) BETWEEN 2 AND 150),
 message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000)
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit contact messages" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Ready customer administrators read messages" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'customers.view') AND EXISTS (SELECT 1 FROM public.admin_accounts WHERE user_id = auth.uid() AND status = 'active' AND must_change_password = false));
CREATE INDEX contact_submissions_created_at_idx ON public.contact_submissions (created_at DESC);